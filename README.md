# sawaza.app

The Sawaza marketing site: eleven pages built with Astro from the approved design, as static files.

## Run

- `npm install`
- `npm run dev`: a dev server with live reload.
- `npm run build`: the site in `dist/`, one flat `<name>.html` per page so a host with clean URLs serves `/how-it-works` from `how-it-works.html`.
- `npm run preview`: serves `dist/` the way the host will.
- `npm run check`: type-checks the pages and scripts.
- `npm run build:preview`: `dist-preview/`, a folder that works from any sub-path: the anchor flag is on, links are `.html` files and every root-relative URL is rewritten to a relative one by `tool/relativize.mjs`.
- `npm run test:parity`: builds with the anchor flag on and screenshots every page of the design and the build at 390 and 1340 wide, reporting the share of pixels that differ (`tests/parity.mjs`; `--self` proves the harness at 0%, `--preview` checks `dist-preview/` from a sub-path). Needs `DESIGN=<folder>` pointing at the design's HTML and `PLAYWRIGHT_BROWSERS_PATH` where Chromium lives.

## Flags

`src/config.ts` holds the store links (placeholders), the contact email and `SHOW_ANCHOR`, the Stellar time-stamp line and its link on Home and Trust. It reads `PUBLIC_SHOW_ANCHOR` and is off unless that is `true`.

## Layout

- `src/layouts/Base.astro`: head, skip link, icon sprite, top bar, phone menu, footer and the kit script. Claim and invite use its `minimal` chrome. A page's question rail goes in the `rail` slot.
- `src/styles/`: the design's kit stylesheet in its original order (tokens, base, components, app, pages), imported by `kit.css`.
- `src/scripts/kit.ts`: the behaviour every page shares.
- `src/pages/`: one file per page, each holding its page style under `#page-<name>` and its page script.

Deploy notes are added with the hosting config.
