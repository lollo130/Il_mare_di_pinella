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
      { n: "Cruditè di Mare", e: "Raw seafood platter", f: "Plateau de cruditès de la mer", d: "Pescato del giorno", de: "Catch of the day", df: "Pêche du jour", p: "€22", a: [2,4,9], t: ["mare"] },
      { n: "Ostriche", e: "Oysters", f: "Huîtres", d: "", de: "", df: "", p: "€6 cad.", a: [9], t: ["mare"] },
      { n: "Tartara di Tonno", e: "Tuna tartare", f: "Tartare de thon", d: "Tonno fresco", de: "Fresh tuna", df: "Thon frais", p: "€19", a: [4], t: ["mare"] },
      { n: "Tartara di Gamberi", e: "Prawn tartare", f: "Tartare de crevettes", d: "Gamberi freschi", de: "Fresh shrimp", df: "Crevettes fraîches", p: "€22", a: [2], t: ["mare"] },
      { n: "Le 5 Portate di Pinella", e: "Pinella's 5-course tasting", f: "Les 5 plats de Pinella", d: "Min. 2 persone — frittura mista, insalata di polpo, caponata di spada, zuppa di cozze, sarde a beccafico", de: "Min. 2 people — mixed fried seafood, octopus salad, swordfish caponata, mussel soup, sardines beccafico", df: "Min. 2 pers. — friture mixte, salade de poulpe, caponata d'espadon, soupe de moules, sardines a beccafico", p: "€40", a: [1,2,4,7,9], t: ["mare"] },
      { n: "Fritto Misto", e: "Mixed fried seafood", f: "Friture mixte", d: "Calamari, cappelletti, pesce di paranza", de: "Squid, cappelletti fish, paranza fish", df: "Calmars, poisson cappelletti, petits poissons", p: "€18", a: [1,3,4,9], t: ["mare"] },
      { n: "Insalata di Polpo", e: "Octopus salad", f: "Salade de poulpe", d: "Polpo, lattuga, carota, sedano, peperoni, aglio, olio d'oliva, limoni, pepe nero, prezzemolo", de: "Octopus, lettuce, carrot, celery, peppers, garlic, olive oil, lemons, black pepper, parsley", df: "Poulpe, laitue, carotte, céleri, poivrons, ail, huile d'olive, citrons, poivre noir, persil", p: "€16", a: [7,9], t: ["mare"] },
      { n: "Caponata di Spada", e: "Swordfish caponata", f: "Caponata d'espadon", d: "Spada, melanzana, peperoni, sedano, cipolla, carote, capperi, olive, aceto, zucchero, menta, pomodoro", de: "Swordfish, eggplant, peppers, celery, onion, carrots, capers, olives, vinegar, sugar, mint, tomato", df: "Espadon, aubergine, poivrons, céleri, oignon, carottes, câpres, olives, vinaigre, sucre, menthe, tomate", p: "€15", a: [4,7,8], t: ["mare"] },
      { n: "Zuppa di Cozze", e: "Mussel soup", f: "Soupe de moules", d: "Cozze, aglio, olio d'oliva, prezzemolo, pomodoro, vino bianco", de: "Mussels, garlic, olive oil, parsley, tomato, white wine", df: "Moules, ail, huile d'olive, persil, tomate, vin blanc", p: "€18", a: [8,9], t: ["mare"] },
    ],
  },
  {
    cat: "Antipasti di Terra", en: "Land Starters", fr: "Entrées de la terre",
    items: [
      { n: "Tagliere Siciliano", e: "Sicilian sharing board", f: "Planche sicilienne", d: "Min. 2 persone — salame, prosciutto cotto, primo sale, olive, caponata, bruschette al pomodoro, verdure sott'olio, mozzarelline", de: "Min. 2 people — salami, cooked ham, primo sale cheese, olives, caponata, tomato bruschetta, vegetables in oil, mini mozzarella", df: "Min. 2 pers. — salami, jambon cuit, primo sale, olives, caponata, bruschetta tomate, légumes à l'huile, mini mozzarella", p: "€30", a: [1,6], t: ["terra"] },
    ],
  },
  {
    cat: "Primi di Mare", en: "First Courses — Sea", fr: "Premiers plats — Mer",
    items: [
      { n: "Pennette \"Il Mare di Pinella\"", e: "Pennette \"Il Mare di Pinella\"", f: "Pennette \"Il Mare di Pinella\"", d: "Calamari, spada, gamberone, pesto di basilico, pomodoro, mollica tostata", de: "Squid, swordfish, king prawn, basil pesto, tomato, toasted breadcrumbs", df: "Calmars, espadon, gambas, pesto de basilic, tomate, chapelure grillée", p: "€22", a: [1,2,4,6], t: ["mare"] },
      { n: "Risotto alla Marinara", e: "Seafood risotto", f: "Risotto aux fruits de mer", d: "Calamari, spada, cozze, scampi, ciliegino, prezzemolo, pepe nero, aglio, olio d'oliva", de: "Squid, swordfish, mussels, langoustines, cherry tomatoes, parsley, black pepper, garlic, olive oil", df: "Calmars, espadon, moules, langoustines, tomates cerises, persil, poivre noir, ail, huile d'olive", p: "€18", a: [1,2,4,9], t: ["mare"] },
      { n: "Linguine ai Frutti di Mare", e: "Seafood linguine", f: "Linguine aux fruits de mer", d: "Cozze, vongole, gamberetti, gamberone, ciliegino, pepe nero, aglio, olio d'oliva, prezzemolo", de: "Mussels, clams, shrimp, king prawn, cherry tomatoes, black pepper, garlic, olive oil, parsley", df: "Moules, palourdes, crevettes, gambas, tomates cerises, poivre noir, ail, huile d'olive, persil", p: "€22", a: [1,2,9], t: ["mare"] },
      { n: "Spaghetti alle Vongole Veraci", e: "Spaghetti with clams", f: "Spaghetti aux palourdes", d: "Vongole, aglio, olio d'oliva, prezzemolo", de: "Clams, garlic, olive oil, parsley", df: "Palourdes, ail, huile d'olive, persil", p: "€20", a: [1,9], t: ["mare"] },
      { n: "Spaghetti alla Siracusana", e: "Syracuse-style spaghetti", f: "Spaghetti à la syracusaine", d: "Acciughe, mollica tostata, aglio, olio d'oliva, uva passa, pinoli, capperi, pomodoro", de: "Anchovies, toasted breadcrumbs, garlic, olive oil, raisins, pine nuts, capers, tomato", df: "Anchois, chapelure grillée, ail, huile d'olive, raisins secs, pignons, câpres, tomate", p: "€16", a: [1,4,5], t: ["mare"] },
      { n: "Ravioli di Scampi in Salsa di Scampi", e: "Langoustine ravioli, langoustine sauce", f: "Raviolis de langoustines, sauce langoustine", d: "Ripieno di scampi, scampi, aglio, olio d'oliva, ciliegino, salsa aurora", de: "Langoustine filling, langoustines, garlic, olive oil, cherry tomatoes, aurora sauce", df: "Farce de langoustines, langoustines, ail, huile d'olive, tomates cerises, sauce aurore", p: "€25", a: [1,2,6], t: ["mare"] },
      { n: "Paccheri d'u Mari e dà Terra", e: "Paccheri, land & sea", f: "Paccheri, mer et terre", d: "Spada, aglio, olio d'oliva, melanzana fritta, pomodoro, prezzemolo", de: "Swordfish, garlic, olive oil, fried eggplant, tomato, parsley", df: "Espadon, ail, huile d'olive, aubergine frite, tomate, persil", p: "€18", a: [1,4], t: ["mare"] },
      { n: "Risotto Aretuseo", e: "\"Aretuseo\" risotto", f: "Risotto \"Aretuseo\"", d: "Gamberi, aglio, olio d'oliva, zucchine, prezzemolo", de: "Shrimp, garlic, olive oil, zucchini, parsley", df: "Crevettes, ail, huile d'olive, courgettes, persil", p: "€22", a: [1,2,6], t: ["mare"] },
    ],
  },
  {
    cat: "Primi di Terra", en: "First Courses — Land", fr: "Premiers plats — Terre",
    items: [
      { n: "Casarecce alla Norma", e: "Casarecce alla Norma", f: "Casarecce alla Norma", d: "Melanzana fritta, pomodoro, ricotta salata, basilico", de: "Fried eggplant, tomato, salted ricotta, basil", df: "Aubergine frite, tomate, ricotta salée, basilic", p: "€10", a: [1,6], t: ["terra","veg"] },
      { n: "Linguine Pistacchio di Sicilia", e: "Sicilian pistachio linguine", f: "Linguine à la pistache de Sicile", d: "Pesto di pistacchio, speck croccante, granella di pistacchio", de: "Pistachio pesto, crispy speck, chopped pistachios", df: "Pesto de pistache, speck croustillant, éclats de pistache", p: "€14", a: [1,5,6], t: ["terra"] },
      { n: "Spaghetti alla Carbonara", e: "Spaghetti carbonara", f: "Spaghetti à la carbonara", d: "Guanciale croccante, olio d'oliva, uova, pecorino, pepe nero", de: "Crispy guanciale, olive oil, eggs, pecorino, black pepper", df: "Guanciale croustillant, huile d'olive, œufs, pecorino, poivre noir", p: "€18", a: [1,3,6], t: ["terra"] },
      { n: "Risotto Funghi e Salsiccia", e: "Mushroom & sausage risotto", f: "Risotto champignons & saucisse", d: "Salsiccia, funghi freschi, aglio, olio d'oliva, prezzemolo", de: "Sausage, fresh mushrooms, garlic, olive oil, parsley", df: "Saucisse, champignons frais, ail, huile d'olive, persil", p: "€20", a: [1], t: ["terra"] },
    ],
  },
  {
    cat: "Secondi di Mare", en: "Main Courses — Sea", fr: "Plats principaux — Mer",
    items: [
      { n: "Grigliata di Mare", e: "Mixed grilled seafood", f: "Grillade de la mer", d: "Spada, calamari, gamberone", de: "Swordfish, squid, king prawn", df: "Espadon, calmars, gambas", p: "€22", a: [2,4,9], t: ["mare"] },
      { n: "Polpo Arrosto su Purè di Patate", e: "Roasted octopus on potato purée", f: "Poulpe rôti sur purée", d: "Polpo, purè di patate, olio d'oliva, limone, prezzemolo", de: "Octopus, mashed potatoes, olive oil, lemon, parsley", df: "Poulpe, purée de pommes de terre, huile d'olive, citron, persil", p: "€16", a: [6], t: ["mare"] },
      { n: "Spada alla Siracusana", e: "Syracuse-style swordfish", f: "Espadon à la syracusaine", d: "Spada, ciliegino, prezzemolo, capperi, olive", de: "Swordfish, cherry tomatoes, parsley, capers, olives", df: "Espadon, tomates cerises, persil, câpres, olives", p: "€20", a: [4], t: ["mare"] },
      { n: "Calamaro alla Griglia", e: "Grilled squid", f: "Calmar grillé", d: "Calamaro, olio d'oliva, prezzemolo, limone", de: "Squid, olive oil, parsley, lemon", df: "Calmar, huile d'olive, persil, citron", p: "€17", a: [9], t: ["mare"] },
      { n: "Gamberone Glassato", e: "Glazed king prawns", f: "Gambas glacées", d: "Gamberone, aglio, olio, prezzemolo, ciliegino", de: "King prawn, garlic, olive oil, parsley, cherry tomatoes", df: "Gambas, ail, huile d'olive, persil, tomates cerises", p: "€22", a: [2], t: ["mare"] },
      { n: "Pescato del Giorno", e: "Catch of the day", f: "Pêche du jour", d: "Secondo disponibilità", de: "Subject to availability", df: "Selon disponibilité", p: "€80 / kg", a: [4,9], t: ["mare"] },
      { n: "Crostacei del Giorno", e: "Crustaceans of the day", f: "Crustacés du jour", d: "Secondo disponibilità", de: "Subject to availability", df: "Selon disponibilité", p: "€12 / etto", a: [2], t: ["mare"] },
    ],
  },
  {
    cat: "Secondi di Terra", en: "Main Courses — Land", fr: "Plats principaux — Terre",
    items: [
      { n: "Scaloppina ai Funghi", e: "Veal escalope with mushrooms", f: "Escalope de veau aux champignons", d: "Vitello, funghi freschi, vino, prezzemolo", de: "Veal, fresh mushrooms, wine, parsley", df: "Veau, champignons frais, vin, persil", p: "€15", a: [1,6], t: ["terra"] },
      { n: "Cotolette di Pollo", e: "Chicken cutlets", f: "Escalopes de poulet panées", d: "Pollo, mollica, prezzemolo, parmigiano, sale, pepe nero", de: "Chicken, breadcrumbs, parsley, parmesan, salt, black pepper", df: "Poulet, chapelure, persil, parmesan, sel, poivre noir", p: "€10", a: [1,3,6], t: ["terra"] },
      { n: "Grigliata Mista", e: "Mixed grill", f: "Grillade mixte", d: "Costata di maiale, salsiccia, vitello, pollo, granella di pistacchio, olio d'oliva, limone, prezzemolo", de: "Pork chop, sausage, veal, chicken, chopped pistachios, olive oil, lemon, parsley", df: "Côte de porc, saucisse, veau, poulet, éclats de pistache, huile d'olive, citron, persil", p: "€22", a: [1,5], t: ["terra"] },
    ],
  },
  {
    cat: "Le Nostre Insalatone", en: "Our Big Salads", fr: "Nos grandes salades",
    items: [
      { n: "Insalata Mista", e: "Mixed salad", f: "Salade mixte", d: "Iceberg, radicchio, pomodoro, mais, carote", de: "Iceberg lettuce, radicchio, tomato, corn, carrots", df: "Iceberg, radicchio, tomate, maïs, carottes", p: "€6", a: [], t: ["terra","veg"] },
      { n: "Insalata Ortigia", e: "\"Ortigia\" salad", f: "Salade \"Ortigia\"", d: "Rucola, ciliegino, bresaola, bufala, scaglie", de: "Rocket, cherry tomatoes, bresaola, buffalo mozzarella, parmesan flakes", df: "Roquette, tomates cerises, bresaola, mozzarella di bufala, copeaux de parmesan", p: "€12", a: [6], t: ["terra"] },
      { n: "Caesar Salad", e: "Caesar salad", f: "Salade César", d: "Iceberg, ciliegino, mais, pollo, crema Caesar", de: "Iceberg lettuce, cherry tomatoes, corn, chicken, Caesar dressing", df: "Iceberg, tomates cerises, maïs, poulet, sauce César", p: "€10", a: [6], t: ["terra"] },
    ],
  },
  {
    cat: "Contorni", en: "Sides", fr: "Accompagnements",
    items: [
      { n: "Patate al Forno", e: "Roasted potatoes", f: "Pommes de terre au four", d: "Patate, olio d'oliva, sale, rosmarino", de: "Potatoes, olive oil, salt, rosemary", df: "Pommes de terre, huile d'olive, sel, romarin", p: "€5", a: [], t: ["veg"] },
      { n: "Patatine Fritte", e: "French fries", f: "Frites", d: "Patate", de: "Potatoes", df: "Pommes de terre", p: "€5", a: [], t: ["veg"] },
      { n: "Verdure Grigliate", e: "Grilled vegetables", f: "Légumes grillés", d: "Melanzane, zucchine, peperoni", de: "Eggplants, zucchini, peppers", df: "Aubergines, courgettes, poivrons", p: "€6", a: [], t: ["veg"] },
    ],
  },
  {
    cat: "Dessert", en: "Desserts", fr: "Desserts",
    items: [
      { n: "Cannolo Scomposto", e: "Deconstructed cannolo", f: "Cannolo déstructuré", d: "Ricotta dolce, scorza di cannolo, granella di pistacchio, zucchero a velo", de: "Sweet ricotta, cannolo shell, chopped pistachios, icing sugar", df: "Ricotta sucrée, coque de cannolo, éclats de pistache, sucre glace", p: "€7", a: [5,6], t: ["veg"] },
      { n: "Cassatina Siciliana", e: "Sicilian cassata", f: "Cassata sicilienne", d: "Pan di spagna, ricotta dolce, pasta reale, canditi", de: "Sponge cake, sweet ricotta, marzipan, candied fruit", df: "Génoise, ricotta sucrée, pâte d'amande, fruits confits", p: "€6", a: [1,3,5,6], t: ["veg"] },
      { n: "Sorbetto al Limone", e: "Lemon sorbet", f: "Sorbet au citron", d: "Limone, acqua, zucchero", de: "Lemon, water, sugar", df: "Citron, eau, sucre", p: "€4", a: [], t: ["veg"] },
      { n: "Tiramisù", e: "Tiramisù", f: "Tiramisù", d: "Savoiardi, mascarpone, caffè, cacao, zucchero, uova", de: "Ladyfingers, mascarpone, coffee, cocoa, sugar, eggs", df: "Boudoirs, mascarpone, café, cacao, sucre, œufs", p: "€5", a: [1,3,6], t: ["veg"] },
      { n: "Dolce del Giorno", e: "Dessert of the day", f: "Dessert du jour", d: "Chiedere disponibilità", de: "Ask for today's selection", df: "Demandez la sélection du jour", p: "€7", a: [], t: ["veg"] },
    ],
  },
  {
    cat: "Bevande", en: "Drinks", fr: "Boissons",
    items: [
      { n: "Acqua Naturale 75 cl", e: "Still water 75 cl", f: "Eau plate 75 cl", d: "", de: "", df: "", p: "€3", a: [], t: [] },
      { n: "Acqua Frizzante 75 cl", e: "Sparkling water 75 cl", f: "Eau pétillante 75 cl", d: "", de: "", df: "", p: "€3", a: [], t: [] },
      { n: "Coca-Cola 33 cl", e: "Coca-Cola 33 cl", f: "Coca-Cola 33 cl", d: "", de: "", df: "", p: "€3,50", a: [], t: [] },
      { n: "Polara Chinotto 27,5 cl", e: "Polara Chinotto 27.5 cl", f: "Polara Chinotto 27,5 cl", d: "", de: "", df: "", p: "€3,50", a: [], t: [] },
      { n: "Polara Orange Soda 27,5 cl", e: "Polara Orange Soda 27.5 cl", f: "Polara Orange Soda 27,5 cl", d: "", de: "", df: "", p: "€3,50", a: [], t: [] },
      { n: "Polara Lemon Soda 27,5 cl", e: "Polara Lemon Soda 27.5 cl", f: "Polara Lemon Soda 27,5 cl", d: "", de: "", df: "", p: "€3,50", a: [], t: [] },
      { n: "Espresso", e: "Espresso", f: "Espresso", d: "", de: "", df: "", p: "€2", a: [], t: [] },
      { n: "Espresso Macchiato", e: "Espresso macchiato", f: "Espresso macchiato", d: "", de: "", df: "", p: "€2,50", a: [], t: [] },
    ],
  },
  {
    cat: "Vini Bianchi", en: "White Wines", fr: "Vins blancs",
    note: "Prezzo: calice / bottiglia.", noteEn: "Price: glass / bottle.", noteFr: "Prix : verre / bouteille.",
    items: [
      { n: "Turi Bianco Catarratto", e: "Turi Catarratto", f: "Turi Catarratto", d: "750 ml", de: "750 ml", df: "750 ml", p: "€6 / €28", a: [8], t: ["vini"] },
      { n: "Etna Bianco DOC", e: "Etna Bianco DOC", f: "Etna Bianco DOC", d: "750 ml", de: "750 ml", df: "750 ml", p: "€10 / €40", a: [8], t: ["vini"] },
      { n: "Corte Ibla Grillo DOC Sicilia", e: "Corte Ibla Grillo DOC", f: "Corte Ibla Grillo DOC", d: "750 ml", de: "750 ml", df: "750 ml", p: "€5 / €20", a: [8], t: ["vini"] },
      { n: "Tinchitè Feudo Arancio", e: "Tinchitè Feudo Arancio", f: "Tinchitè Feudo Arancio", d: "1 L", de: "1 L", df: "1 L", p: "€6 / €25", a: [8], t: ["vini"] },
      { n: "\"Il Frappato\" Santa Tresa — Bollicine Rosè", e: "Santa Tresa Frappato Rosè sparkling", f: "Santa Tresa Frappato Rosè pétillant", d: "750 ml", de: "750 ml", df: "750 ml", p: "€7 / €30", a: [8], t: ["vini"] },
      { n: "Turi Rosato", e: "Turi Rosé", f: "Turi Rosé", d: "750 ml", de: "750 ml", df: "750 ml", p: "€7 / €25", a: [8], t: ["vini"] },
      { n: "Il Grillo di Santa Tresa Spumante", e: "Santa Tresa Grillo sparkling", f: "Santa Tresa Grillo mousseux", d: "750 ml", de: "750 ml", df: "750 ml", p: "€7 / €28", a: [8], t: ["vini"] },
      { n: "Traimari Frizzante", e: "Traimari frizzante", f: "Traimari pétillant", d: "75 cl", de: "75 cl", df: "75 cl", p: "€6 / €25", a: [8], t: ["vini"] },
    ],
  },
  {
    cat: "Vini Rossi", en: "Red Wines", fr: "Vins rouges",
    note: "Prezzo: calice / bottiglia.", noteEn: "Price: glass / bottle.", noteFr: "Prix : verre / bouteille.",
    items: [
      { n: "Corte Ibla Nero d'Avola DOC Sicilia", e: "Corte Ibla Nero d'Avola DOC", f: "Corte Ibla Nero d'Avola DOC", d: "750 ml", de: "750 ml", df: "750 ml", p: "€5 / €20", a: [8], t: ["vini"] },
      { n: "\"Calaniuru\" Frappato Terre Siciliane", e: "\"Calaniuru\" Frappato", f: "\"Calaniuru\" Frappato", d: "750 ml", de: "750 ml", df: "750 ml", p: "€7 / €25", a: [8], t: ["vini"] },
    ],
  },
  {
    cat: "Vino della Casa", en: "House Wine", fr: "Vin de la maison",
    note: "Sfuso: 1/4 · 1/2 · 1 litro.", noteEn: "On tap: 1/4 · 1/2 · 1 litre.", noteFr: "En pichet : 1/4 · 1/2 · 1 litre.",
    items: [
      { n: "Bianco", e: "White", f: "Blanc", d: "1/4 €3 · 1/2 €6 · 1 L €9", de: "1/4 €3 · 1/2 €6 · 1 L €9", df: "1/4 €3 · 1/2 €6 · 1 L €9", p: "da €3", a: [8], t: ["vini"] },
      { n: "Rosso", e: "Red", f: "Rouge", d: "1/4 €3 · 1/2 €6 · 1 L €9", de: "1/4 €3 · 1/2 €6 · 1 L €9", df: "1/4 €3 · 1/2 €6 · 1 L €9", p: "da €3", a: [8], t: ["vini"] },
    ],
  },
  {
    cat: "Birre", en: "Beers", fr: "Bières",
    items: [
      { n: "Dello Stretto Premium 33 cl", e: "Dello Stretto Premium 33 cl", f: "Dello Stretto Premium 33 cl", d: "", de: "", df: "", p: "€5", a: [1], t: [] },
      { n: "Messina Cristalli di Sale 33 cl", e: "Messina Cristalli di Sale 33 cl", f: "Messina Cristalli di Sale 33 cl", d: "", de: "", df: "", p: "€6", a: [1], t: [] },
    ],
  },
  {
    cat: "Amari", en: "Amari", fr: "Amari",
    items: [
      { n: "Amaru cu si Marita", e: "Amaru cu si Marita", f: "Amaru cu si Marita", d: "", de: "", df: "", p: "€4", a: [], t: [] },
      { n: "Amaro dell'Etna", e: "Amaro dell'Etna", f: "Amaro dell'Etna", d: "", de: "", df: "", p: "€5", a: [], t: [] },
      { n: "Amaro del Capo", e: "Amaro del Capo", f: "Amaro del Capo", d: "", de: "", df: "", p: "€5", a: [], t: [] },
      { n: "Averna", e: "Averna", f: "Averna", d: "", de: "", df: "", p: "€5", a: [], t: [] },
      { n: "Amaretto Disaronno", e: "Amaretto Disaronno", f: "Amaretto Disaronno", d: "", de: "", df: "", p: "€6", a: [5], t: [] },
      { n: "Montenegro", e: "Montenegro", f: "Montenegro", d: "", de: "", df: "", p: "€6", a: [], t: [] },
      { n: "Limoncello", e: "Limoncello", f: "Limoncello", d: "", de: "", df: "", p: "€4", a: [], t: [] },
      { n: "Sambuca", e: "Sambuca", f: "Sambuca", d: "", de: "", df: "", p: "€5", a: [], t: [] },
    ],
  },
  {
    cat: "Grappe", en: "Grappa", fr: "Grappa",
    items: [
      { n: "Barrique 903", e: "Barrique 903", f: "Barrique 903", d: "", de: "", df: "", p: "€5", a: [], t: [] },
    ],
  },
  {
    cat: "Whisky & Distillati", en: "Whisky & Spirits", fr: "Whisky & spiritueux",
    items: [
      { n: "Ballantine's", e: "Ballantine's", f: "Ballantine's", d: "", de: "", df: "", p: "€5", a: [], t: [] },
      { n: "J&B", e: "J&B", f: "J&B", d: "", de: "", df: "", p: "€5", a: [], t: [] },
      { n: "Jack Daniel's", e: "Jack Daniel's", f: "Jack Daniel's", d: "", de: "", df: "", p: "€7", a: [], t: [] },
      { n: "Brandy", e: "Brandy", f: "Brandy", d: "", de: "", df: "", p: "€5", a: [], t: [] },
      { n: "Cognac / Chivas", e: "Cognac / Chivas", f: "Cognac / Chivas", d: "", de: "", df: "", p: "€10", a: [], t: [] },
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
