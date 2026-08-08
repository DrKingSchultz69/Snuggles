/**
 * Applies api/db/schema.sql to the database in DATABASE_URL.
 *
 * Run with `npm run db:migrate`. The schema is written to be idempotent, so
 * re-running this is safe and is how schema changes get applied.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

// tsx does not load env files on its own, and the Neon connection string
// lives in .env.local (written by `vercel env pull`) while the older secrets
// live in .env. dotenv never overwrites an already-set key, so loading
// .env.local first gives it precedence.
dotenv.config({ path: '.env.local' });
dotenv.config();

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(here, '../api/db/schema.sql');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Run `vercel env pull .env.local --yes` first.');
  process.exit(1);
}

// The Neon HTTP driver sends one statement per request, so the file is split
// into individual statements. Line comments are stripped first so that a
// trailing `--` comment can't swallow the following statement.
const statements = readFileSync(schemaPath, 'utf8')
  .split('\n')
  .map((line) => line.replace(/--.*$/, ''))
  .join('\n')
  .split(';')
  .map((statement) => statement.trim())
  .filter(Boolean);

const sql = neon(databaseUrl);

let applied = 0;
for (const statement of statements) {
  try {
    await sql.query(statement);
    applied += 1;
  } catch (error) {
    console.error(`\nFailed on statement:\n${statement}\n`);
    throw error;
  }
}

console.log(`Schema applied (${applied} statement${applied === 1 ? '' : 's'}).`);
