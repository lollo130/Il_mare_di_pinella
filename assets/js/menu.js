/* ==========================================================================
   IL MARE DI PINELLA — Menù interattivo (dati da Supabase + render + filtri)
   - Il menù è modificabile dal pannello riservato (gestione-eventi.html):
     i dati arrivano dalle tabelle Supabase menu_categorie + menu_piatti.
   - Se il database non risponde (o è vuoto) si usa il menù di base contenuto
     in assets/js/menu-data.js (window.MENU_SEED): il sito non resta mai vuoto.
   - Ogni piatto ha nome e descrizione in 3 lingue: IT / EN / FR.
   - Filtri JS (Mare / Terra / Vegetariano / Senza glutine / Vini) senza reload.
   - Il render segue la lingua scelta (window.MarePinella.getLang) e si ri-genera
     al cambio lingua ("mare:langchange") e quando arrivano i dati dal DB
     ("mare:menuloaded").
   Campi di ogni piatto:
     n=nome IT · e=nome EN · f=nome FR
     d=descr. IT · de=descr. EN · df=descr. FR
     p=prezzo · a=allergeni (codici) · t=tag (mare/terra/veg/vini)
   Codici allergeni: 1 Glutine · 2 Crostacei · 3 Uova · 4 Pesce · 5 Frutta a
   guscio · 6 Latte · 7 Sedano · 8 Solfiti · 9 Molluschi.
   ========================================================================== */

/* Dati correnti del menù. Partono dal menù di base (fallback) e vengono
   sostituiti dai dati del database appena disponibili. */
let MENU = Array.isArray(window.MENU_SEED) ? window.MENU_SEED : [];

/* ---- Caricamento dal database (Supabase) ---- */
(async function loadMenuFromSupabase() {
  "use strict";
  try {
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return;
    const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    const [catsRes, dishRes] = await Promise.all([
      sb.from("menu_categorie").select("*").order("ordine", { ascending: true }),
      sb.from("menu_piatti").select("*").eq("visibile", true).order("ordine", { ascending: true }),
    ]);
    if (catsRes.error) throw catsRes.error;
    if (dishRes.error) throw dishRes.error;
    const cats = catsRes.data || [];
    const dishes = dishRes.data || [];
    if (!cats.length) return; // DB non ancora popolato: resta il menù di base

    const byId = {};
    cats.forEach((c) => {
      byId[c.id] = {
        cat: c.cat, en: c.en || "", fr: c.fr || "",
        note: c.note || "", noteEn: c.note_en || "", noteFr: c.note_fr || "",
        items: [],
      };
    });
    dishes.forEach((d) => {
      const c = byId[d.categoria_id];
      if (!c) return;
      c.items.push({
        n: d.n, e: d.e || "", f: d.f || "",
        d: d.d || "", de: d.de || "", df: d.df || "",
        p: d.p || "", a: d.a || [], t: d.t || [],
      });
    });
    // Solo categorie con almeno un piatto visibile, nell'ordine del DB
    MENU = cats.map((c) => byId[c.id]).filter((c) => c && c.items.length);
    document.dispatchEvent(new CustomEvent("mare:menuloaded"));
  } catch (err) {
    console.warn("[menu] Database non raggiungibile: mostro il menù di base.", err);
  }
})();

