// Fallback example data. Loaded after participants.js — only sets PARTICIPANTS
// if the real file wasn't available (e.g. on GitHub Pages without Actions injection).
if (!window.PARTICIPANTS) {
  window.PARTICIPANTS = [
    "Alice",
    "Bob",
    "Carol"
  ];
}
