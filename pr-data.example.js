if (!window.PR_DATA_EXAMPLE) {
  window.PR_DATA_EXAMPLE = {
    updatedAt: "2026-06-24T05:23:00Z",
    Alice: [
      { title: "Add user authentication flow", number: 142, repo: "my-app", body: "Implements JWT-based auth with refresh tokens. Added login, refresh, and logout endpoints. Closes #140 from sprint 12." },
      { title: "Fix session timeout on mobile Safari", number: 138, repo: "my-app", body: "Sessions were not expiring correctly on mobile Safari. Added explicit timeout check on each request interceptor." },
      { title: "Update API rate limiting docs", number: 135, repo: "backend-api", body: "" }
    ],
    Bob: [
      { title: "Refactor database connection pool", number: 97, repo: "backend-api", body: "Replaces the old pg connection pool with a more resilient implementation that handles dropped connections and reconnects automatically." },
      { title: "Add composite index to users table", number: 94, repo: "backend-api", body: "Query time on user lookup dropped from 340ms to 12ms after adding index on email + created_at." }
    ],
    Carol: [
      { title: "Redesign dashboard layout", number: 211, repo: "frontend", body: "New responsive grid with collapsible sidebar. Tested on Chrome, Firefox, and Safari. Resolves all feedback from last design review." },
      { title: "Dark mode support", number: 208, repo: "frontend", body: "Adds prefers-color-scheme media query support and a manual toggle stored in localStorage." },
      { title: "Lazy load chart components", number: 204, repo: "frontend", body: "" }
    ]
  };
}
