const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

global.window = {};
require("../data/trip.js");
const trip = global.window.TRIP;

test("trip metadata and itinerary cover the approved dates and group", () => {
  assert.equal(trip.meta.travelers, 5);
  assert.equal(trip.days.length, 12);
  assert.equal(trip.days[0].date, "2026-12-29");
  assert.equal(trip.days.at(-1).date, "2027-01-09");
  const expectedDates = Array.from({ length: 12 }, (_, index) => {
    const date = new Date("2026-12-29T12:00:00");
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
  assert.deepEqual(trip.days.map((day) => day.date), expectedDates);
});

test("Bangkok runs through Jan 5 and Hanoi runs Jan 5–9", () => {
  const nightsByCity = Object.fromEntries(trip.legs.map((leg) => [leg.id, leg.nights]));

  assert.deepEqual(nightsByCity, { phuket: 3, bangkok: 4, hanoi: 4 });
  assert.equal(trip.legs.reduce((total, leg) => total + leg.nights, 0), 11);
  assert.equal(trip.days.find((day) => day.date === "2027-01-04").legId, "bangkok");
  assert.equal(trip.days.find((day) => day.date === "2027-01-05").legId, "hanoi");
  assert.equal(trip.days.find((day) => day.date === "2027-01-06").subStopId, "ninh-binh");
  assert.equal(trip.days.find((day) => day.date === "2027-01-07").subStopId, "lan-ha");
});

test("confirmed Bangkok and Hanoi flights appear on their travel days", () => {
  const flightCopy = ["2027-01-01", "2027-01-05"]
    .map((date) => trip.days.find((day) => day.date === date).items.map((item) => `${item.title} ${item.desc}`).join(" "))
    .join(" ");

  for (const detail of ["FD4113", "16:25", "18:10", "VJ902", "15:05", "Suvarnabhumi", "17:00", "HAN"]) {
    assert.ok(flightCopy.includes(detail), `missing confirmed flight detail: ${detail}`);
  }
});

test("official itinerary distinguishes selected facts from outstanding arrangements", () => {
  const itinerary = trip.itinerary;
  assert.equal(itinerary.locked[0].date, trip.meta.startDate);
  assert.equal(itinerary.locked[0].endDate, trip.meta.endDate);
  assert.deepEqual(itinerary.locked.map((item) => item.status), ["locked", "selected", "booked", "locked", "locked"]);
  const phuketProperty = itinerary.locked.find((item) => item.status === "selected");
  assert.equal(phuketProperty.date, "2026-12-29");
  assert.equal(phuketProperty.endDate, "2027-01-01");
  assert.match(phuketProperty.title, /Patong/);
  assert.match(phuketProperty.detail, /300 m to Bangla Road/);
  assert.match(phuketProperty.detail, /500 m to the beach/);
  assert.match(phuketProperty.url, /^https:\/\/www\.airbnb\.com\/rooms\/1275269225698798502$/);
  assert.match(phuketProperty.detail, /does not establish payment or reservation confirmation/);
  assert.doesNotMatch(phuketProperty.detail, /reservation is paid or confirmed/i);

  const bangkokProperty = itinerary.locked.find((item) => item.status === "booked");
  assert.equal(bangkokProperty.date, "2027-01-01");
  assert.equal(bangkokProperty.endDate, "2027-01-05");
  assert.match(bangkokProperty.detail, /four nights/);
  assert.match(bangkokProperty.detail, /300 m to BTS Phrom Phong and EmQuartier/);
  assert.match(bangkokProperty.url, /^https:\/\/www\.airbnb\.com\/rooms\/1162299685456991785$/);
  assert.doesNotMatch(bangkokProperty.url, /[?#]|source_impression_id/i);
  assert.doesNotMatch(`${bangkokProperty.title} ${bangkokProperty.detail} ${bangkokProperty.url}`, /source_impression_id|booking\s+(?:confirmation\s+)?(?:id|number|code|reference)|confirmation\s+(?:id|number|code|reference)/i);
  assert.match(bangkokProperty.detail, /price and bed setup were not provided/i);

  const expectedBookingDates = [
    "2026-12-29", "2026-12-30", "2026-12-31", "2027-01-01", "2027-01-04",
    "2027-01-05", "2027-01-06", "2027-01-07", "2027-01-09",
  ];
  assert.deepEqual(itinerary.bookings.map((item) => item.date), expectedBookingDates);
  assert.ok(itinerary.bookings.every((item) => item.status === "to-arrange"));
  const bookingCopy = itinerary.bookings.map((item) => `${item.title} ${item.detail}`).join(" ");
  for (const detail of ["bag drop", "boat day", "NYE", "Bangkok arrival transfer", "airport", "city day or day trip", "Jan 7 room", "Ninh Binh vehicle and guide", "2D/1N cruise", "cabin layout", "HAN"]) {
    assert.ok(bookingCopy.includes(detail), `missing booking placeholder: ${detail}`);
  }
  assert.equal(trip.options.some((option) => option.id === "phuket-stay"), false);
  assert.ok(trip.options.some((option) => option.id === "nye"));
  assert.ok(trip.options.some((option) => option.id === "bangkok-day"));
  assert.ok(trip.checklist.some((item) => item.id === "bangkok-transfer" && /arrival transfer/i.test(item.item)));
  assert.ok(!trip.checklist.some((item) => /Bangkok hotel/i.test(item.item)), "checklist should not ask the group to book a Bangkok hotel");

  const phuketBase = trip.legs.find((leg) => leg.id === "phuket").stay;
  assert.match(phuketBase.area, /Patong/);
  assert.equal(phuketBase.selected.url, phuketProperty.url);
  const bangkokBase = trip.legs.find((leg) => leg.id === "bangkok").stay;
  assert.equal(bangkokBase.selected.status, "booked");
  assert.equal(bangkokBase.selected.url, bangkokProperty.url);
  assert.equal(bangkokBase.selected.dateRange, "Jan 1–5, 2027 · 4 nights");
  assert.deepEqual(bangkokBase.options, []);
  assert.match(bangkokBase.why, /listing title claims 300 m to BTS Phrom Phong and EmQuartier/);
  assert.doesNotMatch(bangkokBase.selected.url, /[?#]|source_impression_id/i);
});

test("all itinerary place references resolve", () => {
  const placeIds = new Set(trip.places.map((place) => place.id));
  const missing = trip.days.flatMap((day) =>
    day.items
      .filter((item) => item.placeId && !placeIds.has(item.placeId))
      .map((item) => `${day.date}: ${item.placeId}`),
  );

  assert.deepEqual(missing, []);
});

test("decision options cover every requested group choice", () => {
  const optionIds = new Set(trip.options.map((option) => option.id));
  for (const id of [
    "nye",
    "phuket-day",
    "bangkok-day",
    "bangkok-dinner",
    "vietnam-order",
    "ninh-binh-stay",
    "lan-ha-cruise",
    "sapa",
  ]) {
    assert.ok(optionIds.has(id), `missing decision option: ${id}`);
  }
  assert.ok(trip.options.every((option) => ["phuket", "bangkok", "hanoi"].includes(option.stopId)));
});

test("the site has three stop tabs and keeps Ninh Binh and Lan Ha under Hanoi", () => {
  assert.deepEqual(trip.stops.map((stop) => stop.id), ["phuket", "bangkok", "hanoi"]);
  assert.deepEqual(trip.stops.find((stop) => stop.id === "hanoi").subStops.map((stop) => stop.id), ["ninh-binh", "lan-ha"]);
});

test("Phuket is one base for three nights with no overnight-away option", () => {
  const phuket = trip.legs.find((leg) => leg.id === "phuket");
  assert.equal(phuket.nights, 3);
  assert.equal(phuket.stay.samePropertyAllNights, true);
  assert.ok(!trip.options.some((option) => option.id === "phuket-overnight"));
});

test("Hanoi stay recommendation prioritizes a walkable lake-edge base and quieter room", () => {
  const stay = trip.legs.find((leg) => leg.id === "hanoi").stay;
  assert.match(stay.recommendation, /Hoan Kiem lake edge/);
  assert.match(stay.area, /Hang Trong/);
  assert.match(stay.why, /quiet room/i);
  assert.match(stay.why, /Ta Hien/);
  assert.ok(trip.sources.some((source) => source.url === "https://www.roughguides.com/articles/where-to-stay-in-hanoi/"));
});

test("trip data contains no photo assets", () => {
  assert.equal("photos" in trip, false);
});

test("budget totals match the category rows", () => {
  const low = trip.budget.rows.reduce((sum, row) => sum + row.low, 0);
  const high = trip.budget.rows.reduce((sum, row) => sum + row.high, 0);
  assert.deepEqual(trip.budget.total, [low, high]);
});

test("the TDAC is the last item in the deadline-ordered booking list", () => {
  assert.equal(trip.checklist.at(-1).id, "tdac");
});

test("overview, stop tabs, decisions, and essentials render from shared trip data", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "../assets/js/app.js"), "utf8");

  function renderPage(page, hash = "") {
    const elements = new Map();
    const getElement = (selector) => {
      if (!elements.has(selector)) {
        const listeners = {};
        elements.set(selector, {
          listeners,
          dataset: {},
          classList: { toggle() {} },
          addEventListener(type, handler) { listeners[type] = handler; },
          setAttribute() {},
          scrollIntoView() {},
          focus() {},
          select() {},
          append() {},
        });
      }
      return elements.get(selector);
    };
    const document = {
      body: { dataset: { page } },
      querySelector: getElement,
      querySelectorAll: () => [],
      getElementById: getElement,
      createElement: () => getElement(`created-${elements.size}`),
    };
    const window = { TRIP: trip, location: { href: "file:///trip/index.html", hash, search: "" }, addEventListener() {} };
    vm.runInNewContext(appSource, { window, document, URL, URLSearchParams, Intl, Date, Map, console, navigator: {} });
    const html = page === "stops"
      ? `${elements.get("#main").innerHTML}${elements.get("#stop-content").innerHTML}`
      : elements.get("#main").innerHTML;
    return { html, elements };
  }

  const render = (page) => renderPage(page).html;

  const overview = render("overview");
  assert.match(overview, /Day by day, at a glance/);
  assert.match(overview, /selected property is the same for all three nights/);
  assert.doesNotMatch(overview, /<img\b/);

  const stops = render("stops");
  for (const stop of ["Phuket", "Bangkok", "Hanoi", "Ninh Binh", "Lan Ha Bay"]) {
    assert.ok(stops.includes(stop), `stops page is missing: ${stop}`);
  }
  assert.match(stops, /Overview/);
  assert.match(stops, /Details/);
  assert.doesNotMatch(stops, /<img\b/);

  const hanoiPage = renderPage("stops", "#hanoi");
  hanoiPage.elements.get("#main").listeners.click({
    target: { closest: (selector) => selector === "[data-stop-view]" ? { dataset: { stopView: "details" } } : null },
  });
  const hanoiDetails = hanoiPage.elements.get("#stop-content").innerHTML;
  assert.match(hanoiDetails, /Ninh Binh/);
  assert.match(hanoiDetails, /Lan Ha Bay/);
  assert.match(hanoiDetails, /Do Ninh Binh as a day trip or overnight/);
  assert.match(hanoiDetails, /Which Lan Ha Bay cruise should we book/);
  assert.match(hanoiDetails, /Hang Trong/);
  assert.match(hanoiDetails, /St Joseph&#39;s Cathedral/);
  assert.match(hanoiDetails, /quiet room/i);

  const phuketPage = renderPage("stops", "#phuket");
  phuketPage.elements.get("#main").listeners.click({
    target: { closest: (selector) => selector === "[data-stop-view]" ? { dataset: { stopView: "details" } } : null },
  });
  const phuketDetails = phuketPage.elements.get("#stop-content").innerHTML;
  assert.match(phuketDetails, /CozyStay 3BR CenterPatong/);
  assert.match(phuketDetails, /Patong/);
  assert.match(phuketDetails, /Open selected Airbnb listing/);
  assert.match(phuketDetails, /class="tag tag-selected">Selected/);
  assert.doesNotMatch(phuketDetails, /Kamala base|pool villa/i);

  const bangkokPage = renderPage("stops", "#bangkok");
  bangkokPage.elements.get("#main").listeners.click({
    target: { closest: (selector) => selector === "[data-stop-view]" ? { dataset: { stopView: "details" } } : null },
  });
  const bangkokDetails = bangkokPage.elements.get("#stop-content").innerHTML;
  assert.match(bangkokDetails, /class="tag tag-booked">Booked/);
  assert.match(bangkokDetails, /Jan 1–5, 2027 · 4 nights/);
  assert.match(bangkokDetails, /Open Airbnb listing/);
  assert.doesNotMatch(bangkokDetails, /Mandarin Oriental|Rosewood Bangkok|The Sukhothai/);

  const decisions = render("decisions");
  assert.match(decisions, /What should we decide/);
  assert.match(decisions, /selected and appears on the Itinerary page/);
  assert.doesNotMatch(decisions, /Where should we stay in Phuket/);
  assert.doesNotMatch(decisions, /<button\b|Copy my picks/);

  const itineraryPage = renderPage("itinerary");
  assert.match(itineraryPage.html, /Official itinerary/);
  assert.match(itineraryPage.html, /Locked in, booked, and selected/);
  assert.match(itineraryPage.html, /Dated booking and planning placeholders/);
  assert.match(itineraryPage.html, /FD4113 · Phuket → Bangkok/);
  assert.match(itineraryPage.html, /VJ902 · Bangkok Suvarnabhumi \(BKK\) → Hanoi \(HAN\)/);
  assert.match(itineraryPage.html, /Open selected Airbnb listing/);
  assert.match(itineraryPage.html, /class="tag tag-selected">Selected/);
  assert.match(itineraryPage.html, /class="tag tag-booked">Booked/);
  assert.match(itineraryPage.html, /class="tag tag-locked">Locked in/);
  assert.match(itineraryPage.html, /class="tag tag-verify">To arrange/);
  assert.match(itineraryPage.html, /does not establish payment or reservation confirmation/);
  assert.match(itineraryPage.html, /Bangkok arrival transfer to the booked Airbnb/);
  assert.doesNotMatch(itineraryPage.html, /Bangkok lodging for five|source_impression_id|booking\s+(?:confirmation\s+)?(?:id|number|code|reference)|confirmation\s+(?:id|number|code|reference)/i);
  assert.match(itineraryPage.html, /Full day-by-day planning details/);
  assert.match(itineraryPage.html, /Booking checklist/);
  assert.match(itineraryPage.elements.get("#site-header").innerHTML, /Itinerary/);
  assert.match(itineraryPage.html, /Hanoi airport transfer/);
  assert.doesNotMatch(itineraryPage.html, /Where should we stay in Phuket/);

  const essentials = render("essentials");
  for (const section of ["Trip map", "Budget range", "Booking checklist", "Culture cheat sheet", "Packing and practicals"]) {
    assert.ok(essentials.includes(section), `essentials page is missing: ${section}`);
  }
});
