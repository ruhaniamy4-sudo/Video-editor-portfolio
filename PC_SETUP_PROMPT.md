# Prompt to paste into a new Claude Code session on Windows

Open the Claude Desktop app → **Claude Code** → start a session in any folder (for example `Documents`), then paste everything in the box below.

```text
I'm on my Windows PC. Set up everything I need to continue my portfolio website with Google Flow (gflow-cli), then continue the work. Talk to me in Banglish (Bangla in English letters), short and clear. Go step by step, check that each step worked before moving on, and if something fails, fix it or tell me exactly what I need to click.

1. Install missing tools with winget (use --accept-source-agreements --accept-package-agreements, skip anything already installed):
   - Git (Git.Git)
   - Google Chrome (Google.Chrome)
   - uv (astral-sh.uv)
   - FFmpeg (Gyan.FFmpeg)
   After installing, refresh PATH in the current shell. If a command is still not found, tell me to restart Claude Code and paste this prompt again (finished steps will be skipped).

2. Clone https://github.com/ruhaniamy4-sudo/video-editor-portfolio into %USERPROFILE%\Documents\video-editor-portfolio. If it already exists, run git pull there instead. Work inside that folder from now on.

3. Install gflow-cli: `uv tool install gflow-cli` (run `uv tool update-shell` if gflow is not on PATH). Check with `gflow --help`.

4. Log in to Google Flow: run `gflow auth login --browser chrome`. Tell me Chrome is opening and that I must log in with my Google AI Pro account. Wait until I say I'm done, then confirm the login works (look for a status/check command in `gflow --help` or `gflow auth --help`).

5. Set up a Python environment for cut-outs and image work inside the repo: `uv venv .venv --python 3.12`, then install `rembg[cpu]`, `pillow` and `numpy` into it. Make sure `.venv/` is listed in .gitignore.

6. Read NEXT_STEPS.md and explain the plan to me in 4-5 lines. Then ask me to attach my original rooftop photo and start with section 1 (the sci-fi hero).

Rules:
- Every Flow generation uses my credits. Before each one, tell me what you will generate and how many. Show me the result before generating more.
- Never commit gflow login files, cookies, tokens or anything secret.
- Commit and push to main only after I approve the result. If git asks me to sign in to GitHub, tell me what to do.
```
