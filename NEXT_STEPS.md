# Next steps (handoff for a new Claude Code session)

Portfolio for **Anayet Hossain**, video editor & motion designer. One page: `index.html` (CSS + JS inline), images in `assets/`.
Talk to Anayet in Banglish, short and clear. Show a screenshot before asking to commit; commit/push to `main` only after he approves.

## Live site
- Cloudflare Pages project `anayet-hossain` → https://anayet-hossain.pages.dev, auto-deploys on every push to `main`.
- Repo: https://github.com/ruhaniamy4-sudo/Video-editor-portfolio (git author is set per-repo to the GitHub noreply email).

## Where things are in index.html
- `CONFIG` (bottom `<script>`): email, WhatsApp, Facebook, stats, links (empty links are hidden), `formEndpoint`.
- `WORK` (22 Drive projects), `REEL` (Now playing fan), `CASES` (4 featured cover cards with tabs + flip + mouse tilt).
- Hero photo: `assets/hero-me.webp` (Anayet's own Photoshop cut-out). Position: `.op` `--hy` (desktop/tablet/mobile). Fades: `.op-me` `mask-image`.
- "Who am I": bg `assets/why-me.webp` + cut-out `assets/why-me-cut.webp`; 4 pills on the left launch 4 big 3D cards (motion-graphic "shape shift" inside) — `.kfly` / `.kcard` / `.mg-shift`.

## Not yet verified
- Live animations (pill → card flight, card flip, mouse tilt) were only checked as headless stills. Check in a real browser.

## Open items (from the audit)
1. Reviews in "What clients say" are `[placeholder]` text — fill with real quotes or remove the two `<figure>`s.
2. Stats in `CONFIG` (`5+ / 200+ / 1M+ / 50+`) are placeholders — confirm real numbers.
3. One Escape key closes both the video player and the project folder — merge the two keydown handlers.
4. Contact form: set `CONFIG.formEndpoint` (Formspree) so messages arrive.
5. Add `og:title` / `og:description` / `og:image` for link previews.
6. Type-strip loop reads `scrollWidth` every frame — cache it and pause off-screen.
7. Delete unused assets: avatar, clip-1..5, hero-cut, hero-plate, scifi-studio, sit-cut; move `assets/49764.png` (2 MB source) out of the repo; delete `hero-room.webp`.
8. README is outdated; `PC_SETUP_PROMPT.md` can go.
