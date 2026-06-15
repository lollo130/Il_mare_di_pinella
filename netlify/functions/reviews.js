/* ==========================================================================
   IL MARE DI PINELLA — Netlify Function: recensioni reali da Google
   ==========================================================================
   Gira SUL SERVER di Netlify (non nel browser). La chiave Google resta qui,
   nascosta in una variabile d'ambiente: NON finisce mai nel sito pubblico.

   ⚙️  CONFIGURAZIONE — su Netlify: Site settings → Environment variables →
       aggiungi queste 2 variabili:

         GOOGLE_PLACES_API_KEY = la tua chiave API Google
         GOOGLE_PLACE_ID       = il Place ID del locale (inizia con "ChI…")

   Sulla chiave (Google Cloud Console):
     • Abilita «Places API (New)».
     • Restrizione consigliata: "Limitazioni API" → solo «Places API (New)».
       (Niente referrer: qui la chiave è server-side, non si vede dal browser.)
     • Imposta un tetto di spesa / avviso di budget per sicurezza.

   Il browser chiama /api/reviews (vedi netlify.toml) e riceve solo il JSON
   già pronto delle recensioni — senza vedere la chiave.
   ========================================================================== */

const ENDPOINT = "https://places.googleapis.com/v1/places/";

exports.handler = async () => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    // Cache 1h sulla CDN Netlify → meno chiamate a Google = meno costi
    "Cache-Control": "public, max-age=3600",
    "Netlify-CDN-Cache-Control": "public, max-age=3600, durable",
  };

  // Risposte sempre 200: il sito gestisce da solo il caso "vuoto" (nessun dato finto)
  const empty = (error) => ({ statusCode: 200, headers, body: JSON.stringify({ error, reviews: [] }) });

  if (!key || !placeId) return empty("config_mancante");

  // Places API (New): GET /v1/places/{id} con chiave nell'header e field mask
  const url = `${ENDPOINT}${encodeURIComponent(placeId)}?languageCode=it`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
    });
    const data = await res.json();

    if (!res.ok) return empty((data.error && data.error.status) || ("HTTP_" + res.status));

    const reviews = (data.reviews || []).map((g) => ({
      name: (g.authorAttribution && g.authorAttribution.displayName) || "Ospite Google",
      rating: g.rating || 0,
      date: g.relativePublishTimeDescription || "",
      text: (g.text && g.text.text) || (g.originalText && g.originalText.text) || "",
      photo: (g.authorAttribution && g.authorAttribution.photoUri) || "",
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        rating: data.rating || 0,
        total: data.userRatingCount || 0,
        url: data.googleMapsUri || "",
        writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
        reviews,
      }),
    };
  } catch (e) {
    return empty("fetch_fallito");
  }
};
