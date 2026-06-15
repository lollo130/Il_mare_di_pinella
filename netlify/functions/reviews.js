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
     • Abilita «Places API».
     • Restrizione consigliata: "Limitazioni API" → solo «Places API».
       (Niente referrer: qui la chiave è server-side, non si vede dal browser.)
     • Imposta un tetto di spesa / avviso di budget per sicurezza.

   Il browser chiama /api/reviews (vedi netlify.toml) e riceve solo il JSON
   già pronto delle recensioni — senza vedere la chiave.
   ========================================================================== */

const ENDPOINT = "https://maps.googleapis.com/maps/api/place/details/json";

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

  const url =
    `${ENDPOINT}?place_id=${encodeURIComponent(placeId)}` +
    "&language=it&reviews_no_translations=true" +
    "&fields=rating,user_ratings_total,reviews,url" +
    `&key=${encodeURIComponent(key)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK") return empty(data.status || "errore_google");

    const r = data.result || {};
    const reviews = (r.reviews || []).map((g) => ({
      name: g.author_name || "Ospite Google",
      rating: g.rating || 0,
      date: g.relative_time_description || "",
      text: g.text || "",
      photo: g.profile_photo_url || "",
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        rating: r.rating || 0,
        total: r.user_ratings_total || 0,
        url: r.url || "",
        writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
        reviews,
      }),
    };
  } catch (e) {
    return empty("fetch_fallito");
  }
};
