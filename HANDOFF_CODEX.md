# Handoff to Codex: hero cue images (written 1 Nov 2026)

## Project in one paragraph

Single-page video-editor portfolio for Anayet Hossain. Everything is in `index.html` (inline CSS and JS, no build step). Live site: https://anayet-hossain.pages.dev (Cloudflare Pages, auto-deploys every push to `main`). Repo: https://github.com/ruhaniamy4-sudo/Video-editor-portfolio.

## Rules from the owner

- Commit and push to `main` only after the owner approves the result.
- Never commit login files, cookies, tokens or anything secret.
- Talk to the owner in Banglish, short.
- Before any paid image generation, say what you will generate and how many, and show the result before generating more.

## The task: make the hero header effects real

### What exists now

The hero (`header.op#top`) shows two stacked photos:

- `assets/hero-set.webp` (the room, class `.op-set`)
- `assets/hero-me.webp` (the cut-out of Anayet, class `.op-me`)

A ring of 10 orbit cards (`.orb`, around `index.html:1650-1659`) rotates around him. Each card has a `data-cue`: `light`, `focus`, `camera`, `iso`, `aperture`, `wb`, `color`, `shutter`, `lut`, `rim`.

When a card reaches the front, the orbit script (`setCue`, around `index.html:2305-2320`) copies its cue to `#top` as `data-cue`. CSS rules (`index.html:156-168`) then try to fake the effect:

- CSS filters on the photos (blur, brightness, `--lut`)
- a coloured overlay `.op-cue` (gradients, a white flash for `camera`)

### The problem

These CSS fakes do not look like the real thing. A gradient is not a key light, and a blur filter is not a lens aperture. The owner says the effect "did not happen".

### The plan the owner chose

1. The owner makes **10 finished images** with GPT Image, one per card. Each image is the same hero frame (same size, same crop, same pose as `hero-set` + `hero-me` combined) with that card's effect done for real:

   | Cue | What the image shows |
   | --- | --- |
   | `light` | a warm key light switched on, lighting his face |
   | `focus` | focus pulled: the room sharp, Anayet soft |
   | `camera` | the moment the photo is taken: flash burst |
   | `iso` | high ISO: brighter, with visible grain |
   | `aperture` | wide aperture: Anayet sharp, room in creamy bokeh |
   | `wb` | white balance shift from warm 3200K toward cool 5600K |
   | `color` | teal and orange colour grade |
   | `shutter` | slow shutter: motion streaks in the background lights |
   | `lut` | a B&W / bleach-bypass LUT look |
   | `rim` | a cool blue rim light outlining him from behind |

2. In the header, the matching image replaces the CSS fake when its card comes to the front. For the cards to look real, the header must show the actual photo.

### What Codex should build

1. **Image spec to give the owner for GPT Image:**
   - Start from one base frame, exported as a single flat image from the current hero.
   - Every variant has exactly the same size and framing as that base, so a cross-fade does not jump.
   - Use WebP with about 1920px width, and keep each file under ~250 KB.
   - Save them as `assets/hero-cue-<cue>.webp`.
2. **Header change:**
   - Add one `<img class="op-cue-img">` layer above `.op-set` and `.op-me`.
   - On `setCue(o)`, set its `src` to `assets/hero-cue-${cue}.webp`, then cross-fade its opacity in about 0.4 s.
   - If a cue's image is missing (not made yet), fade the layer out and keep the old CSS rule for that cue.
   - Preload the 10 images only after the page `load` event, not in `<head>`, so the first paint stays fast.
   - The `lut` cue currently cycles 3 looks every 1.8 s through `--lut`. With one image it shows one look; keep it simple unless the owner makes 3 LUT images.
3. **Keep:**
   - Reduced motion: no flash, just a soft fade.
   - Clicking a card still pins it for 4 s.
   - The orbit still runs only while the hero is on screen.
4. Remove the CSS rules at `index.html:156-168` that the images replace.

## Also open: bug fixes in PR #1

PR #1 (https://github.com/ruhaniamy4-sudo/Video-editor-portfolio/pull/1, branch `fix/mobile-interactions`) is not merged yet. It holds 6 mobile and reduced-motion fixes and a Playwright test. The test report is in `MOBILE_QA.md` on that branch.

Before building the hero work:

1. Run the test:
   ```sh
   npm ci && npx playwright install chromium && npm run test:mobile
   ```
2. Review the diff.
3. Ask the owner, then merge.

## How to check work

- Syntax: extract the inline scripts and run `node --check` on each one.
- After a hero change, run `npm run test:mobile` (once PR #1 is merged).
- Look at the hero in a real browser. CSS animations do not run in headless Chrome, so a headless screenshot shows an empty hero even when it works.
- After a push, wait about 1 minute, then confirm the live site serves the new code.
