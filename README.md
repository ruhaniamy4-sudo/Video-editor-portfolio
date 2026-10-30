# Anayet Hossain — Portfolio

Single-page portfolio website for Anayet Hossain, video editor and motion designer.

## Editing content

Everything lives in `index.html`. Near the bottom, in the `<script>`:

- `CONFIG`: showreel link, email, WhatsApp number, social links and an optional Formspree endpoint for the contact form
- `PROJECTS`: the case-study cards (title, client, description, role, focus, video link and card colors)

Text such as the hero headline, services, process steps, reviews and FAQ is plain HTML in the page.

## Contact form

Without a `formEndpoint`, the form opens the visitor's email app with the message filled in.
Create a free form at https://formspree.io, paste its URL into `CONFIG.formEndpoint`, and messages arrive by email.

## Run locally

Open `index.html` in a browser. No build step.

## Deploy

GitHub Pages: Settings → Pages → Deploy from a branch → `main` / root.
Also works on Netlify or Vercel as a static site.
