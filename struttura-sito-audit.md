# Struttura Sito – Audit Tecnico/Legale (Musso Edilizia)

Documento operativo per fotografare lo stato attuale del sito statico e individuare lacune e prossimi miglioramenti.

## 1) STRUTTURA DELLE PAGINE (ALBERO DEL SITO)

Pagine attive in root:
- `index.html` (Home)
- `chi-siamo.html`
- `servizi.html`
- `prodotti.html`
- `contatti.html`

### index.html (Home)
Blocchi principali:
- Header (navbar fixed + menu mobile)
- Hero parallax (sfondo `negozio.jpg`, CTA “Richiedi informazioni” / “Scopri i reparti”)
- Sezione “Il tuo punto di riferimento…” (3 card: Assortimento, Consulenza, Logistica)
- Sezione parallax “Consegne con mezzi propri” (sfondo `sfondo-camion.jpg`)
- Sezione “Chi Siamo” + 4 card di processo (Richiesta/Consiglio/Preparazione/Ritiro-Consegna)
- Sezione parallax “Antinfortunistica e fai da te” + KPI (Fondazione 1966, 60 anni, 48h, 100%)
- Sezione recensioni (widget Trustindex)
- Sezione mappa (Google Maps iframe)
- Footer (colonne + blocco legale)
- Script JS (menu mobile + header on-scroll)

### chi-siamo.html
Blocchi principali:
- Header (navbar fixed + menu mobile)
- Hero parallax (sfondo `negozio.jpg`)
- Sezione storia/identità (testi + contatori 1961/65+/2 generazioni)
- Sezione valori (box con bullet)
- Sezione parallax mascotte “Spritz” (sfondo `sfondo-interno.jpg` + immagine `WhatsApp Image 2026-05-16 at 13.28.11.jpg`)
- Footer (colonne + blocco legale)
- Script JS (menu mobile + header on-scroll)

### servizi.html
Blocchi principali:
- Header (navbar fixed + menu mobile)
- Hero parallax (sfondo `IMG_20250814_103452.jpg`)
- Sezione “I nostri pilastri” (griglia 10 card servizi)
- Sezione parallax CTA “Al banco trovi la risposta. Subito.” (sfondo remoto da API immagini)
- Footer (colonne + blocco legale)
- Script JS (menu mobile + header on-scroll)

### prodotti.html
Blocchi principali:
- Header (navbar fixed + menu mobile)
- Hero parallax (sfondo `IMG_20250814_104113.jpg`)
- Filtri rapidi (bottoni con `data-filter`)
- Griglia prodotti (card “glass” con `data-category` + CTA WhatsApp)
- Sezione parallax CTA prenotazione (sfondo `sfondo-interno.jpg`)
- Footer (colonne + blocco legale)
- Script JS:
  - menu mobile + header on-scroll
  - filtro prodotti (toggle `.hidden` sulle `.product-card`)

### contatti.html
Blocchi principali:
- Header (navbar fixed + menu mobile)
- Hero parallax (sfondo `DSCN0591.jpg`)
- Sezione centrale (bg-zinc-50):
  - Card “Orari negozio”
  - Card “Contatti diretti” (telefono, mailto, indirizzo + CTA WhatsApp/Tel)
  - Griglia foto (2 immagini)
- Secondo parallax intermedio (sfondo `DSCN0593.jpg`)
- Modulo contatto (Aruba Form2Email + checkbox GDPR)
- Sezione mappa (Google Maps iframe)
- Footer (colonne + blocco legale)
- Script JS (menu mobile + header on-scroll)

## 2) LINEE GUIDA GRAFICHE E BRAND IDENTITY (HEADER & FOOTER)

### Header (navbar)
Configurazione attuale (tutte le pagine):
- Header `fixed` con sfondo trasparente che diventa scuro allo scroll (JS: `bg-anthracite/95`, `backdrop-blur-md`, `shadow-lg`)
- Logo in header dentro link a `index.html`:
  - immagine: `logo-simbolo.png`
  - testo istituzionale: “MUSSO EDILIZIA S.N.C.”
  - data: “DAL 1966” in bianco semi-trasparente (alta leggibilità)
- Font: Archivo (caricato via Google Fonts; applicato a `body` tramite CSS inline in ogni pagina)

### Footer
Struttura ricorrente:
- 4 colonne (branding + link utili + contatti + social)
- Branding del footer ancora “storico” (box rosso con lettera “M”) + testo “MUSSO EDILIZIA S.N.C.”
- Blocco legale finale centralizzato (copyright + dati fiscali + link privacy/cookie)

### Colori e stile (Tailwind + config custom)
Colori custom dichiarati via `tailwind.config` inline:
- `anthracite`: `#1a1a1a`
- `anthracite-light`: `#2d2d2d`
- `construction-red`: `#c8102e`
- `construction-red-light`: `#e03a4f`

