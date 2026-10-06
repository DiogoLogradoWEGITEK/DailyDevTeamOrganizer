// Example members — the default list for local preview and Pages fallback.
// Loaded after participants.js: on the deployed site the workflow overwrites
// participants.js with the real team and config.js points at the real Gist,
// so this list only shows when no Gist is configured (local file:// preview)
// or when the deploy had no PARTICIPANTS_JSON secret.
//
// Supported fields:
//   name   — display name shown in the standup list
//   github — GitHub handle used to fetch PR/review data (null to disable)
//   role   — "dev" (default) or "support"
//             dev:     queries PRs they authored and merged
//             support: queries PRs labelled `qa-approved` they commented on (requires Matrix integration)
window.PARTICIPANTS_EXAMPLE = [
  { name: "Alice", github: "alice-dev" },
  { name: "Bob", github: "bob-dev" },
  { name: "Carol", github: "carol-dev", role: "support" }
];

if (!window.PARTICIPANTS) {
  window.PARTICIPANTS = window.PARTICIPANTS_EXAMPLE;
}
