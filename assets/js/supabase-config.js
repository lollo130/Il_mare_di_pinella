/* ==========================================================================
   IL MARE DI PINELLA — Configurazione Supabase (chiavi PUBBLICHE)
   ==========================================================================
   Questi due valori sono pubblici per natura: possono stare nel sito.
   La sicurezza NON dipende da nasconderli, ma dalle policy RLS sul database
   (lettura aperta solo agli eventi pubblicati; scrittura solo ai proprietari
   autorizzati e autenticati). La chiave potente "service_role" NON è qui.
   ========================================================================== */
window.SUPABASE_URL = "https://mivcaiicpjjnrhhwhlto.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_p0IWs-q5817cAFrMry1z-g_y3QoYUc9";
