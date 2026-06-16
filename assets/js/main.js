/* ==========================================================================
   IL MARE DI PINELLA — Animazioni (v2: raffinate, premium, performanti)
   Moduli:
     1. Navbar reattiva + menu mobile
     2. Smooth anchor scroll
     3. Reveal su scroll (fade + lieve shift) — esposto per riuso
     4. Onda geometrica minimal: singola linea sottile (canvas)
     5. Magnetico morbido e controllato
   Performance: requestAnimationFrame, solo transform/opacity.
   ========================================================================== */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse  = window.matchMedia("(pointer: coarse)").matches;

  /* ---- 0. SFONDO ANIMATO: STRISCE ONDULATE AD ACQUERELLO --------------- */
  // Canvas a tutto schermo con backing-store piccolo (~max 340px lato lungo):
  // ridisegnato in rAF e poi ingrandito + sfocato via CSS. Costo per-frame
  // trascurabile → 60fps anche su smartphone. Disegna nastri ondulati morbidi
  // che scorrono lentamente da DESTRA a SINISTRA e si sfumano l'uno nell'altro,
  // come un acquerello in movimento o il riflesso del sole sul mare.
  (function initMesh() {
    const canvas = document.querySelector("canvas[data-mesh]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Nastri: [colore rgba, centro Y (0-1), ampiezza (0-1), spessore (0-1),
    //          freq. spaziale, freq. armonica, velocità di scorrimento, fase].
    // Palette siciliana ad acquerello: cobalto, mare, limone, agrume, avorio.
    const BANDS = [
      { c: "rgba(27,64,150,0.34)",   y: 0.16, amp: 0.10, th: 0.34, k: 2.1, k2: 4.7, sp: 0.55, ph: 0.0 }, // cobalto
      { c: "rgba(86,160,206,0.30)",  y: 0.34, amp: 0.12, th: 0.30, k: 1.7, k2: 3.9, sp: 0.42, ph: 1.7 }, // mare
      { c: "rgba(255,251,236,0.55)", y: 0.50, amp: 0.13, th: 0.34, k: 1.4, k2: 3.1, sp: 0.33, ph: 3.2 }, // avorio (luce)
      { c: "rgba(244,200,70,0.40)",  y: 0.66, amp: 0.12, th: 0.32, k: 1.9, k2: 4.3, sp: 0.48, ph: 0.8 }, // limone
      { c: "rgba(231,120,46,0.34)",  y: 0.82, amp: 0.11, th: 0.34, k: 2.3, k2: 5.1, sp: 0.60, ph: 2.4 }, // agrume
      { c: "rgba(110,154,46,0.20)",  y: 0.93, amp: 0.10, th: 0.26, k: 1.6, k2: 3.6, sp: 0.38, ph: 4.1 }, // pistacchio (accenno)
    ];
    const BASE = "#FDF6E8"; // bianco avorio caldo

    let w = 0, h = 0, running = false, t = 0;

    function resize() {
      // Il canvas è fixed/inset:0 → la sua box coincide col viewport.
      // Usiamo le dimensioni reali dell'elemento (più affidabili di innerWidth
      // al primo paint dentro a iframe/preview) con un fallback al viewport.
      const r = canvas.getBoundingClientRect();
      const vw = Math.round(r.width)  || window.innerWidth  || 1280;
      const vh = Math.round(r.height) || window.innerHeight || 720;
      const long = Math.max(vw, vh);
      const scale = Math.min(340 / long, 1);     // lato lungo ≤ 340px
      const nw = Math.max(8, Math.round(vw * scale));
      const nh = Math.max(8, Math.round(vh * scale));
      if (nw === w && nh === h) return false;
      w = nw; h = nh;
      canvas.width = w; canvas.height = h;
      return true;
    }

    // Un nastro = banda riempita tra due bordi ondulati, fase che cresce → la
    // cresta si sposta verso SINISTRA. Due seni sommati = onda irregolare.
    function band(B) {
      const cy = B.y * h, amp = B.amp * h, thick = B.th * h;
      const top = cy - thick / 2, bot = cy + thick / 2;
      const phT = t * B.sp + B.ph;
      const phB = t * B.sp * 0.86 + B.ph + 1.3;
      const step = Math.max(3, Math.floor(w / 48));
      ctx.beginPath();
      ctx.moveTo(0, top + Math.sin(phT) * amp);
      for (let x = 0; x <= w; x += step) {
        const n = x / w;
        const y = top + (Math.sin(n * B.k * 6.283 + phT) * 0.62
                       + Math.sin(n * B.k2 * 6.283 + phT * 1.4) * 0.38) * amp;
        ctx.lineTo(x, y);
      }
      for (let x = w; x >= 0; x -= step) {
        const n = x / w;
        const y = bot + (Math.sin(n * B.k * 6.283 + phB) * 0.6
                       + Math.sin(n * B.k2 * 6.283 + phB * 1.3) * 0.4) * amp;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = B.c;
      ctx.fill();
    }

    function draw() {
      ctx.fillStyle = BASE;
      ctx.fillRect(0, 0, w, h);
      for (const B of BANDS) band(B);
    }

    function frame() {
      if (!running) return;
      t += 0.010;                  // scorrimento lento e dolce
      draw();
      requestAnimationFrame(frame);
    }

    function start() { if (!running) { running = true; requestAnimationFrame(frame); } }
    function stop()  { running = false; }

    resize();
    draw(); // primo fotogramma immediato (niente flash bianco)

    // ResizeObserver: scatta anche all'attach e quando l'iframe/preview cambia
    // dimensione senza emettere l'evento resize della finestra.
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => { if (resize() && !running) draw(); }).observe(canvas);
    }
    window.addEventListener("resize", () => { if (resize() && !running) draw(); }, { passive: true });
    // Insurance contro un primo paint con larghezza ancora 0 (font/layout tardivi)
    window.addEventListener("load", () => { if (resize() && !running) draw(); });
    document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });

    if (reduced) return;   // un solo fotogramma se l'utente preferisce
    start();
  })();

  /* ---- 1. NAVBAR ------------------------------------------------------- */
  const nav = document.querySelector("[data-nav]");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const toggle = nav.querySelector("[data-nav-toggle]");
    if (toggle) {
      toggle.addEventListener("click", () => nav.classList.toggle("is-open"));
      nav.querySelectorAll(".nav__links a").forEach((a) =>
        a.addEventListener("click", () => nav.classList.remove("is-open")));
    }
  }

  /* ---- 2. SMOOTH SCROLL ------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  /* ---- 3. REVEAL ON SCROLL (riusabile) --------------------------------- */
  // Observer condiviso: anche menu.js lo usa per i nuovi elementi renderizzati.
  let revealObserver = null;
  if (!reduced && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  }

  function observeReveals(scope = document) {
    const els = scope.querySelectorAll("[data-reveal]:not(.is-visible)");
    if (!revealObserver) { els.forEach((el) => el.classList.add("is-visible")); return; }
    els.forEach((el) => revealObserver.observe(el));
  }
  observeReveals();

  // API pubblica minimale per altri moduli (es. menu.js dopo il render)
  window.MarePinella = { observeReveals };

  /* ---- 4. ONDA MINIMAL: singola linea sottile -------------------------- */
  document.querySelectorAll("canvas[data-wave]").forEach((canvas) => initWaveLine(canvas));

  function initWaveLine(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stroke = canvas.dataset.stroke || "#1B4096";
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), phase = 0, running = false;

    function resize() {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      const amp = h * 0.28, mid = h * 0.5;
      for (let x = 0; x <= w; x += 6) {
        const n = x / w;
        const y = mid + Math.sin(n * 6.2 + phase) * amp * 0.6 + Math.sin(n * 3 + phase * 0.6) * amp * 0.4;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = stroke;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function frame() { if (!running) return; phase += 0.012; draw(); requestAnimationFrame(frame); }

    if (reduced) { draw(); return; }
    const vis = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting && !running) { running = true; requestAnimationFrame(frame); }
      else if (!e.isIntersecting) running = false;
    }), { threshold: 0.01 });
    vis.observe(canvas);
  }

  /* ---- 5. MAGNETICO MORBIDO -------------------------------------------- */
  const magnets = document.querySelectorAll("[data-magnetic]");
  if (magnets.length && !coarse && !reduced) {
    magnets.forEach((btn) => {
      const strength = parseFloat(btn.dataset.magnetic) || 0.22; // più discreto
      const inner = btn.querySelector(".magnetic__inner") || btn;
      let raf = null, cx = 0, cy = 0, tx = 0, ty = 0;
      function animate() {
        cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
        btn.style.transform = `translate(${cx}px, ${cy}px)`;
        inner.style.transform = `translate(${cx * 0.35}px, ${cy * 0.35}px)`;
        if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) raf = requestAnimationFrame(animate);
        else raf = null;
      }
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * strength;
        ty = (e.clientY - (r.top + r.height / 2)) * strength;
        if (!raf) raf = requestAnimationFrame(animate);
      });
      btn.addEventListener("mouseleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(animate); });
    });
  }

  /* ---- 6. PARALLASSE SOFT --------------------------------------------- */
  // I dettagli decorativi [data-parallax] scorrono a velocità diversa dal
  // contenuto, creando profondità. Calcolo basato sulla posizione a schermo.
  const decors = Array.from(document.querySelectorAll("[data-parallax]"));
  if (decors.length && !reduced) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      decors.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const r = el.getBoundingClientRect();
        const fromCenter = (vh / 2) - (r.top + r.height / 2);
        el.style.transform = `translate3d(0, ${(fromCenter * speed).toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ---- 7. ANNO FOOTER -------------------------------------------------- */
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---- FLIP CARD PIATTI: click sulla foto -> descrizione presa dal menù ---- */
(() => {
  document.querySelectorAll(".dish-card").forEach((card) => {
    const btn = card.querySelector(".dish-card__flip");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      btn.setAttribute("aria-expanded", flipped ? "true" : "false");
    });
  });
})();

/* ---- CAROSELLO HERO: una foto alla volta, scorrono (auto + frecce + pallini) ---- */
(() => {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;
  const track = root.querySelector("[data-carousel-track]");
  const slides = Array.from(track.children);
  const dotsWrap = root.querySelector("[data-carousel-dots]");
  if (!track || slides.length === 0) return;

  let i = 0, timer = null;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  slides.forEach((_, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Vai alla foto " + (idx + 1));
    b.addEventListener("click", () => go(idx));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function update() {
    track.style.transform = "translateX(" + (-i * 100) + "%)";
    dots.forEach((d, idx) => d.setAttribute("aria-current", idx === i ? "true" : "false"));
  }
  function go(n) { i = (n + slides.length) % slides.length; update(); restart(); }
  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  const nextBtn = root.querySelector("[data-carousel-next]");
  const prevBtn = root.querySelector("[data-carousel-prev]");
  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  function restart() { clearInterval(timer); if (!reduce) timer = setInterval(next, 4500); }
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);

  update();
  restart();
})();

/* ---- SELETTORE LINGUA IT / EN / FR (tutto il sito) ----
   IT = testo originale nel DOM, EN = data-en, FR = data-fr (fallback a EN se manca).
   Espone window.MarePinella.getLang() e lancia l'evento "mare:langchange":
   i moduli che generano HTML (es. menu.js) lo ascoltano per ri-renderizzare. */
(() => {
  const group = document.querySelector("[data-lang-switch]");
  const LANGS = ["it", "en", "fr"];
  let current = "it";

  const els = Array.from(document.querySelectorAll("[data-en]"));
  els.forEach((el) => { el.dataset.it = el.innerHTML; });
  const phs = Array.from(document.querySelectorAll("[data-en-ph]"));
  phs.forEach((el) => { el.dataset.itPh = el.getAttribute("placeholder") || ""; });

  function pick(el, lang) {
    if (lang === "en") return el.getAttribute("data-en");
    if (lang === "fr") return el.getAttribute("data-fr") || el.getAttribute("data-en");
    return el.dataset.it;
  }
  function pickPh(el, lang) {
    if (lang === "en") return el.getAttribute("data-en-ph");
    if (lang === "fr") return el.getAttribute("data-fr-ph") || el.getAttribute("data-en-ph");
    return el.dataset.itPh;
  }

  function setLang(lang) {
    if (!LANGS.includes(lang)) lang = "it";
    current = lang;
    els.forEach((el) => { el.innerHTML = pick(el, lang); });
    phs.forEach((el) => { el.setAttribute("placeholder", pickPh(el, lang)); });
    document.documentElement.lang = lang;
    if (group) group.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    try { localStorage.setItem("lang", lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("mare:langchange", { detail: { lang } }));
  }

  // API per altri moduli (menu.js legge la lingua al primo render)
  window.MarePinella = window.MarePinella || {};
  window.MarePinella.getLang = () => current;
  window.MarePinella.setLang = setLang;

  if (group) {
    group.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lang]");
      if (b) setLang(b.dataset.lang);
    });
  }

  let saved = "it";
  try { saved = localStorage.getItem("lang") || "it"; } catch (e) {}
  setLang(LANGS.includes(saved) ? saved : "it");
})();
