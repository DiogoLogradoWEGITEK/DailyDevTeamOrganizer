# Daily Dev — Standup Order Randomizer

A lightweight GitHub Pages tool for daily standups. It randomly shuffles a list of participants, shows the presentation order, and runs a session timer. Participants can be manually reordered via drag-and-drop after the shuffle.

## Features

- Random shuffle of participants on each session start ("Ordem de Apresentação" / "Reroll")
- Live session timer
- Drag-and-drop reordering of the resulting list

## Configuring participants

Participant names are loaded from `participants.js` at runtime. Copy the example file and edit it:

```bash
cp participants.example.js participants.js
```

Then edit `participants.js` with the actual names:

```js
window.PARTICIPANTS = ["Alice", "Bob", "Carol"];
```

`participants.js` is listed in `.gitignore` to keep names out of version history. See the **Privacy** section below for how this works with GitHub Pages deployment.

## Privacy

Because GitHub Pages serves files directly from the repository, a gitignored `participants.js` will **not** be available on the live site (the page will fall back to empty names). Two practical options:

**Option A — Commit the file (simplest)**  
Remove `participants.js` from `.gitignore` and commit it. Names will be visible in the public repo — acceptable for most team setups.

**Option B — GitHub Actions + repository secret (private names)**  
1. Go to *Settings → Secrets and variables → Actions* and create a secret named `PARTICIPANTS_JSON` with value `["Alice","Bob","Carol"]`.
2. Add a workflow that writes the file before deploying:

```yaml
# .github/workflows/deploy.yml
- name: Write participants
  run: echo "window.PARTICIPANTS = ${{ secrets.PARTICIPANTS_JSON }};" > participants.js
```

This keeps names out of the repo while still deploying them to GitHub Pages.
