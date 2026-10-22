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
    "phuket-stay",
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
  assert.match(overview, /All three Phuket nights stay at one property/);
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

  const decisions = render("decisions");
  assert.match(decisions, /What should we decide/);
  assert.doesNotMatch(decisions, /<button\b|Copy my picks/);

  const essentials = render("essentials");
  for (const section of ["Trip map", "Budget range", "Booking checklist", "Culture cheat sheet", "Packing and practicals"]) {
    assert.ok(essentials.includes(section), `essentials page is missing: ${section}`);
  }
});
