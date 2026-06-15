/* ==========================================================================
   IL MARE DI PINELLA — Recensioni REALI da Google (via Netlify Function)
   ==========================================================================
   Questo file gira nel browser e NON contiene nessuna chiave segreta.
   Chiede le recensioni a /api/reviews (la Netlify Function in
   netlify/functions/reviews.js), che parla con Google lato server.

   • La configurazione (chiave + Place ID) si mette su NETLIFY come variabili
     d'ambiente — vedi le istruzioni in netlify/functions/reviews.js.
   • Niente recensioni finte: se mancano i dati, la sezione mostra solo un
     messaggio neutro con il link a Google.
   • In locale (senza Netlify) /api/reviews non esiste → si vede il messaggio
     neutro. Per provarlo in locale serve la Netlify CLI:  `netlify dev`.
   ========================================================================== */

(() => {
  "use strict";
  const root = document.querySelector("[data-reviews]");
  if (!root) return;

  const ENDPOINT = "/api/reviews?v=1";
  const GOOGLE_SEARCH = "https://www.google.com/maps/search/Il+Mare+di+Pinella+Siracusa";

  /* ---- Avatar: tavolozza per le iniziali (quando manca la foto Google) ---- */
  const AVATAR = ["#1B4096", "#E2722B", "#6E9A2E", "#E3A81B", "#29539E", "#C0492F"];

  /* ---- Una stella SVG (riempita via currentColor) ---- */
  const STAR = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.95 6.18 6.8.78-5.06 4.6 1.4 6.69L12 17.9l-6.09 3.35 1.4-6.69L2.25 9.96l6.8-.78L12 2.5z"/></svg>`;
  const FIVE = STAR.repeat(5);

  /* ---- Logo "G" di Google ---- */
  const GOOGLE_G = `<svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.55-5.17 3.55-8.87z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24z"/>
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.27a12 12 0 0 0 0 10.76l4-3.09z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.62l4 3.09C6.22 6.86 8.87 4.75 12 4.75z"/>
    </svg>`;

  /* ---- Blocco di 5 stelle che mostra un voto (anche con decimali) ---- */
  function stars(rating, extraClass = "") {
    const pct = Math.max(0, Math.min(100, (rating / 5) * 100)).toFixed(1);
    return `<span class="stars ${extraClass}" role="img" aria-label="${rating} su 5 stelle">
        <span class="stars__row stars__row--base">${FIVE}</span>
        <span class="stars__row stars__row--fill" style="width:${pct}%">${FIVE}</span>
      </span>`;
  }

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---- Avatar: foto Google se disponibile, altrimenti iniziali colorate ---- */
  function avatar(rv, i) {
    if (rv.photo) {
      return `<span class="review-card__avatar" style="background:#ddd center/cover no-repeat url('${encodeURI(rv.photo)}')" aria-hidden="true"></span>`;
    }
    return `<span class="review-card__avatar" style="background:${AVATAR[i % AVATAR.length]}">${initials(rv.name)}</span>`;
  }

  /* ---- Aggiorna il pulsante "Lascia una recensione" col link diretto ---- */
  function wireWriteReviewButton(href) {
    if (!href) return;
    const btn = document.querySelector("[data-google-link]");
    if (btn) btn.href = href;
  }

  /* ---- Messaggio neutro (nessun dato inventato) ---- */
  function renderMessage(html) {
    root.innerHTML = `<div class="reviews-empty center" style="padding:2rem 0">${html}</div>`;
  }

  function renderError(placeUrl) {
    renderMessage(`
      <p style="opacity:.85;max-width:46ch;margin-inline:auto">
        Al momento non riusciamo a mostrare le recensioni qui.
        Le trovi tutte sulla nostra scheda Google.
      </p>
      <p style="margin-top:1rem">
        <a class="btn" href="${placeUrl || GOOGLE_SEARCH}" target="_blank" rel="noopener">${GOOGLE_G}&nbsp; Leggi le recensioni su Google →</a>
      </p>`);
  }

  /* ---- Render principale ---- */
  function render(reviews, avg, total) {
    const avgStr = (avg || 0).toFixed(1).replace(".", ",");
    const totalTxt = total
      ? `Basato su <b>${total} recensioni</b> su Google`
      : `Le recensioni dei nostri ospiti su Google`;

    const overall = `
      <div class="reviews-overall" data-reveal>
        <div class="reviews-overall__score">${avgStr}</div>
        <div class="reviews-overall__meta">
          ${stars(avg, "stars--lg")}
          <p class="reviews-overall__count">${GOOGLE_G} ${totalTxt}</p>
        </div>
      </div>`;

    const cards = reviews.map((rv, i) => `
      <article class="review-card" data-reveal data-delay="${(i % 3) + 1}">
        <header class="review-card__head">
          ${avatar(rv, i)}
          <span class="review-card__id">
            <span class="review-card__name">${escapeHtml(rv.name)}</span>
            <span class="review-card__date">${GOOGLE_G} ${escapeHtml(rv.date)}</span>
          </span>
        </header>
        ${stars(rv.rating)}
        ${rv.text ? `<p class="review-card__text">${escapeHtml(rv.text)}</p>` : ""}
      </article>`).join("");

    root.innerHTML = overall + `<div class="reviews-grid">${cards}</div>`;
    if (window.MarePinella && window.MarePinella.observeReveals) window.MarePinella.observeReveals(root);
  }

  /* ---- Carica le recensioni dalla Netlify Function ---- */
  async function load() {
    renderMessage(`<p style="opacity:.7">Carico le recensioni da Google…</p>`);
    try {
      const res = await fetch(ENDPOINT, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      wireWriteReviewButton(data.writeReviewUrl);

      const reviews = Array.isArray(data.reviews) ? data.reviews : [];
      if (!reviews.length) {
        if (data.error) console.warn("[recensioni] nessuna recensione:", data.error);
        renderError(data.url);
        return;
      }
      render(reviews, data.rating, data.total);
    } catch (e) {
      console.warn("[recensioni] /api/reviews non raggiungibile:", e.message,
        "\n(In locale è normale: serve Netlify. In produzione controlla la function e le variabili d'ambiente.)");
      renderError();
    }
  }

  load();
})();
