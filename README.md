# Anayet Hossain — Portfolio

Single-page portfolio website for Anayet Hossain, video editor and motion designer.

## Editing content

Everything lives in `index.html`. Near the bottom, in the `<script>`:

- `CONFIG`: showreel link, email, WhatsApp number, social links and an optional Formspree endpoint for the contact form
- `PROJECTS`: the case-study cards (title, client, description, role, focus, video link and card colors)

Text such as the hero headline, services, process steps, reviews and FAQ is plain HTML in the page.

## Photos

Graded photos live in `assets/`:

- `hero-plate.webp` + `hero-cut.webp`: the hero frame and the matching cut-out that breaks out of it (same crop, same grade, so they line up)
- `grade-log.webp` / `grade-final.webp`: the raw vs graded comparison in About
- `clip-1.webp` … `clip-5.webp`: the five clips in "Inside My Timeline", each with its own look
- `avatar.webp`, `contact-night.webp`, `sit-cut.webp`: contact card and footer

## Contact form

Without a `formEndpoint`, the form opens the visitor's email app with the message filled in.
Create a free form at https://formspree.io, paste its URL into `CONFIG.formEndpoint`, and messages arrive by email.

## Run locally

Open `index.html` in a browser. No build step.

## Deploy

GitHub Pages: Settings → Pages → Deploy from a branch → `main` / root.
Also works on Netlify or Vercel as a static site.
