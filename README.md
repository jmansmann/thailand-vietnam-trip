# Thailand + Vietnam trip planner

A mobile-first, public planning site for five travelers on a Thailand and Vietnam trip from Dec 29, 2026 to Jan 9, 2027. Flights are out of scope. This repository contains estimates and research, not booking confirmations.

## Pages

- `index.html` is the quick overview with dates, route, budget range, and open decisions.
- `details.html` has three stop tabs—Phuket, Bangkok, and Hanoi—with an Overview / Details selector for each. Ninh Binh and Lan Ha Bay are sections within Hanoi.
- `decisions.html` summarizes open choices by stop. It is a discussion guide, not a voting form.
- `essentials.html` contains the map, budget, checklist, culture notes, packing, and practical information.

No votes are collected by the site. Checklist marks are stored in the current browser only; there is no backend. **Do not put names, booking IDs, phone numbers, or other private information on this public site.**

## Edit trip content

All user-facing trip content lives in `data/trip.js` as `window.TRIP`. Update that data rather than editing rendered page content in `assets/js/app.js`.

Research and the itinerary are in `docs/`. Items marked **verify** need a current check before anyone books.

## Preview locally

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000/> for the overview, <http://localhost:8000/details.html> for the stop tabs, <http://localhost:8000/decisions.html> for the group decision list, and <http://localhost:8000/essentials.html> for map and practicals. The site also loads its shared content when an HTML page is opened directly with `file://`.

## Quality checks

```sh
make verify
```

## Deploy to GitHub Pages

1. Create a GitHub repository for this project.
2. Push the `main` branch.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, then select `main` and `/ (root)`.
5. GitHub Pages will publish the site at `https://<user>.github.io/<repo>/`.

The site is public. Keep all personal and booking details out of the repository.
