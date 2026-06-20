# Il Mare di Pinella — Sito web

Sito statico (HTML + CSS + JavaScript). Nessun build, nessun server: si apre
direttamente. Design elegante su base chiara "bianco ceramica", Blu Cobalto usato
con criterio, accenti caldi oro/arancio, dettagli maiolica discreti.

## Struttura file

```
index.html            Home (Hero, Storia, anteprima Menù, Prenotazioni, Social)
menu.html             Menù interattivo completo (filtri, allergeni) — NIENTE PDF
famiglia.html         "La Famiglia di Pinella" — storytelling bilingue + galleria
recensioni.html       Pagina recensioni con voto medio e stelle
assets/
  css/styles.css      Tutto lo stile + animazioni di base
  js/main.js          Navbar, smooth scroll, reveal, onda minimal, magnetico
  js/menu.js          DATI DEL MENÙ + render + filtri dinamici
  js/reviews.js       DATI DELLE RECENSIONI + render + calcolo voto medio
  js/booking.js       Validazione form + invio precompilato su WhatsApp
  img/                Foto ottimizzate per il web (generate dalle originali)
Foto_locale/          Foto originali del locale (alta risoluzione)
Foto_piatti/          Foto originali dei piatti (alta risoluzione)
```

## 3 COSE DA FARE PRIMA DELLA PUBBLICAZIONE

### 1. Invio prenotazioni (oggi solo messaggio a schermo)
Il form prenotazione valida i campi e mostra un **messaggio animato di avvenuta
ricezione**. L'invio reale NON è ancora attivo (come da richiesta: si farà dopo).
In `assets/js/booking.js`, in fondo alla funzione di submit, c'è già un esempio
pronto per aprire WhatsApp con il messaggio precompilato: basta inserire il
numero del ristorante (formato internazionale senza "+", es. `393331234567`) e
togliere il commento.

### 2. Menù reale (prezzi e piatti)
File: `assets/js/menu.js`, array `MENU` in cima.
I piatti e i prezzi attuali sono un **esempio realistico** (il menù originale era
un'immagine non leggibile automaticamente). Aggiornare nomi, descrizioni, prezzi e
codici allergeni: il sito si rigenera da solo da questi dati.

### 3. Recensioni reali da Google
File: `assets/js/reviews.js`, array `REVIEWS` in cima.
Le recensioni attuali sono **esempi da sostituire**: NON sono quelle vere di Google.
Aprire Google Maps → scheda "Il Mare di Pinella" → Recensioni, e per ognuna copiare
nome, numero di stelle, data e testo nell'array `REVIEWS` (il voto medio si
ricalcola da solo). In `recensioni.html` inserire il link alla propria scheda Google
nel pulsante "Lascia una recensione" (cercare `data-google-link`).
In alternativa: mandare il link Google Maps del locale e le recensioni verranno
inserite. Mostrare recensioni inventate come reali è scorretto: usare solo quelle vere.

Ogni piatto:
```js
{ n:"Nome IT", e:"English name", d:"descrizione", p:"€12", a:[1,4,9], t:["mare"] }
```
- `a` = codici allergeni (1 Glutine · 2 Crostacei · 3 Uova · 4 Pesce · 5 Frutta a
  guscio · 6 Latte · 7 Sedano · 8 Solfiti · 9 Molluschi)
- `t` = tag per i filtri: `"mare"`, `"terra"`, `"veg"`, `"vini"`

## Foto
Le foto web sono in `assets/img/` (ottimizzate, ~200 KB l'una). Le originali ad alta
risoluzione restano in `Foto_locale/` e `Foto_piatti/`. Per rigenerare le versioni
ottimizzate dopo aver aggiunto nuove foto, usare uno script di ridimensionamento
(max ~1100px lato lungo, JPEG qualità ~82).

## Eventi — pannello per i proprietari (locandine + info)

Gli eventi NON si scrivono più a mano nell'HTML. Si gestiscono da una pagina
riservata, **non collegata** dal sito (nessun pulsante login sul sito pubblico):

    https://<indirizzo-del-sito>/gestione-eventi.html

### Come pubblicare un evento
1. Aprire `gestione-eventi.html` ed entrare con **email + password**.
2. Compilare data, ora, titolo, descrizione e **caricare la locandina** (immagine).
3. «Pubblica evento» → compare **subito** su `eventi.html` (in diretta, senza nuovo
   deploy). Gli eventi con data passata vanno in automatico nella sezione
   «Eventi passati». Dalla lista in fondo al pannello si possono modificare o
   eliminare.

### Per chi gestisce il sito (tecnico)
- Backend: **Supabase**, progetto `il-mare-di-pinella`. Tabella `eventi`, bucket
  Storage `locandine` (immagini pubbliche). URL + chiave **pubblica** in
  `assets/js/supabase-config.js` (sicure da esporre: la protezione è nelle policy
  RLS, non nel nascondere la chiave; la chiave `service_role` NON è nel sito).
- Chi può pubblicare: solo le email nella tabella `app_owners` (allowlist) **e**
  con un account creato in Supabase → Authentication → Users. Aggiungere un
  proprietario = inserire la sua email in `app_owners` + creargli l'utente.
- I visitatori possono **solo leggere** gli eventi pubblicati (imposto da RLS).
- Free tier: il progetto va in pausa dopo ~7 giorni senza traffico. Se gli eventi
  spariscono, riattivarlo dal dashboard Supabase (o impostare un ping settimanale,
  es. cron-job.org, per tenerlo sveglio).

## Anteprima locale
Doppio click su `index.html`, oppure server locale:
```
python -m http.server 8000
```
poi aprire http://localhost:8000

## Pubblicazione
Caricare l'intera cartella su un hosting statico (Netlify, GitHub Pages, Aruba,
qualsiasi spazio web). Nessuna configurazione server necessaria.
```
