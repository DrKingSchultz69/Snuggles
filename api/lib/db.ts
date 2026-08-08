import { neon } from '@neondatabase/serverless';

type Sql = ReturnType<typeof neon>;

// Initialized lazily rather than at module load: neon() throws when
// DATABASE_URL is missing, and this module gets imported during the build
// (and by scripts) before env vars are necessarily present. A plain
// module-level `let` is used instead of a Proxy wrapper, which breaks
// libraries that introspect the client object.
let sql: Sql | null = null;

export function getSql(): Sql {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL is not set');
    }
    sql = neon(url);
  }
  return sql;
}

// True when a database is configured. The checkout flow uses this so the
// store keeps taking orders (email notification only, as before) if the
// database is ever unreachable or unconfigured.
export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