Pattern ricorrenti:
- “Glass UI”: `bg-white/80` + `backdrop-blur-md` + `border border-white/20`/`border-white/30`
- Overlay scuro: `.gradient-overlay` (gradiente nero con alpha)
- Parallax: `.parallax-fixed` (`background-attachment: fixed` con fallback mobile a `scroll`)

## 3) CONFORMITÀ LEGALE E COMPLIANCE

### Dati societari nel footer (presenti)
Nel blocco legale risultano presenti:
- Ragione sociale e titolari: “MUSSO EDILIZIA S.N.C. di Musso Bruno e Musso Elena”
- Indirizzo completo (con CAP): “Via Chivasso 11, 14022 Castelnuovo Don Bosco (AT)”
- P.IVA e C.F.: `01435840051`
- REA: `AT-115281`
- VAT: `IT01435840051`
- PEC: `mussoedilizia@pec.it`

### Link Privacy/Cookie (presenti ma non funzionanti)
Stato attuale:
- In tutte le pagine il footer espone:
  - “Privacy Policy” con `href="#"` (placeholder)
  - “Cookie Policy” con `href="#"` (placeholder)

Impatto:
- I link non puntano a documenti reali: a livello compliance è una lacuna (soprattutto per cookie/servizi di terze parti).

### Form contatti (GDPR)
Stato attuale:
- Modulo su `contatti.html` configurato per Aruba Form2Email:
  - `action="https://www.mussoedilizia.com/cgi-bin/Form2Email.pl" method="POST"`
  - `receiver` impostato a `info@mussoedilizia.com`
- Checkbox obbligatoria GDPR presente (required)
Nota:
- Non è presente un link diretto alla Privacy Policy nel testo della checkbox (consigliato).

### Terze parti e consenso
Elementi attivi che tipicamente richiedono valutazione cookie/consenso:
- Google Maps iframe (Home e Contatti)
- Trustindex (Home) via script esterno

## 4) INFRASTRUTTURA FUNZIONALE E SCRIPT

### JavaScript attivo (tutte le pagine)
Funzioni ricorrenti:
- Toggle menu mobile:
  - bottone `#mobile-menu-btn`
  - menu container `#mobile-menu` (classe `hidden`)
  - chiusura automatica al click sui link
- Cambio stato header allo scroll:
  - soglia `window.scrollY > 40`
  - aggiunta/rimozione classi per sfondo/blur/ombra

### JavaScript specifico (prodotti.html)
Filtro catalogo:
- Bottoni `.filter-btn` con attributo `data-filter`
- Card `.product-card` con attributo `data-category`
- Logica:
  - cambia stile bottone attivo
  - nasconde/mostra card con `.hidden`

### Integrazioni esterne
CDN e font:
- Tailwind via CDN: `https://cdn.tailwindcss.com`
- Google Fonts (Archivo): `https://fonts.googleapis.com/...family=Archivo...`

Embed e servizi:
- Google Maps iframe (Home/Contatti)
- Trustindex loader (Home): `https://cdn.trustindex.io/loader.js?...`
- Aruba Form2Email (Contatti): `https://www.mussoedilizia.com/cgi-bin/Form2Email.pl`
- Link WhatsApp (`wa.me`) e `tel:` / `mailto:`

## NOTE DI OTTIMIZZAZIONE

Lacune/azioni consigliate (priorità pratica):
- Privacy/Cookie: creare pagine reali (es. `privacy-policy.html`, `cookie-policy.html`) e aggiornare i link nel footer (ora `href="#"`).
- Cookie consent: introdurre banner/gestione consenso per embed e script di terze parti (Maps/Trustindex) e valutare caricamento condizionato.
- Immagini mancanti o case-sensitive (critico in hosting Linux):
  - `prodotti.html` usa `IMG_20250814_104113.jpg` ma in root non risulta presente.
- Servizi: la sezione parallax CTA usa uno sfondo remoto (API immagini). Valutare sostituzione con foto reale locale per stabilità e performance.
- Coerenza storica: mantenere “DAL 1966” come riferimento unico su tutte le pagine e sui materiali esterni (schede, PDF, social, eventuali brochure).
- WhatsApp CTA: molti link `wa.me/?text=...` sono generici (senza numero). Uniformare al numero aziendale (es. `wa.me/390119876255?...`) dove opportuno.
- Social: link social nel footer sono `href="#"` (placeholder). Inserire URL reali o rimuovere.
- SEO: aggiungere Open Graph/Twitter Card, dati strutturati LocalBusiness, sitemap/robots, e verificare titoli H1 unici e coerenti.
- Performance: ottimizzazione immagini (compressione/resize), valutare build Tailwind (al posto del CDN) e caching.
