(function () {
  "use strict";

  const trip = window.TRIP;
  const main = document.querySelector("#main");
  const currentPage = document.body.dataset.page;
  let activeStopId = trip?.stops?.[0]?.id || "phuket";
  const stopViews = Object.fromEntries((trip?.stops || []).map((stop) => [stop.id, "overview"]));
  let tripMap = null;
  let memoryChecklist = {};
  const placeMarkers = new Map();

  if (!trip || !main) {
    if (main) main.innerHTML = '<p class="notice" role="alert">The trip plan could not be loaded. Reload this page or check that data/trip.js is available.</p>';
    return;
  }

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);

  const safeExternalUrl = (value) => {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, window.location.href);
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  };

  const formatMoney = (range, currency = trip.meta.currency) => {
    if (!Array.isArray(range)) return "Cost varies";
    const [low, high] = range;
    const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
    return `~$${fmt.format(low)}–$${fmt.format(high)} ${currency} pp`;
  };

  const dateLabel = (date) => new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  function renderShell() {
    const header = document.querySelector("#site-header");
    const footer = document.querySelector("#site-footer");
    const links = [
      ["overview", "index.html", "Overview"],
      ["stops", "details.html", "Stops"],
      ["decisions", "decisions.html", "Decisions"],
      ["essentials", "essentials.html", "Essentials"],
    ];

    if (header) {
      header.innerHTML = `
        <header class="site-header">
          <div class="header-inner">
            <a class="brand" href="index.html" aria-label="Thailand and Vietnam trip overview">
              <span class="brand-mark" aria-hidden="true">TV</span>
              <span>Thailand + Vietnam</span>
            </a>
            <nav class="site-nav" aria-label="Main navigation">
              ${links.map(([page, href, label]) => `<a href="${href}" ${currentPage === page ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
            </nav>
          </div>
        </header>`;
    }
    if (footer) {
      footer.innerHTML = `
        <footer class="site-footer">
          <div class="site-footer-inner">
            <span>Updated ${escapeHtml(trip.meta.updated)} · Prices are estimates; verify before booking.</span>
            <span>This is a public planning site. Checklist marks are local to this browser.</span>
          </div>
        </footer>`;
    }
  }

  function renderHero({ overview = false, label = "" } = {}) {
    const route = trip.route.map((stop, index) =>
      `${index ? '<span class="route-arrow" aria-hidden="true">→</span>' : ""}<span class="route-stop">${escapeHtml(stop)}</span>`,
    ).join("");
    return `
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-content">
          <p class="eyebrow">Five travelers · December 2026 / January 2027${label ? ` · ${escapeHtml(label)}` : ""}</p>
          <h1 id="page-title">${escapeHtml(trip.meta.title)}</h1>
          <p class="lede">${escapeHtml(overview ? trip.meta.subtitle : label || "Trip planning, choices, and practical details")}</p>
          <div class="hero-meta"><span>Dec 29, 2026 – Jan 9, 2027</span><span>12 days · 11 nights</span><span>Flights excluded</span></div>
          <div class="route-strip" aria-label="Route">${route}</div>
          ${overview ? '<p id="countdown" class="countdown" aria-live="polite"></p>' : ""}
        </div>
      </section>`;
  }

  function renderCountdown() {
    const target = document.querySelector("#countdown");
    if (!target) return;
    const departure = new Date(`${trip.meta.departureDate}T00:00:00`);
    const now = new Date();
    const days = Math.ceil((departure - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86_400_000);
    target.textContent = days > 0 ? `${days} days until departure` : "The trip is underway";
  }

  function renderLegCards() {
    return trip.legs.map((leg) => `
      <article class="card leg-card leg-${escapeHtml(leg.id)}">
        <div class="leg-card-body">
          <div class="card-topline"><span class="card-label">${escapeHtml(leg.country)}</span><span class="tag">${escapeHtml(String(leg.nights))} nights</span></div>
          <h3>${escapeHtml(leg.city)} ${escapeHtml(leg.flag)}</h3>
          <p class="leg-dates">${escapeHtml(leg.dateRange)}</p>
          <p>${escapeHtml(leg.summary)}</p>
          <p class="small"><strong>Base:</strong> ${escapeHtml(leg.stay.area)} · ${escapeHtml(leg.stay.recommendation)}</p>
          <a class="inline-link small" href="details.html#${escapeHtml(leg.id)}">Open ${escapeHtml(leg.city)} stop <span aria-hidden="true">→</span></a>
        </div>
      </article>`).join("");
  }

  function renderQuickDays() {
    return trip.days.map((day) => {
      const leg = trip.legs.find((item) => item.id === day.legId);
      return `
        <div class="quick-day">
          <span class="quick-date">${escapeHtml(day.weekday)}<br>${escapeHtml(dateLabel(day.date))}</span>
          <span class="quick-day-title">${escapeHtml(day.title)}<span class="quick-day-city"> · ${escapeHtml(leg?.city || "")}</span></span>
          <span class="small muted">${escapeHtml(formatMoney(day.costPP))}</span>
        </div>`;
    }).join("");
  }

  function renderDecisionPreview() {
    const previewIds = ["phuket-stay", "nye", "phuket-day", "bangkok-day"];
    return previewIds.map((id) => {
      const option = trip.options.find((item) => item.id === id);
      return `<div class="decision-preview"><h3>${escapeHtml(option.question)}</h3><p>${escapeHtml(option.choices.map((choice) => choice.name).join(" · "))}</p></div>`;
    }).join("");
  }

  function renderOverview() {
    const critical = trip.checklist.filter((item) => item.priority === "critical").slice(0, 3);
    main.innerHTML = `
      ${renderHero({ overview: true })}
      <section class="section" aria-labelledby="at-a-glance-title">
        <div class="section-heading">
          <div><p class="section-kicker">At a glance</p><h2 id="at-a-glance-title">Three bases, one memorable first trip</h2></div>
          <p>${escapeHtml(trip.quickSummary)}</p>
        </div>
        <div class="grid grid-3">${renderLegCards()}</div>
      </section>
      <section class="section grid grid-2" aria-label="Budget and decisions">
        <article class="panel">
          <p class="section-kicker">Budget range · flights excluded</p>
          <h2>$${trip.budget.total[0].toLocaleString("en-US")}–$${trip.budget.total[1].toLocaleString("en-US")} pp</h2>
          <p class="muted">The spread is driven mostly by Phuket NYE lodging and whether the group chooses private boats, premium cabins, and a tasting menu.</p>
          <a class="inline-link" href="essentials.html#budget">See budget assumptions <span aria-hidden="true">→</span></a>
        </article>
        <article class="panel">
          <p class="section-kicker">Your group decides</p><h2>Open decisions</h2>
          ${renderDecisionPreview()}
          <a class="inline-link" href="decisions.html">See every choice, grouped by stop <span aria-hidden="true">→</span></a>
        </article>
      </section>
      <section class="section" aria-labelledby="schedule-title">
        <div class="section-heading">
          <div><p class="section-kicker">Quick itinerary</p><h2 id="schedule-title">Day by day, at a glance</h2></div>
          <p>Open the stop pages for an overview or the detailed schedule, meals, and chill alternatives.</p>
        </div>
        <div class="panel">${renderQuickDays()}</div>
      </section>
      <section class="section grid grid-2" aria-label="Next steps">
        <article class="panel"><p class="section-kicker">Book first</p><h2>Protect the scarce bookings</h2><ul class="link-list">${critical.map((item) => `<li><strong>${escapeHtml(item.item)}</strong><br><span class="muted small">${escapeHtml(item.bookBy)} · ${escapeHtml(item.why)}</span></li>`).join("")}</ul></article>
        <article class="panel"><p class="section-kicker">A note for the group</p><h2>Recommendations are starting points</h2><p class="muted">All trip choices remain open. The Decisions page is a discussion guide only; nothing is selected or submitted on the site.</p><div class="button-row"><a class="button" href="details.html">Browse the three stops</a><a class="button button-secondary" href="decisions.html">Review decisions</a></div></article>
      </section>`;
    renderCountdown();
  }

  function renderStopHighlights(stop) {
    return `<ul class="highlight-list">${stop.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function renderStopOverview(stop, days) {
    const decisions = trip.options.filter((option) => option.stopId === stop.id);
    return `
      <section class="stop-overview" aria-labelledby="stop-overview-heading">
        <div class="stop-intro panel"><p class="section-kicker">${escapeHtml(stop.dateRange)}</p><h3 id="stop-overview-heading">${escapeHtml(stop.name)}</h3><p>${escapeHtml(stop.overview)}</p>${renderStopHighlights(stop)}</div>
        <div class="grid grid-2 stop-overview-lower">
          <article class="panel"><h3>What happens here</h3>${renderQuickDayRows(days)}</article>
          <article class="panel"><h3>Decisions for this stop</h3>${decisions.length ? `<ul class="practical-list">${decisions.map((option) => `<li>${escapeHtml(option.question)}</li>`).join("")}</ul>` : '<p class="muted">No group decisions are listed for this stop.</p>'}<a class="inline-link" href="decisions.html#decision-${escapeHtml(stop.id)}">Review the options <span aria-hidden="true">→</span></a></article>
        </div>
      </section>`;
  }

  function renderQuickDayRows(days) {
    return days.map((day) => `<div class="quick-day"><span class="quick-date">${escapeHtml(day.weekday)}<br>${escapeHtml(dateLabel(day.date))}</span><span class="quick-day-title">${escapeHtml(day.title)}<span class="quick-day-city"> · ${escapeHtml(day.summary)}</span></span><span class="small muted">${escapeHtml(formatMoney(day.costPP))}</span></div>`).join("");
  }

  function renderStopDayCards(days, filterId) {
    if (!days.length) return '<p class="muted">No scheduled day on this subsection.</p>';
    const tags = ["all", "food", "culture", "temple", "adventure", "nightlife", "chill", "nature", "transport"];
    return `
      <div class="filter-row" role="group" aria-label="Filter ${escapeHtml(filterId)} details by interest">${tags.map((tag) => `<button class="chip" type="button" data-stop-tag-filter="${tag}" data-filter-scope="${escapeHtml(filterId)}" aria-pressed="${tag === "all"}">${tag === "all" ? "All" : escapeHtml(tag)}</button>`).join("")}</div>
      ${days.map((day) => `
        <details class="day-card" data-day-date="${escapeHtml(day.date)}" data-filter-scope="${escapeHtml(filterId)}">
          <summary class="day-summary"><span class="day-date">${escapeHtml(day.weekday)}<br>${escapeHtml(dateLabel(day.date))}</span><span><strong class="day-title">${escapeHtml(day.title)}</strong><span class="day-summary-copy">${escapeHtml(day.summary)}</span></span><span class="day-cost">${escapeHtml(formatMoney(day.costPP))}</span></summary>
          <div class="day-content">
            ${day.items.map((item) => `
              <article class="timeline-item" data-tags="${escapeHtml(item.tags.join(" "))}" data-filter-scope="${escapeHtml(filterId)}">
                <span class="timeline-time">${escapeHtml(item.time)}</span>
                <div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.desc)}</p><div class="timeline-meta">${item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}<span class="tag">${escapeHtml(item.booking)}</span>${item.costPP ? `<span class="tag">${escapeHtml(formatMoney(item.costPP))}</span>` : ""}${item.placeId ? `<a class="text-button" href="essentials.html?place=${encodeURIComponent(item.placeId)}#map">Show on map</a>` : ""}</div></div>
              </article>`).join("")}
            <p class="day-alt"><strong>Chill alternative:</strong> ${escapeHtml(day.alt)}</p>
          </div>
        </details>`).join("")}`;
  }

  function renderStayOptions(leg) {
    if (!leg) return "";
    return `<section class="stop-section"><p class="section-kicker">Where to stay</p><h3>${escapeHtml(leg.stay.recommendation)}</h3><p>${escapeHtml(leg.stay.why)}</p>${leg.id === "phuket" ? '<p class="notice">All three Phuket nights are at one property. Overnight excursions away from Phuket are removed.</p>' : ""}<div class="grid grid-3">${leg.stay.options.map((option) => `<article class="card"><div class="card-topline"><span class="card-label">${escapeHtml(option.type)}</span><span class="tag">${escapeHtml(option.area)}</span></div><h4>${escapeHtml(option.name)}</h4><p><strong>${escapeHtml(option.pricePerNight)}</strong><br><span class="small muted">${escapeHtml(option.perPerson)}</span></p><p class="small"><strong>Pros:</strong> ${escapeHtml(option.pros.join("; "))}</p><p class="small"><strong>Trade-offs:</strong> ${escapeHtml(option.cons.join("; "))}</p>${renderExternalLink(option.url, "Property site")}</article>`).join("")}</div></section>`;
  }

  function renderDecisionNotes(stop) {
    const subStopOptionIds = new Set((stop.subStops || []).flatMap((subStop) => subStop.optionIds || []));
    const options = trip.options.filter((option) => option.stopId === stop.id && !subStopOptionIds.has(option.id));
    if (!options.length) return "";
    return `<section class="stop-section decision-note"><p class="section-kicker">Group input needed</p><h3>Questions to decide</h3><ul class="practical-list">${options.map((option) => `<li>${escapeHtml(option.question)}</li>`).join("")}</ul><a class="inline-link" href="decisions.html#decision-${escapeHtml(stop.id)}">See the choices on the Decisions page <span aria-hidden="true">→</span></a></section>`;
  }

  function renderDecisionNotesForIds(ids) {
    const options = trip.options.filter((option) => ids.includes(option.id));
    if (!options.length) return "";
    return `<div class="decision-note"><h4>Group input needed</h4><ul class="practical-list">${options.map((option) => `<li>${escapeHtml(option.question)}</li>`).join("")}</ul><a class="inline-link small" href="decisions.html#decision-hanoi">See the choices on the Decisions page <span aria-hidden="true">→</span></a></div>`;
  }

  function renderStopDetails(stop, days) {
    const mainDays = days.filter((day) => !day.subStopId);
    const subStops = stop.subStops || [];
    const leg = trip.legs.find((item) => item.id === stop.legId);
    return `
      <section class="stop-detail" aria-label="Detailed ${escapeHtml(stop.name)} plan">
        ${renderStopDayCards(mainDays, stop.id)}
        ${subStops.map((subStop) => {
          const subDays = days.filter((day) => day.subStopId === subStop.id);
          return `<section class="sub-stop panel" id="substop-${escapeHtml(subStop.id)}"><p class="section-kicker">${escapeHtml(subStop.dateRange)}</p><h3>${escapeHtml(subStop.name)}</h3><p>${escapeHtml(subStop.overview)}</p>${renderStopDayCards(subDays, subStop.id)}<h4>Helpful notes</h4><ul class="practical-list">${subStop.details.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>${renderDecisionNotesForIds(subStop.optionIds || [])}</section>`;
        }).join("")}
        ${renderStayOptions(leg)}
        ${stop.sections.map((section) => `<section class="stop-section"><h3>${escapeHtml(section.title)}</h3><p>${escapeHtml(section.body)}</p></section>`).join("")}
        ${renderDecisionNotes(stop)}
      </section>`;
  }

  function renderActiveStop() {
    const stop = trip.stops.find((item) => item.id === activeStopId) || trip.stops[0];
    activeStopId = stop.id;
    const days = trip.days.filter((day) => day.stopId === stop.id);
    const view = stopViews[stop.id] || "overview";
    const tabs = document.querySelectorAll("[data-stop-tab]");
    tabs.forEach((tab) => {
      const selected = tab.dataset.stopTab === stop.id;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const content = document.querySelector("#stop-content");
    if (!content) return;
    content.setAttribute("aria-labelledby", `stop-tab-${stop.id}`);
    content.innerHTML = `
      <div class="stop-page-head"><div><p class="section-kicker">${escapeHtml(stop.dateRange)}</p><h2>${escapeHtml(stop.name)}</h2></div>
        <div class="stop-view-toggle" role="group" aria-label="${escapeHtml(stop.name)} page view"><button class="chip" type="button" data-stop-view="overview" aria-pressed="${view === "overview"}">Overview</button><button class="chip" type="button" data-stop-view="details" aria-pressed="${view === "details"}">Details</button></div>
      </div>
      ${view === "overview" ? renderStopOverview(stop, days) : renderStopDetails(stop, days)}`;
  }

  function selectStop(stopId, updateHash = true) {
    if (!trip.stops.some((stop) => stop.id === stopId)) return;
    activeStopId = stopId;
    if (updateHash && window.location.hash !== `#${stopId}`) window.location.hash = stopId;
    renderActiveStop();
  }

  function renderStops() {
    const hashId = (window.location.hash || "").slice(1);
    if (trip.stops.some((stop) => stop.id === hashId)) activeStopId = hashId;
    main.innerHTML = `
      ${renderHero({ label: "Stop pages" })}
      <section class="section" aria-labelledby="stop-pages-title">
        <div class="section-heading"><div><p class="section-kicker">Choose a stop</p><h2 id="stop-pages-title">One stop at a time</h2></div><p>Each stop has its own Overview / Details switch. Ninh Binh and Lan Ha Bay are sections inside the Hanoi stop.</p></div>
        <div class="stop-tabs" role="tablist" aria-label="Trip stops">${trip.stops.map((stop) => `<button class="stop-tab" type="button" role="tab" id="stop-tab-${escapeHtml(stop.id)}" aria-controls="stop-content" aria-selected="${stop.id === activeStopId}" tabindex="${stop.id === activeStopId ? 0 : -1}" data-stop-tab="${escapeHtml(stop.id)}">${escapeHtml(stop.name)}<span>${escapeHtml(stop.dateRange.split("·")[0].trim())}</span></button>`).join("")}</div>
        <div id="stop-content" role="tabpanel" aria-labelledby="stop-tab-${escapeHtml(activeStopId)}"></div>
      </section>`;
    renderCountdown();
    renderActiveStop();
    main.addEventListener("click", handleStopClick);
    main.addEventListener("keydown", handleStopKeydown);
    window.addEventListener?.("hashchange", handleStopHashChange);
  }

  function handleStopClick(event) {
    const tab = event.target.closest("[data-stop-tab]");
    if (tab) {
      selectStop(tab.dataset.stopTab);
      return;
    }
    const viewButton = event.target.closest("[data-stop-view]");
    if (viewButton) {
      stopViews[activeStopId] = viewButton.dataset.stopView;
      renderActiveStop();
      return;
    }
    const filterButton = event.target.closest("[data-stop-tag-filter]");
    if (filterButton) {
      const scope = filterButton.dataset.filterScope;
      const selectedTag = filterButton.dataset.stopTagFilter;
      document.querySelectorAll(`[data-filter-scope="${scope}"][data-stop-tag-filter]`).forEach((button) => {
        button.setAttribute("aria-pressed", String(button === filterButton));
      });
      document.querySelectorAll(`.timeline-item[data-filter-scope="${scope}"]`).forEach((item) => {
        item.hidden = selectedTag !== "all" && !item.dataset.tags.split(" ").includes(selectedTag);
      });
      document.querySelectorAll(`.day-card[data-filter-scope="${scope}"]`).forEach((day) => {
        day.hidden = selectedTag !== "all" && !Array.from(day.querySelectorAll(".timeline-item")).some((item) => !item.hidden);
      });
    }
  }

  function handleStopKeydown(event) {
    const tab = event.target.closest("[data-stop-tab]");
    if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = Array.from(document.querySelectorAll("[data-stop-tab]"));
    const currentIndex = tabs.indexOf(tab);
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? tabs.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    selectStop(tabs[nextIndex].dataset.stopTab);
  }

  function handleStopHashChange() {
    const stopId = (window.location.hash || "").slice(1);
    if (trip.stops.some((stop) => stop.id === stopId) && stopId !== activeStopId) selectStop(stopId, false);
  }

  function renderDecisionChoice(choice) {
    const cost = Array.isArray(choice.costPP) && choice.costPP[0] === 0 && choice.costPP[1] === 0
      ? "No added cost"
      : formatMoney(choice.costPP);
    return `
      <article class="choice-card">
        <div class="card-topline"><h4>${escapeHtml(choice.name)}</h4>${choice.recommended ? '<span class="tag tag-recommended">Current suggestion</span>' : ""}</div>
        <p><span class="choice-cost">${escapeHtml(cost)}</span> · ${escapeHtml(choice.effort)} effort</p>
        <p><strong>Pros:</strong> ${escapeHtml(choice.pros.join("; "))}</p>
        <p><strong>Cons:</strong> ${escapeHtml(choice.cons.join("; "))}</p>
      </article>`;
  }

  function renderDecisionPage() {
    main.innerHTML = `
      ${renderHero({ label: "Group decisions" })}
      <section class="section" aria-labelledby="decisions-title">
        <div class="section-heading"><div><p class="section-kicker">Discuss as a group</p><h2 id="decisions-title">What should we decide?</h2></div><p>These are discussion options only. The site does not collect responses; use the pros, cons, price ranges, and effort notes to decide together.</p></div>
        <div class="stop-tabs decision-tabs" role="navigation" aria-label="Decision topics by stop">${trip.stops.map((stop) => `<a class="stop-tab" href="#decision-${escapeHtml(stop.id)}">${escapeHtml(stop.name)}<span>${escapeHtml(stop.dateRange.split("·")[0].trim())}</span></a>`).join("")}</div>
        ${trip.stops.map((stop) => {
          const options = trip.options.filter((option) => option.stopId === stop.id);
          return `<section class="decision-stop leg-${escapeHtml(stop.legId)}" id="decision-${escapeHtml(stop.id)}"><div class="section-heading"><div><p class="section-kicker">${escapeHtml(stop.dateRange)}</p><h3>${escapeHtml(stop.name)}</h3></div><a class="inline-link" href="details.html#${escapeHtml(stop.id)}">Open stop page <span aria-hidden="true">→</span></a></div>${options.map((option) => `<section class="decision-set"><h4>${escapeHtml(option.group)}</h4><p>${escapeHtml(option.question)}</p><div class="choice-grid">${option.choices.map(renderDecisionChoice).join("")}</div></section>`).join("")}</section>`;
        }).join("")}
      </section>`;
  }

  function renderEssentialsPage() {
    main.innerHTML = `
      ${renderHero({ label: "Trip essentials" })}
      <div id="detail-nav"></div>
      <div id="essentials-content">
        <section class="section" id="map" aria-labelledby="map-title"><div class="section-heading"><div><p class="section-kicker">Explore the route</p><h2 id="map-title">Trip map</h2></div><p>Select a place from the text list or follow a map link from a stop detail.</p></div>${renderMapSection()}</section>
        <section class="section" id="budget" aria-labelledby="budget-title"><div class="section-heading"><div><p class="section-kicker">USD per person</p><h2 id="budget-title">Budget range</h2></div><p>Flights excluded. Holiday lodging and optional premium choices drive the range.</p></div>${renderBudget()}</section>
        <section class="section" id="checklist" aria-labelledby="checklist-title"><div class="section-heading"><div><p class="section-kicker">Book early</p><h2 id="checklist-title">Booking checklist</h2></div><p>Items are ordered by urgency; checkboxes are stored only on this device.</p></div><div id="checklist-items">${renderChecklist()}</div></section>
        <section class="section" id="culture" aria-labelledby="culture-title"><div class="section-heading"><div><p class="section-kicker">Quick reference</p><h2 id="culture-title">Culture cheat sheet</h2></div><p>Etiquette reminders, laws, scams, tipping and practical phrases.</p></div><div class="tabs" role="tablist" aria-label="Choose country culture guide"><button class="tab-button" type="button" id="tab-thailand" role="tab" aria-selected="true" aria-controls="culture-panel" data-culture-tab="thailand">Thailand</button><button class="tab-button" type="button" id="tab-vietnam" role="tab" aria-selected="false" aria-controls="culture-panel" data-culture-tab="vietnam">Vietnam</button></div><div id="culture-content">${renderCulture("thailand")}</div></section>
        <section class="section" id="practical" aria-labelledby="practical-title"><div class="section-heading"><div><p class="section-kicker">Before you go</p><h2 id="practical-title">Packing and practicals</h2></div><p>Entry requirements and laws are time-sensitive. Reconfirm them close to departure.</p></div>${renderPracticals()}<div class="grid grid-2 section-subsection">${trip.packing.map((group) => `<article class="panel packing-group"><h3>${escapeHtml(group.group)}</h3><ul class="packing-list">${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>`).join("")}</div></section>
        <section class="section" id="sources" aria-labelledby="sources-title"><div class="section-heading"><div><p class="section-kicker">Research</p><h2 id="sources-title">Sources</h2></div><p>Prices are estimates; confirm current rules, hours, and availability before booking.</p></div>${renderSources()}</section>
      </div>`;
    renderDetailNav();
    bindEssentialsInteractions();
    initializeMap();
    validatePlaceReferences();
    const requestedPlace = new URLSearchParams(window.location.search).get("place");
    if (requestedPlace && trip.places.some((place) => place.id === requestedPlace)) showPlace(requestedPlace);
  }

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      if (!value) return fallback;
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function setStatus(id, message) {
    const status = document.getElementById(id);
    if (status) status.textContent = message;
  }

  function renderDetailNav() {
    const nav = document.querySelector("#detail-nav");
    if (!nav) return;
    const links = [
      ["map", "Map"], ["budget", "Budget"], ["checklist", "Booking list"],
      ["culture", "Culture"], ["practical", "Practicals"], ["sources", "Sources"],
    ];
    nav.innerHTML = `<nav class="detail-nav" aria-label="Trip essentials sections">${links.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}</nav>`;
  }

  function renderMapSection() {
    const categories = ["stay", "food", "sight", "temple", "nightlife", "activity", "transport"];
    return `
      <div class="toolbar">
        <p class="muted small">Markers are grouped by stop and color-coded by type. The places list is the text alternative.</p>
        <label class="small" for="map-leg-filter">Filter by stop
          <select id="map-leg-filter"><option value="all">All stops</option>${trip.legs.map((leg) => `<option value="${escapeHtml(leg.id)}">${escapeHtml(leg.city)}</option>`).join("")}</select>
        </label>
      </div>
      <ul class="map-legend" aria-label="Map marker categories">${categories.map((category) => `<li><span class="legend-dot legend-${category}" aria-hidden="true"></span>${escapeHtml(category)}</li>`).join("")}</ul>
      <div class="map-layout">
        <div id="trip-map" role="region" aria-label="Interactive map of trip places"></div>
        <aside class="map-sidebar" aria-label="Text alternative: trip places"><h3>Places list</h3><ul class="place-list">${renderPlacesList()}</ul></aside>
      </div>
      <p class="small muted">Map tiles © OpenStreetMap contributors. Place pins are approximate area markers where noted.</p>`;
  }

  function renderPlacesList(legId = "all") {
    return trip.places.filter((place) => legId === "all" || place.legId === legId).map((place) => `
      <li><button type="button" data-place-target="${escapeHtml(place.id)}">${escapeHtml(place.name)}<span class="place-category">${escapeHtml(place.category)} · ${escapeHtml(trip.legs.find((leg) => leg.id === place.legId)?.city || "")}</span></button></li>`).join("");
  }

  function renderBudget() {
    const rows = trip.budget.rows.map((row) => `<tr><td>${escapeHtml(row.category)}</td><td>$${Number(row.low).toLocaleString("en-US")}</td><td>$${Number(row.high).toLocaleString("en-US")}</td><td>${escapeHtml(row.note)}</td></tr>`).join("");
    return `
      <div class="budget-table-wrap"><table class="budget-table">
        <caption class="small muted">Planning estimate in USD per person; flights excluded.</caption>
        <thead><tr><th scope="col">Category</th><th scope="col">Low</th><th scope="col">High</th><th scope="col">Assumption</th></tr></thead>
        <tbody>${rows}<tr><td>Total</td><td>$${trip.budget.total[0].toLocaleString("en-US")}</td><td>$${trip.budget.total[1].toLocaleString("en-US")}</td><td>Range depends mainly on NYE lodging, cruise tier, private tours, and dining choices.</td></tr></tbody>
      </table></div>
      <h3>Assumptions</h3><ul class="practical-list">${trip.budget.assumptions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function renderChecklist() {
    const completed = readStorage("trip-checklist-v1", {});
    return `
      <p class="local-only">Checklist marks are saved only on this device/browser. There is no shared backend.</p>
      <ul class="checklist">${trip.checklist.map((item) => {
        const done = completed[item.id] === true;
        const priorityClass = item.priority === "critical" ? "tag-verify" : "";
        const link = safeExternalUrl(item.url);
        return `
          <li class="check-item ${done ? "is-done" : ""}">
            <input type="checkbox" id="check-${escapeHtml(item.id)}" data-check-id="${escapeHtml(item.id)}" ${done ? "checked" : ""}>
            <label for="check-${escapeHtml(item.id)}"><span class="check-title">${escapeHtml(item.item)}</span><span class="check-why">${escapeHtml(item.why)}${link ? ` <a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">Link</a>` : ""}</span></label>
            <span class="check-deadline"><span class="tag ${priorityClass}">${escapeHtml(item.priority)}</span><br>${escapeHtml(item.bookBy)}</span>
          </li>`;
      }).join("")}</ul><p class="status-message" id="checklist-status" role="status" aria-live="polite"></p>`;
  }

  function renderCulture(country) {
    const data = trip.culture[country];
    return `
      <div class="culture-panel" id="culture-panel" role="tabpanel" aria-labelledby="tab-${country}">
        <p class="muted">${country === "thailand" ? "In Thailand, men can add khrap as a polite sentence ending." : "Vietnamese is tonal; these approximations are a starting point. Address terms vary by age and region."}</p>
        <h3>Etiquette</h3><ul class="practical-list">${data.etiquette.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h3>Laws and caution</h3><ul class="practical-list">${data.laws.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h3>Common scams</h3><ul class="practical-list">${data.scams.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h3>Tipping</h3><p>${escapeHtml(data.tipping)}</p>
        <h3>Useful phrases</h3><ul class="phrase-list">${data.phrases.map((phrase) => `<li><span class="small muted">${escapeHtml(phrase.en)}</span><span class="phrase-local" lang="${country === "thailand" ? "th" : "vi"}">${escapeHtml(phrase.local)}</span><span class="phrase-say">${escapeHtml(phrase.say)}</span></li>`).join("")}</ul>
      </div>`;
  }

  function renderPracticals() {
    const emergencies = trip.practical.emergency.map((item) => `
      <article class="emergency-card"><h3>${escapeHtml(item.country)}</h3>${item.police ? `<p>Police: <strong>${escapeHtml(item.police)}</strong></p>` : ""}${item.ambulance ? `<p>Ambulance: <strong>${escapeHtml(item.ambulance)}</strong></p>` : ""}${item.fire ? `<p>Fire: <strong>${escapeHtml(item.fire)}</strong></p>` : ""}${item.extra ? `<p>${escapeHtml(item.extra)}</p>` : ""}${item.address ? `<p>${escapeHtml(item.address)}</p>` : ""}${item.phone ? `<p>${escapeHtml(item.phone)}</p>` : ""}</article>`).join("");
    return `
      <div class="grid grid-2">
        <div><h3>Entry</h3><ul class="practical-list">${trip.practical.entry.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        <div><h3>Money</h3><ul class="practical-list">${trip.practical.money.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        <div><h3>Apps</h3><ul class="packing-list">${trip.practical.apps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        <div><h3>Weather</h3><ul class="practical-list">${trip.practical.weather.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
      </div>
      <h3>Emergency contacts</h3><div class="grid grid-3">${emergencies}</div>
      <p class="small muted">Verify current embassy opening and visitor instructions before travel.</p>`;
  }

  function renderSources() {
    return `<ul class="source-list">${trip.sources.map((source) => `<li>${renderExternalLink(source.url, source.title)}</li>`).join("")}</ul>`;
  }

  function renderExternalLink(url, label) {
    const safeUrl = safeExternalUrl(url);
    return safeUrl ? `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>` : escapeHtml(label);
  }

  function initializeMap() {
    const container = document.querySelector("#trip-map");
    if (!container) return;
    container.tabIndex = 0;
    if (!window.L) {
      container.innerHTML = '<p class="map-note">The interactive map is unavailable right now. Use the places list beside it to explore destinations.</p>';
      return;
    }
    const bounds = trip.places.map((place) => [place.lat, place.lng]);
    tripMap = window.L.map(container, { scrollWheelZoom: false }).setView([15.6, 103.8], 5);
    window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(tripMap);
    const colors = { stay: "#215a55", food: "#d89b35", sight: "#a14b35", temple: "#8a5b30", nightlife: "#6b5d78", activity: "#3383a1", transport: "#526361", emergency: "#a94037" };
    trip.places.forEach((place) => {
      const marker = window.L.circleMarker([place.lat, place.lng], { radius: 7, color: "#fffdf8", weight: 2, fillColor: colors[place.category] || "#123c3a", fillOpacity: 0.95 }).addTo(tripMap);
      const popup = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = place.name;
      const note = document.createElement("p");
      note.textContent = place.note || place.category;
      const link = document.createElement("a");
      link.href = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open in Google Maps";
      popup.append(name, note, link);
      marker.bindPopup(popup);
      placeMarkers.set(place.id, marker);
    });
    if (bounds.length) tripMap.fitBounds(bounds, { padding: [24, 24] });
  }

  function filterMap(legId) {
    const list = document.querySelector(".place-list");
    if (list) list.innerHTML = renderPlacesList(legId);
    trip.places.forEach((place) => {
      const marker = placeMarkers.get(place.id);
      if (!marker || !tripMap) return;
      if (legId === "all" || place.legId === legId) marker.addTo(tripMap);
      else marker.remove();
    });
    const visiblePlaces = trip.places.filter((place) => legId === "all" || place.legId === legId);
    if (tripMap && visiblePlaces.length) tripMap.fitBounds(visiblePlaces.map((place) => [place.lat, place.lng]), { padding: [24, 24] });
  }

  function showPlace(placeId) {
    const place = trip.places.find((item) => item.id === placeId);
    if (!place) return;
    const filter = document.querySelector("#map-leg-filter");
    if (filter && filter.value !== place.legId) {
      filter.value = place.legId;
      filterMap(place.legId);
    }
    document.querySelector("#map")?.scrollIntoView({ behavior: "smooth", block: "start" });
    const marker = placeMarkers.get(placeId);
    if (marker && tripMap) {
      tripMap.invalidateSize();
      tripMap.setView([place.lat, place.lng], 12);
      marker.openPopup();
    }
  }

  function validatePlaceReferences() {
    const placeIds = new Set(trip.places.map((place) => place.id));
    trip.days.forEach((day) => day.items.forEach((item) => {
      if (item.placeId && !placeIds.has(item.placeId)) console.warn(`Missing place id "${item.placeId}" in itinerary on ${day.date}.`);
    }));
  }

  function bindDecisionTabs() {
    document.querySelectorAll(".decision-tabs a").forEach((link) => {
      link.addEventListener("click", () => {
        const target = document.getElementById(link.hash.slice(1));
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function bindEssentialsInteractions() {
    document.querySelector("#checklist-items")?.addEventListener("change", (event) => {
      const input = event.target.closest("[data-check-id]");
      if (!input) return;
      const completed = readStorage("trip-checklist-v1", memoryChecklist);
      completed[input.dataset.checkId] = input.checked;
      memoryChecklist = completed;
      const saved = writeStorage("trip-checklist-v1", completed);
      input.closest(".check-item")?.classList.toggle("is-done", input.checked);
      setStatus("checklist-status", saved ? "Checklist updated on this device." : "Checklist kept until this page closes; browser storage is unavailable.");
    });
    document.querySelector(".tabs")?.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-culture-tab]");
      if (!tab) return;
      document.querySelectorAll("[data-culture-tab]").forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      document.querySelector("#culture-content").innerHTML = renderCulture(tab.dataset.cultureTab);
    });
    document.querySelector(".tabs")?.addEventListener("keydown", (event) => {
      const tab = event.target.closest("[data-culture-tab]");
      if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const tabs = Array.from(document.querySelectorAll("[data-culture-tab]"));
      const index = tabs.indexOf(tab);
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
    document.querySelector("#map-leg-filter")?.addEventListener("change", (event) => filterMap(event.target.value));
    main.addEventListener("click", (event) => {
      const target = event.target.closest("[data-place-target]");
      if (target) showPlace(target.dataset.placeTarget);
    });
  }

  function setStatus(id, message) {
    const status = document.getElementById(id);
    if (status) status.textContent = message;
  }

  function renderOverviewPage() {
    renderShell();
    renderOverview();
  }

  function renderStopsPage() {
    renderShell();
    renderStops();
  }

  function renderDecisionsPage() {
    renderShell();
    renderDecisionPage();
  }

  function renderEssentialsPageWithShell() {
    renderShell();
    renderEssentialsPage();
  }

  if (currentPage === "stops") renderStopsPage();
  else if (currentPage === "decisions") renderDecisionsPage();
  else if (currentPage === "essentials") renderEssentialsPageWithShell();
  else renderOverviewPage();
})();
