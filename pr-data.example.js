if (!window.PR_DATA_EXAMPLE) {
  window.PR_DATA_EXAMPLE = {
    updatedAt: "2026-07-02T05:23:00Z",
    _roles: { Carol: "support" },
    Alice: [
      { title: "Add user authentication flow",         number: 142, repo: "my-app",      branch: "feat/user-auth",              baseBranch: "main",    body: "Implements JWT-based auth with refresh tokens. Added login, refresh, and logout endpoints. Closes #140 from sprint 12." },
      { title: "Fix session timeout on mobile Safari", number: 138, repo: "my-app",      branch: "fix/safari-session-timeout",   baseBranch: "main",    body: "Sessions were not expiring correctly on mobile Safari. Added explicit timeout check on each request interceptor." },
      { title: "Update API rate limiting docs",        number: 135, repo: "backend-api", branch: "docs/rate-limiting",           baseBranch: "main",    body: "" }
    ],
    Bob: [
      { title: "Refactor database connection pool",  number: 97, repo: "backend-api", branch: "refactor/db-pool",    baseBranch: "main", body: "Replaces the old pg connection pool with a more resilient implementation that handles dropped connections and reconnects automatically." },
      { title: "Add composite index to users table", number: 94, repo: "backend-api", branch: "perf/users-index",    baseBranch: "main", body: "Query time on user lookup dropped from 340ms to 12ms after adding index on email + created_at." }
    ],
    Carol: [
      { title: "Add user authentication flow",      number: 142, repo: "my-app",      branch: "feat/user-auth",           baseBranch: "main",    body: "Verified login, logout and token refresh on staging. All acceptance criteria pass, tested on Chrome and mobile Safari." },
      { title: "Refactor database connection pool", number: 97,  repo: "backend-api", branch: "refactor/db-pool",        baseBranch: "main",    body: "Load tested with 50 concurrent connections on staging. No dropped connections or regressions found." },
      { title: "Redesign dashboard layout",         number: 211, repo: "frontend",    branch: "feat/dashboard-redesign",  baseBranch: "develop", body: "" }
    ]
  };
}
