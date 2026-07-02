# Daily Dev — Standup Order Randomizer

A lightweight GitHub Pages tool for daily standups. Shuffles participants, shows the presentation order, runs a session timer, and displays each person's recent PRs on hover.

## Features

- Random shuffle (Fisher-Yates) on each session start
- Live session timer
- Drag-and-drop reordering after shuffle
- VS Code-styled code bubble showing the shuffle algorithm
- **PR branch hover** — hover a participant name to see up to 3 recent merged PR cards fanned out to the left, each with its own animated branch line showing `branch → base`; displays PR body text or falls back to commit message headlines when no body is written; data is pre-fetched daily by a scheduled workflow

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

All sensitive config is kept in GitHub Actions secrets (**Settings → Secrets and variables → Actions**):

| Secret              | Description                                                                           | Example                                                               |
| ------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `PARTICIPANTS_JSON` | JSON array of `{name, github}` objects — injected as `participants.js` at deploy time | `[{"name":"Alice","github":"alice-gh"},{"name":"Bob","github":null}]` |
| `GH_SEARCH_SCOPE`   | GitHub search scope for PR fetching — space-separated `org:` and/or `repo:` filters   | `org:my-org org:another-org`                                          |
| `PRIMARY_COLOR`     | Hex colour for the theme                                                              | `#0c3ff7`                                                             |
| `FAVICON_URL`       | URL or relative path to the favicon                                                   | `./assets/favicon.ico`                                                |
| `GIST_ID`           | ID of the GitHub Gist used to cache pre-fetched data (the hash in the Gist URL)       | `a1b2c3d4e5f6...`                                                     |
| `GIST_PAT`          | PAT with `gist` write scope — lets the workflows update the Gist                      | `github_pat_...`                                                      |
| `GH_TOKEN`          | PAT with `repo` read scope — used to search merged PRs in private repos               | `ghp_...`                                                             |

## PR hover feature

A scheduled workflow (`.github/workflows/fetch-pr-data.yml`) runs Monday–Friday at 05:23 UTC. It uses the GitHub GraphQL API to fetch each participant's 3 most recent merged PRs — title, body, branch name, target branch, and the last 5 commit message headlines. If a PR has no body, the commit headlines are joined and used as the description instead. Results are saved as `pr-data.json` in the Gist.

The page fetches `pr-data.json` silently on load. Hovering a name shows up to 3 PR cards fanned to the left of the list, each connected by its own animated branch line. Cards appear staggered after the lines finish drawing. Each card shows the repo name, `branch → target`, PR number and title, and body (or commit headlines as fallback).

For **local preview without a Gist**, `pr-data.example.js` is loaded automatically when no `gistId` is configured and provides mock data matching the example participants.

To trigger it manually: **Actions → Fetch PR Data → Run workflow**.

## Workflows

| Workflow            | Schedule          | Purpose                                                                        |
| ------------------- | ----------------- | ------------------------------------------------------------------------------ |
| `deploy.yml`        | On push to `main` | Builds and deploys to GitHub Pages, injects secrets, stamps git SHA as version |
| `fetch-pr-data.yml` | Mon–Fri 05:23 UTC | Pre-fetches merged PRs for each participant into the Gist                      |