(() => {
  "use strict";
  const root = document.querySelector("[data-menu]");
  if (!root) return;

  const TAGS = {
    it: { mare: "Mare", terra: "Terra", veg: "Veg" },
    en: { mare: "Sea", terra: "Land", veg: "Veg" },
    fr: { mare: "Mer", terra: "Terre", veg: "Vég" },
  };
  const EMPTY = {
    it: "Nessun piatto per questo filtro.",
    en: "No dishes for this filter.",
    fr: "Aucun plat pour ce filtre.",
  };

  let currentFilter = "all";

  function lang() {
    return (window.MarePinella && window.MarePinella.getLang) ? window.MarePinella.getLang() : "it";
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function name(it, l) { return l === "en" ? (it.e || it.n) : l === "fr" ? (it.f || it.e || it.n) : it.n; }
  function desc(it, l) { return l === "en" ? (it.de || "") : l === "fr" ? (it.df || it.de || "") : (it.d || ""); }
  function catName(c, l) { return l === "en" ? (c.en || c.cat) : l === "fr" ? (c.fr || c.en || c.cat) : c.cat; }
  function catNote(c, l) { return l === "en" ? (c.noteEn || c.note) : l === "fr" ? (c.noteFr || c.noteEn || c.note) : c.note; }

  /* ---- Render del markup a partire dai dati (nella lingua corrente) ---- */
  function render() {
    const l = lang();
    const tagLabel = TAGS[l] || TAGS.it;

    const html = MENU.map((c, ci) => {
      const items = (c.items || []).map((it) => {
        const tlist = it.t || [], alist = it.a || [];
        const tags = tlist.filter((t) => tagLabel[t])
          .map((t) => `<span class="chip chip--${t}">${tagLabel[t]}</span>`).join("");
        const all = alist.length ? `<span class="menu-item__all" title="Allergeni">(${alist.join(", ")})</span>` : "";
        const dtxt = desc(it, l);
        const descHtml = dtxt ? `<div class="menu-item__desc">${esc(dtxt)}</div>` : "";
        return `
          <div class="menu-item" data-tags="${tlist.join(" ")}" data-all="${alist.join(",")}">
            <div class="menu-item__main">
              <div class="menu-item__head">
                <span class="menu-item__name">${esc(name(it, l))}</span>${all}
                <span class="menu-item__tags">${tags}</span>
                <span class="menu-item__dots"></span>
                <span class="menu-item__price">${esc(it.p)}</span>
              </div>
              ${descHtml}
            </div>
          </div>`;
      }).join("");
      const noteTxt = catNote(c, l);
      const note = noteTxt ? `<p class="muted" style="margin:-0.6rem 0 1rem;font-size:.88rem">${esc(noteTxt)}</p>` : "";
      return `
        <section class="menu-cat" data-reveal data-delay="${(ci % 3) + 1}">
          <h3 class="menu-cat__title">${esc(catName(c, l))}</h3>
          ${note}
          <div class="menu-list">${items}</div>
        </section>`;
    }).join("");

    root.innerHTML = html + `<p class="menu-empty">${EMPTY[l] || EMPTY.it}</p>`;

    // Aggancia il reveal condiviso ai nuovi elementi
    if (window.MarePinella && window.MarePinella.observeReveals) window.MarePinella.observeReveals(root);
    // Ri-applica il filtro attivo dopo un nuovo render
    doFilter(currentFilter);
  }

  /* ---- Filtri dinamici (con crossfade fluido) ---- */
  function applyFilter(filter) {
    currentFilter = filter;
    root.style.opacity = "0";
    setTimeout(() => { doFilter(filter); root.style.opacity = "1"; }, 180);
  }

  function doFilter(filter) {
    const items = root.querySelectorAll(".menu-item");
    let anyVisible = false;

    items.forEach((el) => {
      const tags = (el.dataset.tags || "").split(" ").filter(Boolean);
      const all  = (el.dataset.all || "").split(",").filter(Boolean);
      let show;
      if (filter === "all")      show = true;
      else if (filter === "gf")  show = !all.includes("1");          // senza glutine
      else                       show = tags.includes(filter);        // mare/terra/veg/vini
      el.classList.toggle("is-hidden", !show);
      if (show) anyVisible = true;
    });

    // Nascondi le categorie senza piatti visibili
    root.querySelectorAll(".menu-cat").forEach((cat) => {
      const visible = cat.querySelectorAll(".menu-item:not(.is-hidden)").length;
      cat.classList.toggle("is-hidden", visible === 0);
    });

    const empty = root.querySelector(".menu-empty");
    if (empty) empty.style.display = anyVisible ? "none" : "block";
  }

  /* ---- Bind dei pulsanti filtro ---- */
  function bindFilters() {
    const bar = document.querySelector("[data-menu-filters]");
    if (!bar) return;
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      bar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter(btn.dataset.filter);
    });
  }

  render();
  bindFilters();

  // Ri-render quando cambia lingua o quando arrivano i dati dal database
  document.addEventListener("mare:langchange", render);
  document.addEventListener("mare:menuloaded", render);
})();

/* ==========================================================================
   SELETTORE MENÙ — "Alla carta" ⇄ "Menù fisso" (crossfade, niente reload)
   ========================================================================== */
(() => {
  "use strict";
  const bar = document.querySelector("[data-menu-mode]");
  if (!bar) return;

  const panels   = Array.from(document.querySelectorAll(".menu-panel[data-mode]"));
  const cartaOnly = Array.from(document.querySelectorAll("[data-carta-only]"));

  function setMode(mode) {
    bar.querySelectorAll("[data-mode-btn]").forEach((b) => {
      const on = b.dataset.modeBtn === mode;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    // I filtri esistono solo per il menù alla carta
    cartaOnly.forEach((el) => { el.hidden = mode !== "carta"; });
    // Crossfade dei pannelli
    panels.forEach((p) => {
      if (p.dataset.mode === mode) {
        p.hidden = false;
        requestAnimationFrame(() => p.classList.add("is-active"));
      } else {
        p.classList.remove("is-active");
        p.hidden = true;
      }
    });
  }

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-mode-btn]");
    if (btn) setMode(btn.dataset.modeBtn);
  });
})();
