# Daily Dev — Standup Order Randomizer

A lightweight GitHub Pages tool for daily standups. Shuffles participants, shows the presentation order, runs a session timer, and displays each person's recent PRs on hover.

## Features

- Random shuffle (Fisher-Yates) on each session start
- Live session timer
- Drag-and-drop reordering after shuffle
- Fits the browser window: top bar with logo, session timer and Reroll; numbered order on the left; the current speaker's work fills the rest
- **Speaker view** — clicking a name (or `↑`/`↓`) shows that person's recent PRs: repo, PR number, title, `branch → base` and the full description. Text scales with the screen and the amount of content (bigger for short PRs, a bit smaller for long ones) and scrolls if it still doesn't fit. People who already spoke fade in the list. Hover previews, `Esc` clears
- Displays PR body text or falls back to commit subject lines when no body is written; data is pre-fetched daily by a scheduled workflow and shown in full (`prBodyMaxChars` in `CONFIG` sets an optional display cap). The sidebar shows how old the PR data is

## Local preview

Open `index.html` in a browser — no server needed. With no Gist configured (the `GIST_ID` secret is only injected on the deployed Pages site), the page automatically shows the example members (Alice, Bob, Carol) with the example PR data from `pr-data.example.js`, so local preview never mixes real team names with mock PRs.

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

| Secret | Description | Example |
| --- | --- | --- |
| `PARTICIPANTS_JSON` | Participants array — injected as `participants.js` at deploy time. Accepts strict JSON, a JS-style array (as in `participants.js`), or the whole `participants.js` file content | `[{"name":"Alice","github":"alice-gh"},{"name":"Bob","github":null}]` |
| `GH_SEARCH_SCOPE` | GitHub search scope for PR fetching — space-separated `org:` and/or `repo:` filters | `org:my-org org:another-org` |
| `PRIMARY_COLOR` | Hex colour for the theme | `#0c3ff7` |
| `FAVICON_URL` | URL or relative path to the favicon | `./assets/favicon.ico` |
| `GIST_ID` | ID of the GitHub Gist used to cache pre-fetched data (the hash in the Gist URL). The page reads it anonymously; no PAT is needed client-side | `a1b2c3d4e5f6...` |
| `GH_TOKEN` | PAT with `repo` + `gist` scopes — the only credential: searches merged PRs in private repos and lets the workflow update the Gist | `ghp_...` |

## PR hover feature

A scheduled workflow (`.github/workflows/fetch-pr-data.yml`) is set for Monday–Friday at 13:23 UTC with a small random jitter. GitHub starts scheduled jobs late (usually in the evening UTC), so the daily shows the data fetched the evening before. It uses the GitHub GraphQL API to fetch each participant's 3 most recent merged PRs — title, body, branch name, target branch, and the last 5 commit messages. Bodies are stored in full, with markdown symbols and `<!-- -->` template comments stripped. If a PR has no body, the full first line of each commit message is joined and used as the description instead. Results are saved as `pr-data.json` in the Gist.

The page fetches `pr-data.json` silently on load. Click a name to show their work on the right — it stays up (no mouse needed) until you click again or pick someone else. Hovering a name still gives a quick preview. Each card shows the repo name, PR number, title, `branch → base` and the full body text (or commit subject lines as fallback).

For **local preview without a Gist**, `pr-data.example.js` is loaded automatically when no `gistId` is configured and provides mock data matching the example participants.

To trigger it manually: **Actions → Fetch PR Data → Run workflow**. The run first checks `GH_TOKEN` (valid, `repo` + `gist` scopes, owns the Gist, expiry) and fails with a readable reason if something is off. If every PR search fails, the Gist is left untouched so the page keeps the last good data.

## Workflows

| Workflow | Schedule | Purpose |
| --- | --- | --- |
| `deploy.yml` | On push to `main` | Builds and deploys to GitHub Pages, injects secrets, stamps git SHA as version |
| `fetch-pr-data.yml` | Mon–Fri, set for 13:23 UTC (runs late, usually evening) | Pre-fetches merged PRs for each participant into the Gist |
