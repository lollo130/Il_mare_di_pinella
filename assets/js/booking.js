/* ==========================================================================
   IL MARE DI PINELLA — Form Prenotazioni (frontend)
   - Validazione campi in JavaScript (animata: scuotimento + stati colore)
   - Al "Conferma": mostra un elegante messaggio animato di avvenuta ricezione.
   - NOTA: l'invio reale (WhatsApp / email / backend) sarà implementato dopo.
     In fondo trovi un esempio già pronto per generare il link WhatsApp.
   ========================================================================== */
(() => {
  "use strict";

  const form = document.querySelector("[data-booking]");
  if (!form) return;

  let lastFocused = null; // elemento a cui restituire il focus alla chiusura modale

  /* --- Riferimenti ai campi (ri-letti dopo un eventuale reset) --- */
  const get = () => ({
    nome:    form.querySelector("#nome"),
    persone: form.querySelector("#persone"),
    data:    form.querySelector("#data"),
    ora:     form.querySelector("#ora"),
    note:    form.querySelector("#note"),
  });

  /* --- Stato visivo di un campo --- */
  function setState(input, ok, msg) {
    const field = input.closest(".field");
    if (!field) return ok;
    field.classList.toggle("is-invalid", !ok);
    field.classList.toggle("is-valid", ok);
    const err = field.querySelector(".field__error");
    if (err) err.textContent = ok ? "" : msg;
    return ok;
  }

  /* --- Regole di validazione --- */
  function validate(f) {
    return {
      nome:    setState(f.nome, f.nome.value.trim().length >= 2, "Inserisci un nome valido."),
      persone: setState(f.persone, Number(f.persone.value) >= 1, "Indica quante persone."),
      data:    setState(f.data, !!f.data.value, "Scegli una data."),
      ora:     setState(f.ora, !!f.ora.value, "Scegli un orario."),
    };
  }

  /* --- Validazione in tempo reale + data minima = oggi --- */
  function setupRealtime() {
    const f = get();
    if (f.data) f.data.min = new Date().toISOString().split("T")[0];
    ["nome", "persone", "data", "ora"].forEach((key) => {
      const input = f[key];
      if (!input) return;
      const run = () => validate(get())[key];
      input.addEventListener("blur", run);
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("is-invalid")) run();
      });
    });
  }
  setupRealtime();

  /* --- Toast (solo per errori) --- */
  function showToast(text) {
    let toast = document.querySelector(".toast");
    if (!toast) { toast = document.createElement("div"); toast.className = "toast"; document.body.appendChild(toast); }
    toast.textContent = text;
    requestAnimationFrame(() => toast.classList.add("is-on"));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("is-on"), 4000);
  }

  /* --- Decoro di maiolica per gli angoli del modale (ornamento, non griglia) --- */
  const MAIOLICA = `
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#1B4096"/>
      <circle cx="50" cy="50" r="36" fill="#E2722B"/>
      <circle cx="50" cy="50" r="26" fill="#F4D24A"/>
      <path d="M50 26 L62 50 L50 74 L38 50 Z" fill="#1B4096"/>
      <circle cx="50" cy="50" r="8" fill="#FFF6C9"/>
      <circle cx="50" cy="12" r="5" fill="#6E9A2E"/><circle cx="88" cy="50" r="5" fill="#6E9A2E"/>
      <circle cx="50" cy="88" r="5" fill="#6E9A2E"/><circle cx="12" cy="50" r="5" fill="#6E9A2E"/>
    </svg>`;

  /* --- Ripristina il modulo dopo una conferma --- */
  function resetForm() {
    form.reset();
    form.querySelectorAll(".field").forEach((fl) => {
      fl.classList.remove("is-valid", "is-invalid");
      const err = fl.querySelector(".field__error");
      if (err) err.textContent = "";
    });
    const data = form.querySelector("#data");
    if (data) data.min = new Date().toISOString().split("T")[0];
  }

  /* --- Modale premium animato di avvenuta ricezione (niente alert) --- */
  function openModal(data) {
    lastFocused = document.activeElement;
    const noteRow = data.note ? `<div><b>Note:</b> ${escapeHtml(data.note)}</div>` : "";

    const overlay = document.createElement("div");
    overlay.className = "modal";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "bm-title");
    overlay.innerHTML = `
      <div class="modal__backdrop" data-close></div>
      <div class="modal__dialog" role="document" tabindex="-1">
        <span class="modal__tile modal__tile--tl">${MAIOLICA}</span>
        <span class="modal__tile modal__tile--br">${MAIOLICA}</span>
        <button class="modal__close" data-close aria-label="Chiudi">&times;</button>
        <div class="booking-success">
          <div class="booking-success__check">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg>
          </div>
          <h3 id="bm-title">Richiesta ricevuta!</h3>
          <p class="muted">Grazie ${escapeHtml(data.nome)}, abbiamo registrato la tua richiesta.<br>Ti contatteremo a breve per la conferma del tavolo.</p>
          <div class="recap">
            <div><b>Persone:</b> ${escapeHtml(data.persone)}</div>
            <div><b>Data:</b> ${escapeHtml(data.dataFmt)}</div>
            <div><b>Ora:</b> ${escapeHtml(data.ora)}</div>
            ${noteRow}
          </div>
          <div class="booking-actions">
            <button type="button" class="btn btn--ghost" data-close>Chiudi</button>
            <button type="button" class="btn booking-reset"><span>Nuova prenotazione</span></button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    const dialog = overlay.querySelector(".modal__dialog");
    // Transizione di entrata via doppio rAF, con fallback a timer: così la
    // classe is-open viene comunque applicata anche se i rAF non scattano
    // (es. scheda in background), evitando un modale bloccato invisibile.
    const reveal = () => overlay.classList.add("is-open");
    requestAnimationFrame(() => requestAnimationFrame(reveal));
    setTimeout(reveal, 60);
    dialog.focus();

    function close() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      setTimeout(() => overlay.remove(), 420);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      // Focus trap dentro al modale
      const f = overlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    overlay.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
    overlay.querySelector(".booking-reset").addEventListener("click", () => { resetForm(); close(); });
    document.addEventListener("keydown", onKey);
  }

  /* --- Submit --- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = get();
    const results = validate(f);
    if (!Object.values(results).every(Boolean)) {
      const firstInvalid = form.querySelector(".field.is-invalid input");
      if (firstInvalid) firstInvalid.focus();
      showToast("Controlla i campi evidenziati.");
      return;
    }

    // Data leggibile in italiano
    const d = new Date(f.data.value + "T00:00:00");
    const dataFmt = isNaN(d) ? f.data.value
      : d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    openModal({
      nome: f.nome.value.trim(),
      persone: f.persone.value,
      dataFmt,
      ora: f.ora.value,
      note: f.note ? f.note.value.trim() : "",
    });

    /* === INVIO REALE (da attivare in futuro) ============================
       Esempio per aprire WhatsApp con il messaggio già pronto:

       const NUMERO = "39XXXXXXXXXX"; // numero del ristorante, senza "+"
       const testo = `Nuova Prenotazione - Il Mare di Pinella:\n${f.nome.value} `
                   + `per ${f.persone.value} persone il ${dataFmt} alle ${f.ora.value}.`;
       window.open(`https://wa.me/${NUMERO}?text=${encodeURIComponent(testo)}`, "_blank");
       ==================================================================== */
  });

  /* --- Piccola utility anti-injection per i dati mostrati --- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
