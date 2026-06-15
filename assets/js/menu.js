/* ==========================================================================
   IL MARE DI PINELLA — Menù interattivo (dati + render + filtri dinamici)
   - Il menù è interamente in pagina (nessun PDF).
   - Ogni piatto: nome IT, traduzione EN, descrizione, prezzo, allergeni, tag.
   - Filtri JS (Mare / Terra / Vegetariano / Senza glutine / Vini) senza reload.
   ==========================================================================
   NOTA PROPRIETARI: questo è un menù di esempio, realistico e completo, basato
   sulla cucina di mare siciliana. Aggiornate liberamente nomi, descrizioni e
   PREZZI qui sotto: il sito si aggiorna da solo (HTML generato da questi dati).
   Codici allergeni: 1 Glutine · 2 Crostacei · 3 Uova · 4 Pesce · 5 Frutta a
   guscio · 6 Latte · 7 Sedano · 8 Solfiti · 9 Molluschi.
   tag possibili: "mare", "terra", "veg", "vini".
   ========================================================================== */

const MENU = [
  {
    cat: "Antipasti di Mare", en: "Seafood Starters",
    items: [
      { n: "Antipasto del Mare di Pinella", e: "House seafood platter", d: "Selezione di crudi e cotti del giorno", p: "€18", a: [2,4,9], t: ["mare"] },
      { n: "Caponata di Pesce Spada", e: "Swordfish caponata", d: "Spada in agrodolce con verdure di stagione", p: "€12", a: [4,8], t: ["mare"] },
      { n: "Sautè di Cozze", e: "Sautéed mussels", d: "Cozze profumate al prezzemolo, aglio e pepe nero", p: "€11", a: [9], t: ["mare"] },
      { n: "Polpo Arrosto su Purè", e: "Roasted octopus on potato purée", d: "Polpo arrostito su vellutato purè di patate", p: "€14", a: [6,9], t: ["mare"] },
      { n: "Insalata di Mare", e: "Seafood salad", d: "Polpo, calamari e gamberi con sedano e limone", p: "€13", a: [2,7,9], t: ["mare"] },
      { n: "Gamberi alla Catalana", e: "Catalan-style prawns", d: "Gamberi, cipolla rossa di Tropea e pomodoro", p: "€15", a: [2], t: ["mare"] },
    ],
  },
  {
    cat: "Antipasti di Terra", en: "Land Starters",
    items: [
      { n: "Tagliere Siciliano", e: "Sicilian sharing board", d: "Salumi, formaggi locali, olive e caponata", p: "€14", a: [6,8], t: ["terra"] },
      { n: "Caponata di Melanzane", e: "Aubergine caponata", d: "Classico agrodolce siciliano di melanzane", p: "€8", a: [8], t: ["terra","veg"] },
      { n: "Arancini (2 pz)", e: "Fried rice balls", d: "Al ragù di carne o al burro", p: "€7", a: [1,3,6,7], t: ["terra"] },
      { n: "Crocchè di Patate", e: "Potato croquettes", d: "Croccanti fuori, morbide dentro", p: "€6", a: [1,3,6], t: ["terra","veg"] },
    ],
  },
  {
    cat: "Primi", en: "First Courses",
    items: [
      { n: "Spaghetti alle Vongole", e: "Spaghetti with clams", d: "Vongole veraci, aglio, prezzemolo e olio EVO", p: "€14", a: [1,9], t: ["mare"] },
      { n: "Risotto alla Marinara", e: "Seafood risotto", d: "Riso mantecato con frutti di mare freschi", p: "€16", a: [2,4,9], t: ["mare"] },
      { n: "Linguine al Nero di Seppia", e: "Squid-ink linguine", d: "Linguine con seppia e il suo nero", p: "€15", a: [1,9], t: ["mare"] },
      { n: "Spaghetti ai Ricci di Mare", e: "Sea-urchin spaghetti", d: "Stagionale, secondo disponibilità", p: "€18", a: [1,9], t: ["mare"] },
      { n: "Casarecce alla Norma", e: "Pasta alla Norma", d: "Melanzane fritte, pomodoro e ricotta salata", p: "€11", a: [1,6], t: ["terra","veg"] },
      { n: "Busiate al Pesto Trapanese", e: "Busiate, Trapani pesto", d: "Mandorle, pomodoro fresco e basilico", p: "€12", a: [1,5], t: ["terra","veg"] },
    ],
  },
  {
    cat: "Secondi", en: "Main Courses",
    items: [
      { n: "Grigliata di Mare", e: "Mixed grilled seafood", d: "Pesce, crostacei e molluschi alla griglia", p: "€22", a: [2,4,9], t: ["mare"] },
      { n: "Frittura di Paranza", e: "Mixed fried fish", d: "Calamari, gamberi e pesce di paranza", p: "€18", a: [1,2,4], t: ["mare"] },
      { n: "Calamaro alla Griglia", e: "Grilled squid", d: "Olio, limone e prezzemolo", p: "€16", a: [9], t: ["mare"] },
      { n: "Pesce Spada alla Ghiotta", e: "Swordfish 'ghiotta'", d: "Pomodoro, capperi, olive e cipolla", p: "€19", a: [4,8], t: ["mare"] },
      { n: "Tonno in Crosta di Pistacchio", e: "Pistachio-crusted tuna", d: "Tonno scottato in crosta di pistacchio di Bronte", p: "€21", a: [4,5], t: ["mare"] },
      { n: "Pescato del Giorno", e: "Catch of the day", d: "Secondo disponibilità — chiedi al personale", p: "s.q.", a: [4], t: ["mare"] },
      { n: "Scaloppine al Limone", e: "Veal escalopes with lemon", d: "Fettine tenere al limone o vino bianco", p: "€16", a: [1], t: ["terra"] },
    ],
  },
  {
    cat: "Contorni", en: "Sides",
    items: [
      { n: "Patate al Forno", e: "Roasted potatoes", d: "Con rosmarino", p: "€5", a: [], t: ["veg"] },
      { n: "Verdure Grigliate", e: "Grilled vegetables", d: "Di stagione", p: "€6", a: [], t: ["veg"] },
      { n: "Insalata Mista", e: "Mixed salad", d: "Fresca del giorno", p: "€5", a: [], t: ["veg"] },
      { n: "Caponatina", e: "Small caponata", d: "Porzione singola", p: "€5", a: [8], t: ["veg"] },
    ],
  },
  {
    cat: "Dessert", en: "Desserts",
    items: [
      { n: "Cannolo Siciliano", e: "Sicilian cannolo", d: "Ricotta fresca e gocce di cioccolato", p: "€6", a: [1,3,5,6], t: ["veg"] },
      { n: "Cassata Siciliana", e: "Sicilian cassata", d: "Pan di Spagna, ricotta e pasta reale", p: "€7", a: [1,3,5,6], t: ["veg"] },
      { n: "Setteveli", e: "Seven-veil chocolate cake", d: "Sette strati di cioccolato e nocciola", p: "€6", a: [1,3,5,6], t: ["veg"] },
      { n: "Granita & Brioche", e: "Granita with brioche", d: "Limone, mandorla o caffè", p: "€6", a: [1,5,6], t: ["veg"] },
      { n: "Semifreddo al Pistacchio", e: "Pistachio semifreddo", d: "Con pistacchio di Bronte", p: "€6", a: [3,5,6], t: ["veg"] },
    ],
  },
  {
    cat: "Bevande", en: "Drinks",
    items: [
      { n: "Acqua (0,75 L)", e: "Water", d: "Naturale o frizzante", p: "€2,5", a: [], t: [] },
      { n: "Bibite in Lattina", e: "Soft drinks", d: "Cola, aranciata, limonata siciliana", p: "€3", a: [], t: [] },
      { n: "Birra Artigianale Sicula", e: "Sicilian craft beer", d: "Selezione del birrificio", p: "€5", a: [1], t: [] },
      { n: "Caffè", e: "Espresso", d: "", p: "€1,5", a: [], t: [] },
      { n: "Amaro Siciliano", e: "Sicilian amaro", d: "Digestivo della casa", p: "€4", a: [8], t: [] },
    ],
  },
  {
    cat: "Carta dei Vini", en: "Wine List",
    note: "Prezzi al calice / alla bottiglia.",
    items: [
      { n: "Etna Bianco DOC", e: "White — Carricante", d: "Minerale, agrumato, vulcanico", p: "€6 / €26", a: [8], t: ["vini"] },
      { n: "Grillo Sicilia DOC", e: "White — Grillo", d: "Fresco, sapido, mediterraneo", p: "€5 / €22", a: [8], t: ["vini"] },
      { n: "Catarratto", e: "White — Catarratto", d: "Floreale e delicato", p: "€5 / €20", a: [8], t: ["vini"] },
      { n: "Etna Rosso DOC", e: "Red — Nerello Mascalese", d: "Elegante, balsamico", p: "€7 / €30", a: [8], t: ["vini"] },
      { n: "Nero d'Avola", e: "Red — Nero d'Avola", d: "Corposo e avvolgente", p: "€6 / €24", a: [8], t: ["vini"] },
      { n: "Cerasuolo di Vittoria DOCG", e: "Red — Cerasuolo", d: "Frappato e Nero d'Avola", p: "€7 / €28", a: [8], t: ["vini"] },
      { n: "Spumante Brut", e: "Sparkling — Brut", d: "Bollicine siciliane", p: "€6 / €26", a: [8], t: ["vini"] },
      { n: "Passito di Pantelleria", e: "Dessert wine — Passito", d: "Da Zibibbo, dolce e intenso", p: "€7", a: [8], t: ["vini"] },
      { n: "Marsala", e: "Fortified wine", d: "Secco o dolce", p: "€4", a: [8], t: ["vini"] },
    ],
  },
];

