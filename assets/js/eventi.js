/* ==========================================================================
   IL MARE DI PINELLA — Eventi (eventi.html)
   ==========================================================================
   Legge gli eventi PUBBLICATI da Supabase:
     • futuri (data >= oggi)  → in alto
     • passati (data < oggi)  → archivio in fondo
   Nessun dato finto: se non c'è nulla o c'è un errore, mostra il messaggio
   "nessun evento" con i link social (stesso comportamento delle recensioni).
   I proprietari pubblicano dalla pagina nascosta gestione-eventi.html.
   ========================================================================== */
(() => {
  "use strict";

  const futuriBox = document.querySelector("[data-eventi-futuri]");
  if (!futuriBox) return; // non siamo nella pagina eventi

  const passatiSec = document.querySelector("#eventi-passati");
  const passatiBox = document.querySelector("[data-eventi-passati]");
  const emptyBox   = document.querySelector("[data-eventi-empty]");
  const stateBox   = document.querySelector("[data-eventi-state]");

  const MESI = {
    it: ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    fr: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
  };
  const lang = () =>
    (window.MarePinella && window.MarePinella.getLang && window.MarePinella.getLang()) || "it";

  let DATA = { futuri: [], passati: [] };

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function card(ev, past) {
    const d = new Date(ev.data + "T00:00:00");
    const day = String(d.getDate());
    const mon = (MESI[lang()] || MESI.it)[d.getMonth()] || "";
    const poster = ev.locandina_url
      ? `<a class="event-card__poster" href="${esc(ev.locandina_url)}" target="_blank" rel="noopener">
           <img src="${esc(ev.locandina_url)}" alt="${esc(ev.titolo)}" loading="lazy">
         </a>`
      : "";
    const H = past ? "3" : "2";
    return `<article class="event-card${past ? " event-card--past" : ""}" data-reveal>
      ${poster}
      <div class="event-card__body">
        <span class="event-card__when"><span class="d">${esc(day)}</span> ${esc(mon)}${ev.ora ? ` · ${esc(ev.ora)}` : ""}</span>
        <h${H} class="event-card__title">${esc(ev.titolo)}</h${H}>
        ${ev.descrizione ? `<p class="event-card__desc">${esc(ev.descrizione)}</p>` : ""}
      </div>
    </article>`;
  }

  function render() {
    futuriBox.innerHTML = DATA.futuri.map((e) => card(e, false)).join("");
    if (passatiBox && DATA.passati.length) {
      passatiBox.innerHTML = DATA.passati.map((e) => card(e, true)).join("");
      if (passatiSec) passatiSec.hidden = false;
    } else if (passatiSec) {
      passatiSec.hidden = true;
    }
    if (emptyBox) emptyBox.hidden = DATA.futuri.length !== 0;
    if (window.MarePinella && window.MarePinella.observeReveals)
      window.MarePinella.observeReveals(document);
  }

  function todayISO() {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }

  async function load() {
    const ok = window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY;
    if (!ok) { if (stateBox) stateBox.hidden = true; if (emptyBox) emptyBox.hidden = false; return; }

    const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    const iso = todayISO();
    try {
      const { data, error } = await sb
        .from("eventi")
        .select("*")
        .eq("pubblicato", true)
        .order("data", { ascending: true });
      if (error) throw error;
      DATA.futuri  = (data || []).filter((e) => e.data >= iso);
      DATA.passati = (data || []).filter((e) => e.data <  iso).reverse(); // più recenti prima
    } catch (e) {
      DATA = { futuri: [], passati: [] };
    } finally {
      if (stateBox) stateBox.hidden = true;
      render();
    }
  }

  document.addEventListener("mare:langchange", render);
  load();
})();
