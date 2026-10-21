# Handoff: Thailand + Vietnam Trip Plan & Static Site

Self-contained brief for an agent to execute. Read this whole file before starting.
Work through the phases **in order**. Each phase is sized to fit in one agent session.

## Ground rules

- Project root: `~/development/thailand-vietnam-trip/` (git repo already initialized, branch `main`, empty).
- **Never `git add`, commit, or push.** Leave all changes unstaged for Jimmy to review.
- **Never invent URLs.** Only cite URLs you actually fetched successfully. If a fetch fails, move on.
- Every price is a **USD per-person estimate** unless stated otherwise. Label it `~$X` or `$X–Y`.
- Anything time-sensitive (NYE 2026 tickets/lineups, hours, holiday closures, visa rules) gets marked **(verify)**.
- No personal info in the site (names, booking confirmation numbers, phone numbers). GitHub Pages is public.
- No frameworks, no build step, no npm. Plain HTML/CSS/vanilla JS.

## Trip facts (decided)

| | |
|---|---|
| Group | 5 single guys, ~30, from NYC, first time in SE Asia |
| Budget | High (~$300–500k earners). Don't be cheap, but value-conscious. |
| Luggage | Carry-on + backpack (not backpacking) |
| Rooms | Sharing OK, **individual beds required** |
| Lodging | Mix of villa/hotel depending on city |
| Interests | Culture, food, temples, landscapes, cities; moderate adventure (kayaking, snorkeling, fishing, cooking classes). Partying is secondary: NYE + knowing going-out areas per city. |
| Restrictions | None (food or activities) |
| Flights | **Out of scope** (don't research flights) |
| Currency | USD per person |
| Hosting | GitHub Pages |

### Skeleton (dates verified against calendar)

| Date | Day | Where | Notes |
|---|---|---|---|
| Sun Dec 27 2026 | Sun | NYC | Depart (via Singapore, premium economy) |
| Tue Dec 29 | Tue | Phuket | Land HKT ~8am. Jet-lag day: pool, massage, nice dinner |
| Wed Dec 30 | Wed | Phuket | Big day trip (boat) |
| Thu Dec 31 | Thu | Phuket | Easy day; **NYE at a big beach club** |
| Fri Jan 1 2027 | Fri | Phuket → Bangkok | Afternoon flight (post-NYE) |
| Sat Jan 2 | Sat | Bangkok | Chatuchak is weekend-only |
| Sun Jan 3 | Sun | Bangkok | |
| Mon Jan 4 | Mon | Bangkok → Hanoi | Arrive afternoon |
| Tue Jan 5 | Tue | Hanoi | Free day |
| Wed Jan 6 | Wed | Ninh Binh day trip | Early departure, Tràng An boat, Hang Múa hike, back after dinner |
| Thu Jan 7 | Thu | Lan Ha Bay cruise | Leave AM, board ~noon, kayak, sleep aboard |
| Fri Jan 8 | Fri | Lan Ha → Hanoi | Breakfast aboard, disembark ~11–11:30, back ~2–3pm. Hanoi weekend walking street starts Fri night |
| Sat Jan 9 | Sat | Hanoi → NYC | Fly home |

**Vietnam day order is NOT fixed.** Suggest swaps if there's a reason (weather, crowds, closures, e.g. Ho Chi Minh Mausoleum is often closed Mon & Fri (verify)).
Overnight trips away from home bases are welcome as options where they fit the schedule. **Phuket stays at one base for all three nights; no Phuket overnight excursion.**

### Preferences already expressed
- Phuket base: leaning **Kamala / Surin** (validate vs Bang Tao, Patong, Kata). Villa likely.
- NYE: **big beach club** (e.g., Café del Mar Kamala, Catch Beach Club Bang Tao; verify, compare others).
- Site should include everything (can scale back later): day-by-day, interactive map, where-to-stay, group decisions, budget, culture cheat sheet, booking checklist, packing.

---

## Phase 1: Research (4 independent tasks, can run in parallel)

Each task writes **one** file in `docs/research/` and nothing else. Use `webfetch`.
Every file must have: clear headings, bullets, a **Places** table (name | category | lat | lng to 4 decimals | city), a **Sources** list (only fetched URLs), and a **Verify before booking** list.

### 1A: `docs/research/phuket.md`
Starting sources: `https://en.wikivoyage.org/wiki/Phuket`, `/wiki/Kamala`, `/wiki/Patong`, `/wiki/Phang_Nga_Bay`, `/wiki/Ko_Phi_Phi`, `/wiki/Phuket_Town` (all on en.wikivoyage.org), plus Wikipedia.
1. **Where to stay:** compare Kamala, Surin, Bang Tao, Patong, Kata (pros/cons, distance to nightlife and airport). Recommend one. Villa vs hotel for 5 people. Price range per night for a high-end pool villa sleeping 5 with separate beds at NYE peak (note minimum stays). Also name 2–3 hotel alternatives (e.g., Twinpalms, Andara, Rosewood, Keemala, Kimpton Kitalay), verify each exists and which area it's in.
2. **NYE beach clubs:** Café del Mar, Catch, plus others (Xana, Bimi, Kudo, Ilha Verde; verify). What NYE is typically like, ticket and table price ranges, when to book. Include a backup plan.
3. **Activities**, each with duration, cost per person and booking notes: Phang Nga Bay / James Bond Island / sea-cave canoeing (John Gray's Sea Canoe), Phi Phi + Maya Bay (current rules), a private speedboat charter for 5, Similan (is it open in late Dec?), a deep-sea fishing charter, Big Buddha, Wat Chalong, Old Town, a cooking class, muay thai, an ethical elephant sanctuary only, sunset spots (Promthep Cape, Karon Viewpoint).
4. **Overnight options:** 1 night on Phi Phi, Railay/Krabi, or Koh Yao Noi. Give pros/cons given only 3 nights and jet lag.
5. **Food:** southern Thai dishes to try; named restaurants (casual and 1–2 upscale).
6. **Nightlife:** Bangla Road, the beach clubs, Old Town bars.
7. **Getting around:** Grab/Bolt, a private driver for the day, airport-to-Kamala transfer time.

### 1B: `docs/research/bangkok.md`
Starting sources: `en.wikivoyage.org/wiki/Bangkok` and its district pages (`Bangkok/Sukhumvit`, `/Rattanakosin`, `/Chinatown`, `/Silom`, `/Riverside`), plus `/wiki/Ayutthaya`, `/wiki/Kanchanaburi`, `/wiki/Khao_Yai_National_Park`, `/wiki/Damnoen_Saduak`, and Wikipedia.
1. **Where to stay:** compare Sukhumvit (Asok/Thonglor), Riverside, Silom/Sathorn, Old Town. Recommend one. Name 3–5 high-end hotels (e.g., Capella, Mandarin Oriental, Rosewood, Sukhothai, Kimpton Maa-Lai, Park Hyatt; verify) with area and price per night, and suggest a room setup for 5.
2. **Sights:** Grand Palace / Wat Phra Kaew (dress code, hours), Wat Pho, Wat Arun, Golden Mount, Jim Thompson House, river boats, a Thonburi khlong longtail tour, Chatuchak, Chinatown.
3. **Food:** Yaowarat street food, named famous spots (Jay Fai, Thipsamai, Michelin Bib Gourmand picks; verify), 1–2 tasting menus (Sorn, Le Du, Nusara, Potong, Gaggan; verify), food tours, cooking classes.
4. **Nightlife:** rooftop bars (Sky Bar, Octave, Vertigo, Tichuca), Thonglor/Ekkamai, Soi 11, RCA, Khao San (for the experience), top cocktail bars, muay thai at Rajadamnern or Lumpinee (fight nights).
5. **Day and overnight options** (time, cost, pros/cons): Ayutthaya, the Damnoen Saduak + Maeklong railway market combo, Kanchanaburi/Erawan (probably needs an overnight), Khao Yai (overnight). Say why Pattaya/Samet are probably a skip.
6. **Getting around:** Grab, BTS/MRT, river boats, traffic warnings, BKK vs DMK airport transfer times.

### 1C: `docs/research/hanoi.md`
Starting sources: `en.wikivoyage.org/wiki/Hanoi`, `/wiki/Ninh_Binh`, `/wiki/Tam_Coc`, `/wiki/Ha_Long_Bay`, `/wiki/Cat_Ba_Island`, `/wiki/Sa_Pa`, `/wiki/Ha_Giang`; `en.wikipedia.org/wiki/Tràng_An_Scenic_Landscape_Complex`, `/wiki/Lan_Ha_Bay`.
1. **Where to stay:** compare Old Quarter, French Quarter/Hoan Kiem, West Lake. Recommend one. Name 3–5 high-end hotels (Metropole, Capella Hanoi, Hotel des Arts, La Siesta; verify) with price per night and a room setup. Should they keep the room during the cruise night or check out and store bags?
2. **Sights:** Hoan Kiem Lake + Ngoc Son, Old Quarter, Temple of Literature, the Mausoleum (hours/closures), Hoa Lo Prison, Museum of Ethnology, Train Street (current access rules), water puppets, Tran Quoc Pagoda, Long Bien Bridge, the weekend walking street.
3. **Food:** dishes to try (pho, bun cha, cha ca, banh mi, egg coffee, bia hoi) and named spots (Bun Cha Huong Lien, Pho Gia Truyen, Cha Ca Thang Long, Cafe Giang, Ta Hien bia hoi; verify). A motorbike street-food tour with drivers, a cooking class with market visit, 1–2 upscale dinners.
4. **Nightlife:** Ta Hien, rooftops, cocktail bars, clubs.
5. **Ninh Binh:** Tràng An vs Tam Cốc (pick one), Hang Múa, Bái Đính, Hoa Lư, biking. Private car + guide vs group tour, costs, transfer time. Overnight in Ninh Binh vs a day trip: pros/cons.
6. **Lan Ha Bay:** compare with Ha Long and Bai Tu Long and explain why Lan Ha. Name reputable high-end 2D1N cruises (verify) with price per person, the typical schedule, transfer time, and the seaplane option. Cover January weather (cool, misty, cold water).
7. **Other overnights:** Sa Pa, Ha Giang (probably too long), Mai Chau, Pu Luong. Give a verdict given the days available.
8. **Recommended order for Jan 4–9**, with reasoning for any swaps.
9. **Getting around:** Grab, HAN airport transfer, private drivers.

### 1D: `docs/research/practicals.md`
Prefer official sources: travel.state.gov country pages for Thailand and Vietnam; `https://tdac.immigration.go.th`; `https://evisa.gov.vn` (warn about lookalike scam sites); CDC traveler pages for Thailand and Vietnam; and Wikivoyage's Thailand, Vietnam, Thai phrasebook and Vietnamese phrasebook pages.
1. **Entry, for US passports:**
   - Thailand: visa exemption length, the TDAC (when to submit), any tourism fee if in effect.
   - Vietnam: e-visa (single vs multiple entry, processing time, cost).
   - Passport validity and blank pages, onward ticket requirement.
   - Singapore transit.
2. **Health:** vaccines, travel insurance, water, dengue, food safety.
3. **Money:** THB and VND, approximate exchange rates, cards vs cash, Thai ATM fees, tipping and bargaining norms.
4. **Connectivity:** eSIM vs local SIM, apps to install (Grab, Bolt, Google Maps, Google Translate offline, LINE, Zalo, Klook, XE).
5. **Weather** late Dec / early Jan for Phuket, Bangkok and Hanoi (Hanoi is cool: bring a jacket).
6. **Etiquette and law:**
   - temple dress code
   - lèse-majesté (serious)
   - heads and feet
   - the wai greeting
   - Buddha image rules
   - drug laws, including current Thai cannabis status (verify)
   - vapes illegal in Thailand, banned in Vietnam (verify)
   - Thai alcohol sale hours
   - nightlife safety
   - motorbike rental warning
7. **Scams:** "Grand Palace is closed today", tuk-tuk gem shops, Phuket jet skis, taxi meter refusal, Hanoi cyclo / shoe-shine / fruit-photo, fake e-visa sites, VND zero confusion.
8. **Phrasebook:** about 10 phrases each in Thai (men use "khrap") and Vietnamese, with pronunciation.
9. **Packing list** for carry-on + backpack covering two climates, temple clothes, a NYE outfit, power adapters (TH: A/B/C/O; VN: A/C/F; 220V), and a dry bag.
10. **Emergency numbers** (TH tourist police 1155; VN 113/115) and the US Embassy in Bangkok and in Hanoi, with addresses and coordinates.
11. **Time zone:** UTC+7 in both countries, which is NYC + 12h in winter.

---

## Phase 2: Itinerary draft → `docs/itinerary.md`

Inputs: the four research files. Output a human-readable plan that Jimmy reviews **before** the site is built.

Include:
1. **Summary:** route, nights per city, and the base area and lodging recommendation for each city.
2. **Day by day** (Dec 29 → Jan 9). For each day:
   - a title
   - a morning / afternoon / evening block
   - meals with named spots
   - a cost estimate per person
   - booking notes
   - a "chill alternative" where it makes sense
3. **Group choices to discuss**, as a table per option: choice | pros | cons | cost pp | effort. At minimum:
   - Phuket lodging: villa vs hotel (2–3 named picks)
   - NYE club: 2–3 choices
   - Phuket Dec 30 big day: Phang Nga vs Phi Phi vs private charter vs fishing
   - Bangkok: day trip (Ayutthaya, or floating + railway markets) vs staying in the city; Kanchanaburi or Khao Yai overnight
   - Bangkok: tasting-menu dinner pick
   - Vietnam order: the current order vs a suggested swap
   - Ninh Binh: day trip vs overnight
   - Lan Ha cruise: 2–3 named picks
   - Sa Pa: yes/no
4. **Budget**, in USD per person as low/high ranges: lodging, food & drink, activities/tours, NYE, local transport, misc, plus a total. Flights excluded. State the assumptions.
5. **Booking checklist**, sorted by deadline: item | book by | why | link. NYE tickets, the Phuket villa and the Lan Ha cruise come first. Also the Vietnam e-visa (apply at least 2–3 weeks ahead), the TDAC (within 3 days of arrival), and travel insurance.
6. **Open questions for the group.**

Stop here and tell Jimmy it's ready to review. **Don't build the site until he approves** (or tells you to proceed).

---

## Phase 3: Build the site

### Product direction from Jimmy (2026-10-20)

- Keep every group decision as an option in the final product; do not silently convert the current recommendation into a final group decision.
- Phuket is one base for all three nights (Dec 29–31). Do not offer or plan an overnight away from Phuket during this stop.
- Make the public site useful to both skim-readers and detail-oriented planners: a concise overview first, then three stop tabs (Phuket, Bangkok, Hanoi), each with its own Overview / Details selector. Ninh Binh and Lan Ha Bay belong within the Hanoi page.
- Remove photos from the site. Keep the reading experience text-first and easy to scan.
- Do not collect votes or show selectable choices inside stop details. Show brief decision notes in the relevant stop details and put the full, read-only decision summary on a separate page, grouped by the three stops.

### File layout
```
thailand-vietnam-trip/
├── index.html
├── details.html               # three stop tabs, each with an Overview / Details selector
├── decisions.html             # group decisions, summarized by stop; no interactive voting
├── essentials.html            # map, budget, checklist, culture, packing and practicals
├── assets/css/styles.css
├── assets/js/app.js          # renders everything from window.TRIP
├── data/trip.js              # ALL content: `window.TRIP = {...}`
├── tests/trip-data.test.js   # Node built-in tests for itinerary and decision data integrity
├── docs/                     # handoff, research, itinerary (not linked from site, or linked as "sources")
├── README.md
├── Makefile
└── .nojekyll                 # empty; stops GitHub Pages' Jekyll processing
```

**Why `data/trip.js` and not JSON:** `fetch()` of a local JSON file fails over `file://`. Assigning a global makes the site work both on GitHub Pages **and** when opened locally by double-clicking `index.html`.

### Data schema (`window.TRIP`)
```js
window.TRIP = {
  meta: { title, subtitle, startDate: "2026-12-29", endDate: "2027-01-09", departureDate: "2026-12-27", travelers: 5, currency: "USD", updated: "YYYY-MM-DD", flightsExcluded: true },
  route: ["Phuket", "Bangkok", "Hanoi"],
  quickSummary: "Short overview shown before the detailed itinerary.",
  stops: [ { id, legId, name, dateRange, overview, highlights:[], sections:[], subStops:[] } ],
  legs: [ { id: "phuket", city, country, flag, nights, dateRange, color, summary,
            stay: { recommendation, area, why, options: [ { name, type: "villa|hotel", area, pricePerNight, perPerson, url, pros:[], cons:[] } ] } } ],
  days: [ { date: "2026-12-29", weekday, legId, stopId, subStopId, title, summary, costPP: [low, high],
            items: [ { time: "morning|afternoon|evening|HH:MM", title, desc, placeId, tags:["food","temple","adventure","nightlife","culture","chill"], booking: "required|recommended|walk-in", costPP } ],
            alt } ],
  places: [ { id, name, legId, category: "stay|food|sight|temple|nightlife|activity|transport|emergency", lat, lng, note, url } ],
  options: [ { id, legId, stopId, group, question, choices: [ { id, name, pros:[], cons:[], costPP, effort, recommended: bool } ] } ],
  budget: { assumptions: [], rows: [ { category, low, high, note } ] },
  checklist: [ { id, item, bookBy, priority: "critical|high|normal", why, url } ],
  culture: { thailand: { etiquette:[], laws:[], scams:[], tipping, phrases:[ {en, local, say} ] }, vietnam: { ...same } },
  packing: [ { group, items: [] } ],
  practical: { entry:[], money:[], apps:[], weather:[], emergency:[] },
  sources: [ { title, url } ]
};
```
`app.js` should render purely from this object. To change content, only `trip.js` needs editing.

### Sections

**`index.html` — quick overview:** title and dates, route strip, plain-language trip summary, three city/night cards, highlights, budget range, highest-priority booking items, and links to the three stop pages, the decision summary, and trip essentials. Keep this page concise.

**`details.html` — stop pages:** show tabs for Phuket, Bangkok, and Hanoi. Each tab has its own **Overview / Details** selector. The overview has the date range, short summary, highlights, and day list. Details expands the stop's day-by-day schedule with meals, booking notes, chill alternatives, and the local lodging / transport / food notes. Hanoi details include dedicated Ninh Binh and Lan Ha Bay subsections. Include brief, non-interactive decision notes in the relevant stop details.

**`decisions.html` — group decisions:** list every open decision by Phuket, Bangkok, and Hanoi. Include the choices, pros, cons, approximate cost, and effort. This page is a discussion guide only: no selectable voting, localStorage vote state, or copy-my-picks button.

**`essentials.html` — trip essentials:** Leaflet 1.9.x map from unpkg CDN with OpenStreetMap tiles (attribution required) and no API key; markers by category, filter by city, popups with an "Open in Google Maps" link (`https://www.google.com/maps/search/?api=1&query=LAT,LNG`), budget, booking checklist, culture tabs, packing, practicals, emergency information, and sources. Checklist checkboxes may be saved in `localStorage` and critical items are highlighted.

All pages share the footer with a last-updated date, sources, and the disclaimer "prices are estimates; verify before booking". The site has **no photos or image assets**.

### Quality bar
- Mobile-first (most friends will open it on a phone). Test at 375px width; there must be no horizontal scroll.
- Accessible: semantic HTML, headings in order, buttons are real `<button>` elements, visible focus states, sufficient contrast, map has a text alternative (the places list).
- Stop tabs and Overview / Details selectors are keyboard operable and expose their current state.
- `@media print`: hide nav, map and interactive controls; expand all days.
- Tasteful look, not generic: a warm palette (e.g., deep teal + saffron + off-white), one display font + one body font from Google Fonts (or system fonts), plenty of whitespace. No emojis except country flags.
- Zero console errors. No external dependencies besides Leaflet and optional Google Fonts.
- No images; keep the payload small.

---

## Phase 4: Verify
- Serve locally: `python3 -m http.server 8000` from the repo root and open `index.html`, `details.html`, `decisions.html`, and `essentials.html`. Also open each HTML page directly via `file://`.
- Check: the overview is concise; each city tab and its Overview / Details selector works; Ninh Binh and Lan Ha appear inside Hanoi; decisions are grouped by stop and have no interactive voting; map shows all markers and places list works as its text alternative; checklist persists across reload; layout works at 375px; print preview is clean; no console errors.
- Check that every `placeId` in `days` exists in `places` (add a small console warning in `app.js` for missing IDs).

## Phase 5: README + Makefile
**README.md:** what this is, how to edit (`data/trip.js`), how to preview locally, and how to deploy to GitHub Pages:
1. Create a GitHub repo.
2. Push `main`.
3. Settings → Pages → Deploy from branch → `main` / root.
4. The site goes live at `https://<user>.github.io/<repo>/`.

Include a note that the site is public.

**Makefile** (per workspace ADR-012 shared vocabulary; keep targets thin):
```make
.PHONY: help serve verify
help:    ## List targets
	@grep -E '^[a-z]+:.*##' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "%-10s %s\n", $$1, $$2}'
serve:   ## Preview at http://localhost:8000
	python3 -m http.server 8000
verify:  ## Syntax-check JS and run tests
	node --check assets/js/app.js && node --check data/trip.js && node --test
```

## Done when
- All four research files, `docs/itinerary.md`, `index.html`, `details.html`, `decisions.html`, `essentials.html`, the site files, tests, README, Makefile and `.nojekyll` exist.
- Phase 4 checks pass.
- Nothing is staged or committed. Report a short summary to Jimmy, listing the open questions and the items marked (verify).
