# On the Record / 기록선 — fresh rebuild

This ZIP is designed to replace the repository from scratch.

## Included

- `index.html` — English site: **On the Record**
- `ko/index.html` — Korean site: **기록선**
- `styles.css` — shared responsive design
- `script.js` — shared article feed, FX, weather and ticker logic
- `data/articles.json` — initial verified Korea Herald stories
- `favicon.svg`
- `assets/placeholder.svg` — image fallback
- `tools/update_articles.py` — Korea Herald reporter-feed refresher
- `.github/workflows/refresh.yml` — automatic refresh every 6 hours + manual trigger
- `.nojekyll`

## What the site keeps

- Article photos
- Weather for Seoul and San Diego
- USD/KRW and USD/JPY reference rates
- Scrolling latest-headline ticker
- The Korea Herald reporting section
- UCSD Guardian section
- Off the Record section
- About section
- EN / KR switching

## What is intentionally removed

- YouTube / multimedia section
- Repeated `The Korea Herald · Business` labels on every story
- Article descriptions/decks in the portfolio grid
- Duplicate lead-story block

Each Korea Herald card is intentionally limited to:

**photo → headline → date → full-story link**

## Fresh GitHub upload

1. Delete the old repository contents **but keep the repository itself**.
2. Unzip this package on your computer.
3. Upload **the contents inside the folder**, not the outer folder itself, to the root of `ontherecord-lim.github.io`.
4. Make sure hidden folders/files are included, especially:
   - `.github/workflows/refresh.yml`
   - `.nojekyll`
5. Commit the upload.
6. In GitHub: **Settings → Pages**.
7. Under Build and deployment, use **Deploy from a branch** and select:
   - Branch: `main`
   - Folder: `/ (root)`
8. Wait a minute or two, then check:
   - English: `https://ontherecord-lim.github.io/`
   - Korean: `https://ontherecord-lim.github.io/ko/`

## Refreshing articles immediately

The initial ZIP already includes current article data. To force an update after upload:

1. Open the repository's **Actions** tab.
2. Select **Refresh Korea Herald feed**.
3. Click **Run workflow**.

The scheduled workflow also runs every 6 hours.

## Korean headlines

The Korean page uses `titleKo` when a localized headline exists in `data/articles.json`. Newly discovered stories automatically appear even without a Korean translation; they fall back to the published English headline until `titleKo` is added manually.

## External data

- Weather: Open-Meteo public API
- FX reference rates: Frankfurter public API
- Article photos: lead-image URLs supplied by The Korea Herald article metadata

If one external data service is unavailable, that panel fails independently; it does **not** stop the article feed or the other widgets.
