# Coast Heat — Cover Studio

An offline web app that turns your photos and a caption into GTA-style
multi-panel cover art — a sunset poster with bold 3D lettering, a neon script
subtitle, star meter, badge and ticker strip — exported as a PNG to share.

Made for the make.fun competition **gta6-cover-art-01** ("Make GTA 6 Cover
Art"). Everything in it is original: the sample photos were made with an
image model for this studio, the lettering is Anton and Pacifico under the SIL
Open Font License, and no game's logo, artwork or fonts are used anywhere.

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

1. Pick a sample photo or add your own (photos never leave your machine).
2. Choose one of 6 layouts and 6 sunset grades.
3. Edit the title, subtitle, ticker, stars and badge.
4. Click a panel to change its photo, zoom, position and caption — or drag
   the photo right on the cover.
5. Pick a size (1080 × 1080, 1080 × 1350, 1920 × 1080) and Export PNG.

## Layout

- `main.ts` — the entry program: copies `app/` and `screenshots/` to
  `/output` and writes `dossier.json` with the vendored make.fun library.
- `app/` — the studio itself, static files only, no network requests:
  `index.html`, `style.css`, `src/cover.js` (the cover renderer: layouts,
  grades, lettering, badges), `src/main.js` (the editor), `fonts/` (Anton +
  Pacifico, OFL), `samples/` (four model-made sample photos).
- `screenshots/` — 4 screenshots: the exported covers and the editor at work.
- `serve.ts` — tiny local static server for trying the app.
- `shots.json` — how each screenshot was taken.

## Build it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
