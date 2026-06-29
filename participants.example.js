// Fallback example data. Loaded after participants.js — only sets PARTICIPANTS
// if the real file wasn't available (e.g. on GitHub Pages without Actions injection).
//
// Supported fields:
//   name   — display name shown in the standup list
//   github — GitHub handle used to fetch PR/review data (null to disable)
//   role   — "dev" (default) or "support"
//             dev:     queries PRs they authored and merged
//             support: queries PRs labelled `qa-approved` they commented on (requires Matrix integration)
if (!window.PARTICIPANTS) {
  window.PARTICIPANTS = [
    { name: "Alice", github: "alice-dev" },
    { name: "Bob", github: "bob-dev" },
    { name: "Carol", github: "carol-dev", role: "support" }
  ];
}
