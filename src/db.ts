import { execSync } from "node:child_process";

/**
 * Server-only database helper using the team's shared Turso/SQLite database.
 * Each call runs `team-db` which syncs automatically.
 *
 * Use it only inside a `createServerFn()` handler or an `src/routes/api/*` route
 * (never client code).
 *
 * Example:
 *   const getPosts = createServerFn().handler(async () => {
 *     const rows = execute("SELECT id, title, created_at FROM posts");
 *     return rows.map((r) => ({ ...r, created_at: String(r.created_at) }));
 *   });
 */
export function execute(sql: string, params: (string | number)[] = []) {
  // Build a safe SQL statement by replacing ? placeholders
  let safeSql = sql;
  for (const p of params) {
    const val = typeof p === "number" ? String(p) : `'${p.replace(/'/g, "''")}'`;
    safeSql = safeSql.replace("?", val);
  }

  const result = execSync(`team-db "${safeSql.replace(/"/g, '\\"')}"`, {
    encoding: "utf-8",
    maxBuffer: 10 * 1024 * 1024,
  });

  try {
    return JSON.parse(result.trim());
  } catch {
    return [];
  }
}