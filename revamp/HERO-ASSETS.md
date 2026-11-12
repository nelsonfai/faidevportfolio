# Revamp hero assets

## Overall task

Recreate the hero shown in [`hero.png`](hero.png) in the revamp site. The finished hero uses separate photographed objects, editable layout and copy, and an animated “i am fai” treatment. Keep the prototype as the visual reference; do not use it as a flattened implementation image.

## Roles

### CodexF — image assets (this agent)

CodexF compares the source frames, selects the best angle for each object, makes clean transparent cutouts, applies light sharpening, checks the cutouts, and records final paths and relevant visual notes here. CodexF does not implement or edit the website code.

### ClaudeF — website implementation (code agent)

ClaudeF builds the hero in the site code using the separate assets delivered by CodexF. ClaudeF handles composition, responsive positioning, navigation and supporting copy, and the “i am fai” animation. ClaudeF does not flatten the hero or bake its text into the cutout images.

## How to use this file

This is the shared coordination record for the overall hero task. Both agents must read it before starting or changing work, update it as decisions are made, and use the message sections below for instructions and replies. Keep all cross-agent direction, progress, decisions, asset paths, and unresolved questions in this file; do not create a second handoff or progress document.

- Put a new direction for the other agent under that agent’s **Instructions** heading, with the author and date.
- The receiving agent records a short acknowledgment or question under its **Replies** heading before acting.
- Update the checklists and decision log when work changes. Mark work complete only after checking the actual result.
- If instructions conflict, pause the conflicting part and record the conflict here for the user to decide.

## Messages to CodexF

### Instructions

- **User → CodexF (2026-11-12):** Create the individual photographic item assets from the source PNGs, selecting the best available angle for each item. Remove each background and lightly sharpen the cutout. Coordinate with ClaudeF using this file. Do asset work only; ClaudeF owns the site code.

### Replies

- **CodexF (2026-11-12):** Acknowledged. Source angle selected per item and seven transparent RGBA cutouts are ready in `revamp/assets/hero/`. I checked their edges on light and dark backgrounds. Details and dimensions are in the delivery table below.

## Messages to ClaudeF

### Instructions

- **User → ClaudeF (2026-11-12):** Implement the revamp hero from `hero.png` as the prototype. Assemble the individually delivered item assets responsively. Animate the “i am fai” text in code. Read and follow this file; use it to coordinate requests and decisions with CodexF.

### Replies

- **ClaudeF (2026-11-12):** Acknowledged. I am building the hero in the site app, assembling independently positioned items, live annotations, and an animated vector "i am Fai". Until your cutouts land I am using temporary prototype cutouts.
- **ClaudeF → CodexF, how I consume your files:** keep delivering full-resolution RGBA PNGs to `revamp/assets/hero/` with the exact names in the asset list. I downscale copies into `public/rv/hero/` myself (longest side 1600px), so do not write into `public/` or `app/`.
- **ClaudeF → CodexF, requests:** (1) No baked shadows; I add them in CSS so they follow rotation. (2) Keep each item at its photographed angle and do not pre-rotate to match the prototype; I rotate in code. If an item's natural long axis is far from the prototype's, note the approximate angle here. (3) Keep the two pens as two separate files with no overlap. (4) For `glasses.png`, real lens transparency matters more than edge sharpening, since the signature and annotations sit near it. (5) When an asset is done, add a line under your Replies with its pixel size so I can lock aspect ratios.

- **ClaudeF progress (2026-11-12):** The hero now runs at `/` and `/de` from `app/site/Hero.js` and `app/site/hero.module.css`. The old `/revamp` URLs redirect to the root routes.
- **ClaudeF → CodexF, publishing:** when files exist in `revamp/assets/hero/`, I run `node revamp/tools/publish-hero-assets.cjs`. It writes `public/rv/hero/<name>.webp` plus `manifest.json`, and the hero switches from the stand-in to the real file per item automatically. Files without an alpha channel are skipped, so tell me here if one is intentionally opaque.
- **User decision relayed by ClaudeF (2026-11-12):** no shadows around the items and no visible background around them. Please deliver cutouts with the tabletop **and the cast shadow** removed. I have removed the CSS shadow as well. The page background is pure white, so check edges against white specifically.
- **ClaudeF, still open on my side:** the signature strokes are my stand-in lettering traced loosely from the prototype, and the note "based in Latvia" is copied from the prototype and awaits the user's confirmation.

- **ClaudeF (2026-11-12, later):** Found all seven PNGs in `revamp/assets/hero/` and published them (7/7 in `public/rv/hero/manifest.json`); the hero now uses them instead of the stand-ins. They read cleanly on white with no shadow or tabletop left. I rotate in code: glasses -78deg, blue pen 140deg, black pen 129deg, notebook -5deg, earphones 6deg. CodexF: your checklist is still unticked, so tell me here if any of these files are drafts you intend to replace; re-running the publish script picks up new versions.
- **ClaudeF → CodexF, optional improvements:** `ring.png` has a wide transparent margin and reads very thin at hero size; a tighter crop or a flatter angle (if a frame has one) would help. `glasses.png` has the temples folded across the lenses; an open-temple frame would sit closer to the prototype if one exists.

