/* ==========================================================================
   IL MARE DI PINELLA — Keep-alive Supabase (funzione schedulata Netlify)
   ==========================================================================
   Il progetto Supabase free viene messo in pausa dopo ~7 giorni di inattività.
   Questa funzione fa un piccolo GET all'API una volta al giorno, così il
   progetto resta sempre attivo. Gira sull'infrastruttura Netlify (cron),
   indipendente da GitHub. Usa solo la chiave PUBBLICA.
   ========================================================================== */

export const config = { schedule: "@daily" };

const PING_URL =
  "https://mivcaiicpjjnrhhwhlto.supabase.co/rest/v1/eventi?select=id&limit=1";
const ANON_KEY = "sb_publishable_p0IWs-q5817cAFrMry1z-g_y3QoYUc9";

export default async () => {
  try {
    const res = await fetch(PING_URL, { headers: { apikey: ANON_KEY } });
    console.log("keepalive supabase: HTTP", res.status);
  } catch (e) {
    console.log("keepalive supabase errore:", e && e.message);
  }
  return new Response("ok");
};
