/* ==========================================================================
   IL MARE DI PINELLA — Menù interattivo (dati + render + filtri dinamici)
   - Il menù è interamente in pagina (nessun PDF).
   - Ogni piatto ha nome e descrizione in 3 lingue: IT / EN / FR.
   - Filtri JS (Mare / Terra / Vegetariano / Senza glutine / Vini) senza reload.
   - Il render segue la lingua scelta nel selettore (window.MarePinella.getLang)
     e si ri-genera quando l'utente cambia lingua (evento "mare:langchange").
   ==========================================================================
   NOTA PROPRIETARI: questo è un menù di esempio, realistico e completo, basato
   sulla cucina di mare siciliana. Aggiornate liberamente nomi, descrizioni e
   PREZZI qui sotto: il sito si aggiorna da solo (HTML generato da questi dati).
   Campi di ogni piatto:
     n  = nome italiano        e  = nome inglese        f  = nome francese
     d  = descrizione italiana de = descrizione inglese df = descrizione francese
     p  = prezzo   a = allergeni (codici)   t = tag (mare/terra/veg/vini)
   Codici allergeni: 1 Glutine · 2 Crostacei · 3 Uova · 4 Pesce · 5 Frutta a
   guscio · 6 Latte · 7 Sedano · 8 Solfiti · 9 Molluschi.
   ========================================================================== */

