# Restaurant research: Phuket, Bangkok, Hanoi

Draft, Nov 2026. The map list is `restaurants-my-maps.csv` (one row per place, importable into Google My Maps).

## How consensus was counted

- Counted: distinct editorial and guide sources (Michelin, Time Out, Serious Eats, Lonely Planet, BBC Travel, Phuket101, Saigon Homestay, VietNamNet, Vietnam Tourism). Research subagents fetched the editorial sources; the Michelin pages below were checked directly.
- Not counted: Reddit. The fetch tool returned 403 for Reddit JSON and a splash page for old.reddit.com, so no Reddit threads were verified.
- Michelin statuses checked on official pages: Thailand 2027 star list, Thailand 2027 Bib article, Phuket directory, Le Du and Jay Fai profiles; Vietnam 2026 Hanoi 1-star list and Hanoi Bib list.
- "Selected" statuses for Chapter, T.U.N.G, Bún Chả Hương Liên and Highway 4 come from the research pass. They are not on the 2026 Bib or 1-star pages.

## Constraints used

- Group: five travelers, first trip to Southeast Asia, high budget but value-conscious (handoff).
- Phuket: three nights (Dec 29-31) at the selected CozyStay in central Patong. The listing title claims about 300 m to Bangla Road; the exact pin is not verified.
- Bangkok: dinners Jan 1-4. The booked Airbnb title claims 300 m to BTS Phrom Phong.
- Hanoi: dinners Jan 5, 6 and 8. Jan 7 is on the Lan Ha cruise; Jan 5 is arrival day.

## Schedule checks

- Jan 3, 2027 is a Sunday. Le Du is closed Sundays (Michelin profile).
- Jay Fai (Michelin profile): open Wed-Sat 09:00-19:30, closed Sun-Tue. On this trip only Jan 1 (Fri) and Jan 2 (Sat) work.
- Potong and Nusara: the research pass reports Sunday service; not re-verified.
- K. Panich: the research pass reports a Sunday closure; not re-verified.
- Gia: Tue-Sat service per the research pass. Jan 6 or Jan 8 is safer than the Jan 5 arrival evening.
- Blue Elephant: suggested for Dec 30 (Dec 29 is landing day, Dec 31 is NYE).
- Go Benz (Michelin Bib, via Thai Holiday Guide): Tue-Sun 17:00-01:30, closed Mondays.
- PRU (via Thai Holiday Guide): dinner Tue-Sat; lunch Fri-Sat.

## Dropped or not recommended

- T&K Seafood (Yaowarat): no verified independent recommendations; mixed reviews.
- French Grill (Hanoi): 2026 status and operation not verified.
- Kra Jok See (Phuket): late-night; a third-party guide lists it closed Sun-Tue. Not planned.
- Raya (Phuket Old Town): still open per Phuket101 (Sep 2026); no current Michelin or Bib status. Optional.
- Old Hanoi: prices come from a 2022 source.
- Ta Hiên bia hơi street: nightlife rather than a food stop.
- Bún Chả Đắc Kim: Selected in 2025; not on the 2026 Bib list.
- Thipsamai: kept as an optional famous stop; value is debated.

## Not verified

- Prices for most mid-range and street-food stops.
- January 2027 holiday hours and New Year menus for every venue.
- Addresses for Potong, Nusara, Kalim Rim Lay, Thipsamai and most Bangkok Bib shops. Their map pins will be approximate.
- ONVIT (Hanoi, 1 star): address, hours and price not researched.
- Bun Cha Ta: on the 2026 Bib list; hours not checked.
- Phuket: the Michelin Phuket directory text showed no Patong entries, so the Patong picks come from guides only.
- Blue Elephant price: an estimate from indexed set-menu prices.
- Price conversions use about 35 THB per USD and about 25,000 VND per USD. Exchange rates move.

## Sources

Michelin (official):
- https://guide.michelin.com/th/en/article/michelin-guide-ceremony/full-list-michelin-stars-michelin-guide-thailand-2027
- https://guide.michelin.com/th/en/article/michelin-guide-ceremony/bib-gourmand-thailand-2027
- https://guide.michelin.com/th/en/phuket-region/phuket/restaurants
- https://guide.michelin.com/th/en/bangkok-region/bangkok/restaurant/le-du
- https://guide.michelin.com/th/en/bangkok-region/bangkok/restaurant/jay-fai
- https://guide.michelin.com/en/vn/ha-noi/restaurants/1-star-michelin
- https://guide.michelin.com/en/vn/ha-noi/restaurants/bib-gourmand

Other:
- https://www.thaiholidayguide.com/michelin-restaurants-thailand/ (Nov 2026; cites Michelin hours and prices)
- https://www.ledubkk.com/reservation (Le Du prices)
- https://www.timeout.com/bangkok/restaurants/the-50-best-restaurants-in-bangkok
- https://www.timeout.com/bangkok/restaurants/bangkok-best-thai-restaurants
- https://www.seriouseats.com/travel-guide-bangkok-8737088
- https://www.bbc.com/travel/article/20240924-a-celebrity-chefs-guide-to-bangkoks-best-pad-thai
- https://www.phuket101.net/best-restaurants-in-patong-beach/
- https://www.phuket101.net/savoey-seafood/
- https://exit45travels.com/best-thai-food-in-patong/
- https://www.thethailandguides.com/islands/phuket/food-guide/
- https://www.cleverthai.com/best-restaurants-in-phuket/
- https://www.timeout.com/hanoi/restaurants/best-restaurants-hanoi
- https://www.lonelyplanet.com/articles/best-street-food-hanoi-vietnam
- https://saigonhomestay.com/best-restaurants-in-hanoi-old-quarter/
- https://vietnamnet.vn/en/top-hanoi-eateries-to-explore-the-capital-s-best-dishes-2397551.html

## Google My Maps import

Google My Maps is the closest route to a bulk-importable list. Saved Google Maps lists have no import path that I could find.

1. On a computer, open mymaps.google.com and create a new map.
2. In the layer panel, click Add layer, then Import, and upload `docs/research/restaurants-my-maps.csv`.
3. Choose Address as the location column and Name as the title, then click Finish.
4. Style the layer by the Tier column.
5. Check each pin. Pins for places without a sourced address are approximate; drag them to the right spot.
