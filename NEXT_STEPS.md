# Next steps (handoff for a local Claude Code session on Windows)

Portfolio site for **Anayet Hossain**, video editor & motion designer. Single page: `index.html`, images in `assets/`.
Content to edit lives at the bottom of `index.html`: `CONFIG` (links, contact), `WORK` (22 real projects from Google Drive), `PROJECTS` (4 featured cards), `CLIPS` (the "Inside My Timeline" section).

## Tool: gflow-cli (Google Flow, unofficial)

Anayet has a **Google AI Pro** subscription, so Flow (Nano Banana / Imagen images, Veo video) can be driven with
[gflow-cli](https://github.com/ffroliva/gflow-cli). Set it up once:

```powershell
uv tool install gflow-cli
gflow auth login --browser chrome   # log in with the AI Pro Google account
gflow --help
```

Every generation spends Flow credits, so generate only what is listed below and show results before adding more.
It is unofficial and can break when Google changes Flow; if a command fails, check `gflow --help` and the project README.

## 1. Sci-fi hero (top priority)

The hero currently shows a graded rooftop photo inside a camera frame, with a cut-out of Anayet whose head breaks
out of the top of the frame, the word EDITOR behind him, a lime face-track box, REC timecode and audio meters.
**Keep that whole design**; only the image changes.

- Source photo: the rooftop portrait (white sweater, sitting at a black table, greenery behind). Ask Anayet for the original file.
- Generate a sci-fi / futuristic-film version (space station or film-studio spaceship, holographic film strips,
  nebula), keeping his face, beard, hair and pose exactly. Keep skin tones natural (he asked for less face saturation).
- Replace `assets/hero-plate.webp` (1120x1060) with the new image cropped the same way, and rebuild
  `assets/hero-cut.webp` as a cut-out of him from **the same crop**, so the two line up pixel for pixel.
  Background removal: `rembg` (`pip install "rembg[cpu]"`, model `isnet-general-use`) worked well.
- The frame top sits at 30% of the image height (`.pop-frame` clip-path and `.pop-cut` clip-path in `index.html`);
  his head must be above that line. Adjust the crop rather than the CSS if needed.
- Optional: a short Veo clip of the same scene as a looping hero background (muted, small file).

## 2. Remaining sci-fi images

Done already: `assets/about-scifi.webp` (About slider) and `assets/scifi-studio.webp` (first timeline clip).
Still the old color-graded versions: `assets/clip-1.webp` … `clip-5.webp` (timeline), `assets/contact-night.webp`
(contact card), `assets/sit-cut.webp` (cut-out sitting on the footer card). Same style, 4:5 for clips.

## 3. Hover previews for the 22 projects

Goal: a 5–6 s muted clip of the **best moment** (strongest scene or text animation) of each video, played when
hovering a project card. Videos are in the public Drive folder
https://drive.google.com/drive/folders/1McyJHi5xfnsM-UTXfX-EhLaPAuJANV4v (file ids are in `WORK`).
**Careful:** sampling many frames over HTTP tripped Google Drive's download quota once. Work from local copies
of the videos (download each once, or use the files already on this PC), pick moments, then cut with ffmpeg:
`ffmpeg -ss <t> -t 6 -i in.mp4 -an -vf scale=640:-2 -c:v libx264 -crf 30 -movflags +faststart assets/previews/<slug>.mp4`.

## 4. Still dummy

Email, WhatsApp, location and social links in `CONFIG`; role/focus text on the featured cards; title "Mongol MC".

## Publishing

Commit and push to `main`. The live site needs GitHub Pages turned on once:
repo Settings → Pages → Deploy from a branch → `main` / root.