const MENU = [
  {
    cat: "Antipasti di Mare", en: "Seafood Starters", fr: "Entrées de la mer",
    items: [
      { n: "Antipasto del Mare di Pinella", e: "House seafood platter", f: "Assortiment de fruits de mer maison", d: "Selezione di crudi e cotti del giorno", de: "Selection of raw and cooked catch of the day", df: "Sélection de crus et de cuits du jour", p: "€18", a: [2,4,9], t: ["mare"] },
      { n: "Caponata di Pesce Spada", e: "Swordfish caponata", f: "Caponata d'espadon", d: "Spada in agrodolce con verdure di stagione", de: "Sweet-and-sour swordfish with seasonal vegetables", df: "Espadon à l'aigre-doux et légumes de saison", p: "€12", a: [4,8], t: ["mare"] },
      { n: "Sautè di Cozze", e: "Sautéed mussels", f: "Moules sautées", d: "Cozze profumate al prezzemolo, aglio e pepe nero", de: "Mussels with parsley, garlic and black pepper", df: "Moules au persil, ail et poivre noir", p: "€11", a: [9], t: ["mare"] },
      { n: "Polpo Arrosto su Purè", e: "Roasted octopus on potato purée", f: "Poulpe rôti sur purée", d: "Polpo arrostito su vellutato purè di patate", de: "Roasted octopus on a velvety potato purée", df: "Poulpe rôti sur une purée de pommes de terre onctueuse", p: "€14", a: [6,9], t: ["mare"] },
      { n: "Insalata di Mare", e: "Seafood salad", f: "Salade de fruits de mer", d: "Polpo, calamari e gamberi con sedano e limone", de: "Octopus, squid and prawns with celery and lemon", df: "Poulpe, calmars et crevettes, céleri et citron", p: "€13", a: [2,7,9], t: ["mare"] },
      { n: "Gamberi alla Catalana", e: "Catalan-style prawns", f: "Crevettes à la catalane", d: "Gamberi, cipolla rossa di Tropea e pomodoro", de: "Prawns, Tropea red onion and tomato", df: "Crevettes, oignon rouge de Tropea et tomate", p: "€15", a: [2], t: ["mare"] },
    ],
  },
  {
    cat: "Antipasti di Terra", en: "Land Starters", fr: "Entrées de la terre",
    items: [
      { n: "Tagliere Siciliano", e: "Sicilian sharing board", f: "Planche sicilienne", d: "Salumi, formaggi locali, olive e caponata", de: "Cured meats, local cheeses, olives and caponata", df: "Charcuterie, fromages locaux, olives et caponata", p: "€14", a: [6,8], t: ["terra"] },
      { n: "Caponata di Melanzane", e: "Aubergine caponata", f: "Caponata d'aubergines", d: "Classico agrodolce siciliano di melanzane", de: "The classic Sicilian sweet-and-sour aubergine", df: "Le classique sicilien d'aubergines à l'aigre-doux", p: "€8", a: [8], t: ["terra","veg"] },
      { n: "Arancini (2 pz)", e: "Fried rice balls (2 pcs)", f: "Arancini (2 pièces)", d: "Al ragù di carne o al burro", de: "With meat ragù or butter", df: "À la viande ou au beurre", p: "€7", a: [1,3,6,7], t: ["terra"] },
      { n: "Crocchè di Patate", e: "Potato croquettes", f: "Croquettes de pommes de terre", d: "Croccanti fuori, morbide dentro", de: "Crisp outside, soft inside", df: "Croustillantes dehors, fondantes dedans", p: "€6", a: [1,3,6], t: ["terra","veg"] },
    ],
  },
  {
    cat: "Primi", en: "First Courses", fr: "Premiers plats",
    items: [
      { n: "Spaghetti alle Vongole", e: "Spaghetti with clams", f: "Spaghetti aux palourdes", d: "Vongole veraci, aglio, prezzemolo e olio EVO", de: "Clams, garlic, parsley and extra-virgin olive oil", df: "Palourdes, ail, persil et huile d'olive vierge extra", p: "€14", a: [1,9], t: ["mare"] },
      { n: "Risotto alla Marinara", e: "Seafood risotto", f: "Risotto aux fruits de mer", d: "Riso mantecato con frutti di mare freschi", de: "Creamy rice with fresh seafood", df: "Riz crémeux aux fruits de mer frais", p: "€16", a: [2,4,9], t: ["mare"] },
      { n: "Linguine al Nero di Seppia", e: "Squid-ink linguine", f: "Linguine à l'encre de seiche", d: "Linguine con seppia e il suo nero", de: "Linguine with cuttlefish and its ink", df: "Linguine à la seiche et son encre", p: "€15", a: [1,9], t: ["mare"] },
      { n: "Spaghetti ai Ricci di Mare", e: "Sea-urchin spaghetti", f: "Spaghetti aux oursins", d: "Stagionale, secondo disponibilità", de: "Seasonal, subject to availability", df: "De saison, selon disponibilité", p: "€18", a: [1,9], t: ["mare"] },
      { n: "Casarecce alla Norma", e: "Pasta alla Norma", f: "Casarecce alla Norma", d: "Melanzane fritte, pomodoro e ricotta salata", de: "Fried aubergine, tomato and salted ricotta", df: "Aubergines frites, tomate et ricotta salée", p: "€11", a: [1,6], t: ["terra","veg"] },
      { n: "Busiate al Pesto Trapanese", e: "Busiate, Trapani pesto", f: "Busiate au pesto trapanais", d: "Mandorle, pomodoro fresco e basilico", de: "Almonds, fresh tomato and basil", df: "Amandes, tomate fraîche et basilic", p: "€12", a: [1,5], t: ["terra","veg"] },
    ],
  },
  {
    cat: "Secondi", en: "Main Courses", fr: "Plats principaux",
    items: [
      { n: "Grigliata di Mare", e: "Mixed grilled seafood", f: "Grillade de la mer", d: "Pesce, crostacei e molluschi alla griglia", de: "Grilled fish, shellfish and molluscs", df: "Poissons, crustacés et mollusques grillés", p: "€22", a: [2,4,9], t: ["mare"] },
      { n: "Frittura di Paranza", e: "Mixed fried fish", f: "Friture de petits poissons", d: "Calamari, gamberi e pesce di paranza", de: "Squid, prawns and small fish", df: "Calmars, crevettes et petits poissons", p: "€18", a: [1,2,4], t: ["mare"] },
      { n: "Calamaro alla Griglia", e: "Grilled squid", f: "Calmar grillé", d: "Olio, limone e prezzemolo", de: "Oil, lemon and parsley", df: "Huile, citron et persil", p: "€16", a: [9], t: ["mare"] },
      { n: "Pesce Spada alla Ghiotta", e: "Swordfish 'ghiotta'", f: "Espadon à la « ghiotta »", d: "Pomodoro, capperi, olive e cipolla", de: "Tomato, capers, olives and onion", df: "Tomate, câpres, olives et oignon", p: "€19", a: [4,8], t: ["mare"] },
      { n: "Tonno in Crosta di Pistacchio", e: "Pistachio-crusted tuna", f: "Thon en croûte de pistache", d: "Tonno scottato in crosta di pistacchio di Bronte", de: "Seared tuna in a Bronte pistachio crust", df: "Thon saisi en croûte de pistache de Bronte", p: "€21", a: [4,5], t: ["mare"] },
      { n: "Pescato del Giorno", e: "Catch of the day", f: "Pêche du jour", d: "Secondo disponibilità — chiedi al personale", de: "Subject to availability — ask our staff", df: "Selon disponibilité — demandez au personnel", p: "s.q.", a: [4], t: ["mare"] },
      { n: "Scaloppine al Limone", e: "Veal escalopes with lemon", f: "Escalopes de veau au citron", d: "Fettine tenere al limone o vino bianco", de: "Tender slices with lemon or white wine", df: "Fines tranches au citron ou au vin blanc", p: "€16", a: [1], t: ["terra"] },
    ],
  },
  {
    cat: "Contorni", en: "Sides", fr: "Accompagnements",
    items: [
      { n: "Patate al Forno", e: "Roasted potatoes", f: "Pommes de terre au four", d: "Con rosmarino", de: "With rosemary", df: "Au romarin", p: "€5", a: [], t: ["veg"] },
      { n: "Verdure Grigliate", e: "Grilled vegetables", f: "Légumes grillés", d: "Di stagione", de: "Seasonal", df: "De saison", p: "€6", a: [], t: ["veg"] },
      { n: "Insalata Mista", e: "Mixed salad", f: "Salade mixte", d: "Fresca del giorno", de: "Fresh of the day", df: "Fraîche du jour", p: "€5", a: [], t: ["veg"] },
      { n: "Caponatina", e: "Small caponata", f: "Petite caponata", d: "Porzione singola", de: "Single portion", df: "Portion individuelle", p: "€5", a: [8], t: ["veg"] },
    ],
  },
  {
    cat: "Dessert", en: "Desserts", fr: "Desserts",
    items: [
      { n: "Cannolo Siciliano", e: "Sicilian cannolo", f: "Cannolo sicilien", d: "Ricotta fresca e gocce di cioccolato", de: "Fresh ricotta and chocolate chips", df: "Ricotta fraîche et pépites de chocolat", p: "€6", a: [1,3,5,6], t: ["veg"] },
      { n: "Cassata Siciliana", e: "Sicilian cassata", f: "Cassata sicilienne", d: "Pan di Spagna, ricotta e pasta reale", de: "Sponge cake, ricotta and marzipan", df: "Génoise, ricotta et pâte d'amande", p: "€7", a: [1,3,5,6], t: ["veg"] },
      { n: "Setteveli", e: "Seven-veil chocolate cake", f: "Gâteau « Setteveli »", d: "Sette strati di cioccolato e nocciola", de: "Seven layers of chocolate and hazelnut", df: "Sept couches de chocolat et de noisette", p: "€6", a: [1,3,5,6], t: ["veg"] },
      { n: "Granita & Brioche", e: "Granita with brioche", f: "Granité et brioche", d: "Limone, mandorla o caffè", de: "Lemon, almond or coffee", df: "Citron, amande ou café", p: "€6", a: [1,5,6], t: ["veg"] },
      { n: "Semifreddo al Pistacchio", e: "Pistachio semifreddo", f: "Semifreddo à la pistache", d: "Con pistacchio di Bronte", de: "With Bronte pistachio", df: "À la pistache de Bronte", p: "€6", a: [3,5,6], t: ["veg"] },
    ],
  },
  {
    cat: "Bevande", en: "Drinks", fr: "Boissons",
    items: [
      { n: "Acqua (0,75 L)", e: "Water (0.75 L)", f: "Eau (0,75 L)", d: "Naturale o frizzante", de: "Still or sparkling", df: "Plate ou pétillante", p: "€2,5", a: [], t: [] },
      { n: "Bibite in Lattina", e: "Soft drinks", f: "Boissons en canette", d: "Cola, aranciata, limonata siciliana", de: "Cola, orangeade, Sicilian lemonade", df: "Cola, orangeade, limonade sicilienne", p: "€3", a: [], t: [] },
      { n: "Birra Artigianale Sicula", e: "Sicilian craft beer", f: "Bière artisanale sicilienne", d: "Selezione del birrificio", de: "Brewery selection", df: "Sélection de la brasserie", p: "€5", a: [1], t: [] },
      { n: "Caffè", e: "Espresso", f: "Café", d: "", de: "", df: "", p: "€1,5", a: [], t: [] },
      { n: "Amaro Siciliano", e: "Sicilian amaro", f: "Amaro sicilien", d: "Digestivo della casa", de: "House digestif", df: "Digestif maison", p: "€4", a: [8], t: [] },
    ],
  },
  {
    cat: "Carta dei Vini", en: "Wine List", fr: "Carte des vins",
    note: "Prezzi al calice / alla bottiglia.", noteEn: "Prices by the glass / bottle.", noteFr: "Prix au verre / à la bouteille.",
    items: [
      { n: "Etna Bianco DOC", e: "White — Carricante", f: "Blanc — Carricante", d: "Minerale, agrumato, vulcanico", de: "Mineral, citrussy, volcanic", df: "Minéral, agrumes, volcanique", p: "€6 / €26", a: [8], t: ["vini"] },
      { n: "Grillo Sicilia DOC", e: "White — Grillo", f: "Blanc — Grillo", d: "Fresco, sapido, mediterraneo", de: "Fresh, savoury, Mediterranean", df: "Frais, sapide, méditerranéen", p: "€5 / €22", a: [8], t: ["vini"] },
      { n: "Catarratto", e: "White — Catarratto", f: "Blanc — Catarratto", d: "Floreale e delicato", de: "Floral and delicate", df: "Floral et délicat", p: "€5 / €20", a: [8], t: ["vini"] },
      { n: "Etna Rosso DOC", e: "Red — Nerello Mascalese", f: "Rouge — Nerello Mascalese", d: "Elegante, balsamico", de: "Elegant, balsamic", df: "Élégant, balsamique", p: "€7 / €30", a: [8], t: ["vini"] },
      { n: "Nero d'Avola", e: "Red — Nero d'Avola", f: "Rouge — Nero d'Avola", d: "Corposo e avvolgente", de: "Full-bodied and enveloping", df: "Corsé et enveloppant", p: "€6 / €24", a: [8], t: ["vini"] },
      { n: "Cerasuolo di Vittoria DOCG", e: "Red — Cerasuolo", f: "Rouge — Cerasuolo", d: "Frappato e Nero d'Avola", de: "Frappato and Nero d'Avola", df: "Frappato et Nero d'Avola", p: "€7 / €28", a: [8], t: ["vini"] },
      { n: "Spumante Brut", e: "Sparkling — Brut", f: "Mousseux — Brut", d: "Bollicine siciliane", de: "Sicilian bubbles", df: "Bulles siciliennes", p: "€6 / €26", a: [8], t: ["vini"] },
      { n: "Passito di Pantelleria", e: "Dessert wine — Passito", f: "Vin de dessert — Passito", d: "Da Zibibbo, dolce e intenso", de: "From Zibibbo, sweet and intense", df: "De Zibibbo, doux et intense", p: "€7", a: [8], t: ["vini"] },
      { n: "Marsala", e: "Fortified wine", f: "Vin fortifié", d: "Secco o dolce", de: "Dry or sweet", df: "Sec ou doux", p: "€4", a: [8], t: ["vini"] },
    ],
  },
];

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
  function name(it, l) { return l === "en" ? (it.e || it.n) : l === "fr" ? (it.f || it.e || it.n) : it.n; }
  function desc(it, l) { return l === "en" ? (it.de || "") : l === "fr" ? (it.df || it.de || "") : (it.d || ""); }
  function catName(c, l) { return l === "en" ? (c.en || c.cat) : l === "fr" ? (c.fr || c.en || c.cat) : c.cat; }
  function catNote(c, l) { return l === "en" ? (c.noteEn || c.note) : l === "fr" ? (c.noteFr || c.noteEn || c.note) : c.note; }

  /* ---- Render del markup a partire dai dati (nella lingua corrente) ---- */
  function render() {
    const l = lang();
    const tagLabel = TAGS[l] || TAGS.it;

    const html = MENU.map((c, ci) => {
      const items = c.items.map((it) => {
        const tags = it.t.filter((t) => tagLabel[t])
          .map((t) => `<span class="chip chip--${t}">${tagLabel[t]}</span>`).join("");
        const all = it.a.length ? `<span class="menu-item__all" title="Allergeni">(${it.a.join(", ")})</span>` : "";
        const dtxt = desc(it, l);
        const descHtml = dtxt ? `<div class="menu-item__desc">${dtxt}</div>` : "";
        return `
          <div class="menu-item" data-tags="${it.t.join(" ")}" data-all="${it.a.join(",")}">
            <div class="menu-item__main">
              <div class="menu-item__head">
                <span class="menu-item__name">${name(it, l)}</span>${all}
                <span class="menu-item__tags">${tags}</span>
                <span class="menu-item__dots"></span>
                <span class="menu-item__price">${it.p}</span>
              </div>
              ${descHtml}
            </div>
          </div>`;
      }).join("");
      const noteTxt = catNote(c, l);
      const note = noteTxt ? `<p class="muted" style="margin:-0.6rem 0 1rem;font-size:.88rem">${noteTxt}</p>` : "";
      return `
        <section class="menu-cat" data-reveal data-delay="${(ci % 3) + 1}">
          <h3 class="menu-cat__title">${catName(c, l)}</h3>
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

  // Ri-render quando l'utente cambia lingua dal selettore
  document.addEventListener("mare:langchange", render);
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
