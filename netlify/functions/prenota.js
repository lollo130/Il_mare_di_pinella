/* ==========================================================================
   IL MARE DI PINELLA — Netlify Function: prenotazioni -> WhatsApp (Meta API)
   ==========================================================================
   Riceve i dati del form prenotazione e invia un messaggio template allo staff
   via WhatsApp Cloud API. Il token resta qui (server), mai nel sito.

   ⚙️  ENV VAR su Netlify (Site settings → Environment variables):
         WHATSAPP_TOKEN     = token permanente (System User)
         WHATSAPP_PHONE_ID  = Phone Number ID del numero bot (1233512296506308)
         WHATSAPP_DEST      = numero staff destinatario (es. 393296773519)
         WHATSAPP_TEMPLATE  = (opz.) nome template, default "nuova_prenotazione"
         WHATSAPP_LANG      = (opz.) lingua template, default "it"

   Il browser chiama /api/prenota (vedi netlify.toml).
   ========================================================================== */

const GRAPH = "https://graph.facebook.com/v21.0";

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: "method_not_allowed" }) };

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const dest = process.env.WHATSAPP_DEST;
  const template = process.env.WHATSAPP_TEMPLATE || "nuova_prenotazione";
  const lang = process.env.WHATSAPP_LANG || "it";

  if (!token || !phoneId || !dest)
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: "config_mancante" }) };

  let d;
  try { d = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "json" }) }; }

  // Ripulisce, limita, mette "-" nei campi vuoti (i template richiedono tutte
  // le variabili valorizzate). Niente a-capo/tab: WhatsApp li rifiuta nei parametri.
  const clean = (s, max) =>
    String(s == null ? "" : s).replace(/[\r\n\t]+/g, " ").trim().slice(0, max || 200) || "-";
  const nome = clean(d.nome, 80);
  const persone = clean(d.persone, 12);
  const data = clean(d.data, 60);
  const ora = clean(d.ora, 20);
  const telefono = clean(d.telefono, 40);
  const note = clean(d.note, 300);

  const p = (t) => ({ type: "text", text: t });
  const payload = {
    messaging_product: "whatsapp",
    to: dest,
    type: "template",
    template: {
      name: template,
      language: { code: lang },
      components: [{ type: "body", parameters: [p(nome), p(persone), p(data), p(ora), p(telefono), p(note)] }],
    },
  };

  try {
    const res = await fetch(`${GRAPH}/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok || !out.messages)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: false, error: "whatsapp", detail: (out.error && out.error.message) || "" }),
      };
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: "fetch_fallito" }) };
  }
};