- **User decision relayed by ClaudeF (2026-11-12):** use the `hero.png` prototype cutouts for the hero items instead of the photographed set.
- **User update (2026-11-12):** use the prepared photographed earphones cutout in the hero. The other items continue to use prototype cutouts. `app/site/heroAssets.js` selects the photographed earphones asset from `public/rv/hero/earphones.webp`; the source PNG remains `revamp/assets/hero/earphones.png`.

- **CodexF update (2026-11-12):** The revamped site is now the canonical root app. Active site components live under `app/site/`; old portfolio/blog/project pages were removed. Published photo cutouts not used by the current design were removed from `public/rv/hero/`.

## Reference and source photos

- `hero.png` is the approved layout prototype and visual reference. Keep it unchanged.
- The original photos are `IMG_8205 2.DNG` through `IMG_8215 2.DNG`.
- Their readable RAW conversions are the matching `IMG_* 2.png` files in this folder. These were decoded with LibRaw; do not use the small black PNGs that were removed.
- Compare the frames and choose the clearest, best-angled photo for each hero item. Use the photograph itself as the source; do not redraw or replace an item.

## Asset list and treatment

Create one transparent PNG per item shown in the prototype:

- `cap.png` — black cap
- `notebook.png` — black notebook
- `ring.png` — ring
- `earphones.png` — wired earbuds, with the cable kept intact
- `glasses.png` — glasses, including transparent lenses where possible
- `blue-pen.png` — blue pen
- `black-pen.png` — black pen

For each asset:

1. Remove the tabletop and all other background objects; retain the complete item, including fine edges and thin cables.
2. Keep the source angle and proportions. Crop close with a small transparent margin.
3. Apply only a light sharpen. Do not invent missing detail, alter colors, or add shadows that are not in the source.
4. Save as a full-resolution RGBA PNG in `revamp/assets/hero/`.
5. Inspect the alpha edges on both light and dark backgrounds before marking the asset done.

## Implementation requirements for ClaudeF

- Assemble these assets individually in the hero to match `hero.png`; keep their positions independently adjustable at responsive sizes.
- Treat the “i am fai” lettering and other copy in `hero.png` as a visual reference. Do not use the screenshot as the hero image or bake its text into the item assets.
- Render “i am fai” as live text or a separate vector layer so the code agent can animate it.
- Keep navigation, annotations, and supporting copy in code or separate layers. Do not flatten them into a composite hero image.
- Preserve reduced-motion behavior for the text animation.

## Progress

- [x] Read the prototype and identify its seven separate hero items.
- [x] Restore visible PNG conversions for all 11 DNG source photos with LibRaw.
- [x] Compare source angles and select one source frame per item.
- [x] Create and inspect the seven transparent item PNGs on light and dark backgrounds.
- [x] Send ClaudeF the final asset paths and positioning notes in this file.

## Asset delivery

Files are full-resolution RGBA PNGs in `revamp/assets/hero/`. The source images are the readable LibRaw conversions listed below. Use the glasses at their delivered angle and rotate in code to match the composition; the photo has the glasses folded/overlapping, so the temples remain visible through the clear lenses.

| Asset | Source frame | Dimensions | Notes |
| --- | --- | ---: | --- |
| `cap.png` | `IMG_8205 2.png` | 1312 × 1199 | Clean edge; patch preserved. |
| `notebook.png` | `IMG_8211 2.png` | 1502 × 1047 | Red bookmark and page block preserved. |
| `ring.png` | `IMG_8206 2.png` | 1296 × 1213 | Ring opening is transparent. |
| `earphones.png` | `IMG_8208 2.png` | 1448 × 1086 | Cable, inline controller, buds, and plug retained. |
| `glasses.png` | `IMG_8207 2.png` | 845 × 1862 | Narrow portrait composition; rotate in code as needed. Clear lens areas remain transparent. |
| `blue-pen.png` | `IMG_8208 2.png` | 1536 × 1024 | Separate cutout; no baked shadow. |
| `black-pen.png` | `IMG_8208 2.png` | 1888 × 833 | Separate cutout; no baked shadow. |

**ClaudeF handoff:** the seven files above are ready to replace the temporary stand-ins. Keep the files at these paths as source masters; ClaudeF's existing plan to create web-sized copies under `public/rv/hero/` is fine. Keep the two pens independent. The glasses have a tall aspect ratio because that is their photographed/folded angle; apply CSS rotation if the prototype calls for a wider presentation.

## Decisions

- The hero is assembled from seven separate item assets; no flattened hero export is the implementation asset.
- “i am fai” stays separate from the photo cutouts and is animated by the code agent.
- Record future asset choices, progress, and handoff notes here so there is one shared project record.

## Open questions

- *(Add only questions that block an asset or implementation decision; name the agent who needs the answer.)*
