# Daily Dev — Standup Order Randomizer

A lightweight GitHub Pages tool for daily standups. Shuffles participants, shows the presentation order, runs a session timer, and displays each person's recent PRs on hover.

## Features

- Random shuffle (Fisher-Yates) on each session start
- Live session timer
- Drag-and-drop reordering after shuffle
- VS Code-styled code bubble showing the shuffle algorithm
- **PR branch hover** — hover a participant name to see their last 7 days of PRs, displayed as branching cards to the left of the list (pre-fetched daily by a scheduled workflow)

## Configuring participants

Participants are loaded from `participants.js`. Copy the example and edit it:

```bash
cp participants.example.js participants.js
```

Each entry is an object with a display name and optional GitHub handle:

```js
window.PARTICIPANTS = [
  { name: "Alice", github: "alice-gh" },
  { name: "Bob", github: "bob-gh" },
];
```

The `github` field is used by the PR hover feature. Set it to `null` to disable PR branches for that person.

`participants.js` is gitignored to keep names out of version history. See **Secrets** below.

## Secrets

All sensitive config is kept in GitHub Actions secrets:

| Secret              | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| `PARTICIPANTS_JSON` | JSON array of `{name, github}` objects — injected as `participants.js` at deploy time |
| `PRIMARY_COLOR`     | Hex colour for the theme (e.g. `#0c3ff7`)                                             |
| `LOGO_URL`          | URL or path to the logo image                                                         |
| `FAVICON_URL`       | URL or path to the favicon                                                            |
| `GIST_ID`           | GitHub Gist ID used to cache pre-fetched data                                         |
| `GIST_PAT`          | PAT with `gist` write scope                                                           |
| `GH_TOKEN`          | PAT with `repo` read scope — used by the PR fetch workflow to search private repos    |

## PR hover feature

A scheduled workflow (`.github/workflows/fetch-pr-data.yml`) runs Monday–Friday at 13:00 UTC (1 hour before the 15:00 Portugal standup). It queries the GitHub Search API for each participant's PRs opened in the last 7 days across `org:wedigitek` and `org:WECAMPUS-io`, then saves the result as `pr-data.json` in the Gist.

The page fetches `pr-data.json` when the session starts. Hovering a name draws SVG branch lines to the left with up to 3 PR cards showing the repo name, PR number, and title.

To trigger it manually: **Actions → Fetch PR Data → Run workflow**.

## Workflows

| Workflow            | Schedule          | Purpose                                                                        |
| ------------------- | ----------------- | ------------------------------------------------------------------------------ |
| `deploy.yml`        | On push to `main` | Builds and deploys to GitHub Pages, injects secrets, stamps git SHA as version |
| `fetch-pr-data.yml` | Mon–Fri 13:00 UTC | Pre-fetches recent PRs for each participant into the Gist                      |