(() => {
  "use strict";
  const root = document.querySelector("[data-menu]");
  if (!root) return;

  const tagLabel = { mare: "Mare", terra: "Terra", veg: "Veg" };

  /* ---- Render del markup a partire dai dati ---- */
  function render() {
    const html = MENU.map((c, ci) => {
      const items = c.items.map((it) => {
        const tags = it.t.filter((t) => tagLabel[t])
          .map((t) => `<span class="chip chip--${t}">${tagLabel[t]}</span>`).join("");
        const all = it.a.length ? `<span class="menu-item__all" title="Allergeni">(${it.a.join(", ")})</span>` : "";
        const en = it.e ? `<div class="menu-item__en">${it.e}</div>` : "";
        const desc = it.d ? `<div class="menu-item__desc">${it.d}</div>` : "";
        return `
          <div class="menu-item" data-tags="${it.t.join(" ")}" data-all="${it.a.join(",")}">
            <div class="menu-item__main">
              <div class="menu-item__head">
                <span class="menu-item__name">${it.n}</span>${all}
                <span class="menu-item__tags">${tags}</span>
                <span class="menu-item__dots"></span>
                <span class="menu-item__price">${it.p}</span>
              </div>
              ${en}${desc}
            </div>
          </div>`;
      }).join("");
      const note = c.note ? `<p class="muted" style="margin:-0.6rem 0 1rem;font-size:.88rem">${c.note}</p>` : "";
      return `
        <section class="menu-cat" data-reveal data-delay="${(ci % 3) + 1}">
          <h3 class="menu-cat__title">${c.cat} <small>${c.en}</small></h3>
          ${note}
          <div class="menu-list">${items}</div>
        </section>`;
    }).join("");

    root.innerHTML = html + `<p class="menu-empty">Nessun piatto per questo filtro. / No dishes for this filter.</p>`;

    // Aggancia il reveal condiviso ai nuovi elementi
    if (window.MarePinella) window.MarePinella.observeReveals(root);
  }

  /* ---- Filtri dinamici (con crossfade fluido) ---- */
  function applyFilter(filter) {
    // Dissolvenza in uscita, poi applica i cambiamenti, poi dissolvenza in entrata
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
