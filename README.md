# OneSTOP Invader Radar

Invader Radar is a browser app that uses iNaturalist observations to highlight nearby introduced species, including species that match curated invasive and horizon-scan lists.

## What it does

- Uses your GPS location (or URL/manual coordinates) to create an inner and outer search radius.
- Compares species recorded locally (inner radius) vs nearby (outer radius).
- Shows a local/proximity ratio and recent change indicators.
- Flags records with badges for:
	- UK listed invasive species
	- GB Non-native Species Horizon Scan 2025
	- GB Non-native Species Horizon Scan 2019 categories
- Adds optional NNSIP metadata and links for matching species.
- Supports filtering both species lists by iconic taxon.

## Data and API sources

- **Live records:** iNaturalist API `observations/species_counts`
- **Invasive list:** bundled dataset in `js/data_invasive-species.js`
- **NNSIP species info:** bundled dataset in `js/data_NNSIP.js`
- **Horizon Scan 2025:** bundled dataset in `js/data_horizon_scan_2025.js`
- **Horizon Scan 2019:** bundled dataset in `js/data_horizon_scan_2019.js`

By default, API calls are constrained to:

- `verifiable=true`
- `lrank=species`
- `introduced=true`

## URL parameters

Reserved parameters used by the app:

- `lat` — latitude to center the map.
- `lng` — longitude to center the map.
- `i_rad` — inner radius in km.
- `o_rad` — outer radius in km.

Any additional query parameters are passed through to iNaturalist requests. Example:

```text
?iconic_taxa=Aves
```

## Project structure

- `index.html` — main application page.
- `styles.css` — app styling.
- `js/config.js` — global state and configuration.
- `js/url-params.js` — URL parsing and parameter handling.
- `js/map.js` — map setup and doughnut controls.
- `js/api.js` — iNaturalist API utilities.
- `js/data-processing.js` — core fetch, compare, and render logic.
- `js/app.js` — list filtering, sorting, and tab badge updates.
- `js/init.js` — startup orchestration.
- `sw.js` + `manifest.webmanifest` — PWA/service-worker configuration.


## Credits

- Originally created by Simon Rolph.
- Built around iNaturalist data and UK non-native species datasets.
