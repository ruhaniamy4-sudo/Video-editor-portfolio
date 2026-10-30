# Next steps (handoff for a new Claude Code session)

Portfolio for **Anayet Hossain**, video editor & motion designer. One page: `index.html` (CSS + JS inline), images in `assets/`.
Talk to Anayet in Banglish, short and clear. Show a screenshot before asking to commit; commit/push to `main` only after he approves.

## Live site
- Cloudflare Pages project `anayet-hossain` → https://anayet-hossain.pages.dev, auto-deploys on every push to `main`.
- Repo: https://github.com/ruhaniamy4-sudo/Video-editor-portfolio (git author is set per-repo to the GitHub noreply email).
- State (2026-10-31): all work is committed and pushed (`6cc9f67`, same as `origin/main`). Only `assets/49764.png` and `assets/hero-room.webp` are untracked; see item 7.

## Where things are in index.html
- `CONFIG` (bottom `<script>`): email, WhatsApp, Facebook, stats, links (empty links are hidden), `formEndpoint`.
- `WORK` (22 Drive projects), `REEL` (Now playing fan), `CASES` (4 featured cover cards with tabs + flip + mouse tilt).
- Hero photo: `assets/hero-me.webp` (Anayet's own Photoshop cut-out). Position: `.op` `--hy` (desktop/tablet/mobile). Fades: `.op-me` `mask-image`.
- "Who am I": bg `assets/why-me.webp` + cut-out `assets/why-me-cut.webp`; 4 pills on the left launch 4 big 3D cards (motion-graphic "shape shift" inside) — `.kfly` / `.kcard` / `.mg-shift`.

## Not yet verified
- Live animations (pill → card flight, card flip, mouse tilt) were only checked as headless stills. Check in a real browser.

## Uncommitted work (2026-10-31, waiting for Anayet's OK to commit + push)
- "Who am I": each pill fades out (`.ktag.gone`) the moment its card launches; the card grows from the pill's real size.
- The 4 cards no longer show the morphing shape. Each has its own scene (`.mg-hook` crane hook on a chain, `.mg-story` pin board with 3 stills + lime string, `.mg-ret` "ret🧠in" brain on a stick, `.mg-brand` glossy tile + chat phone), styled after his Pinterest references.
- Checked only as desktop stills on a local server, not on mobile.

## Next task (asked 2026-10-31, not started)
1. "Now playing" section: remove his cut-out (`assets/me-color.webp`, the `<img class="me">` near the reel).
2. "Our Services" section: replace the B&W portrait (`assets/me-bw.webp`) with the new photo `_portraits/maroon-jacket.jpg` (maroon jacket, plain wall), **flipped horizontally** so he faces the service cards. Cut him out / grade to match the dark page, export as webp.

## Open items (after the 2026-10-31 audit fixes)
1. Reviews ("What clients say") are hidden (`hidden` on the heading and `.review-grid`) until there are real quotes — fill them and remove `hidden`.
2. Stats in `CONFIG` (`5+ / 200+ / 1M+ / 50+`) are still placeholders — confirm real numbers.
3. Contact form: `CONFIG.formEndpoint` is empty, so submit only opens the visitor's mail app (mailto). Anayet needs a Formspree endpoint.
4. README is outdated; `PC_SETUP_PROMPT.md` can go.

Fixed in the audit pass: single Escape/Tab handler for the player + folder (Escape closes only the top one, Tab is trapped), 980px "desktop site" layout (services/why/contact switch at 1024px, stats 2-up under 1100px), services explanation moves below the wheel at full size ≤1024px, og/twitter meta + `assets/og.jpg`, favicon, canonical, hero image preload, idle animation loops stop off screen, type strip no longer measures every frame, letter effect reads then writes, unused assets removed (sources moved to `_portraits/`).
