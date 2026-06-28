# Database Backend Migration: MySQL → Supabase (PostgreSQL)

## Goal

Rewire the application's database backend from MySQL to a fresh Supabase (PostgreSQL) database while keeping Drizzle ORM and minimizing code changes. No existing data migration is required.

## Context

The project currently uses:

- `drizzle-orm` with `drizzle-orm/mysql-core` schema definitions.
- `mysql2` driver via `drizzle-orm/mysql2` in `api/queries/connection.ts` with `mode: "planetscale"`.
- `drizzle-kit` configured with `dialect: "mysql"`.
- A single `DATABASE_URL` environment variable for the connection string.

## Decision Log

| Decision                    | Choice                                  | Rationale                                                                                                |
| --------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| ORM / client                | Keep Drizzle ORM + `postgres-js` driver | Smallest refactor; existing query code remains valid.                                                    |
| Data migration              | None (fresh Supabase DB)                | Explicitly scoped out by user.                                                                           |
| PK strategy                 | Keep `serial` auto-increment integers   | Minimal change; avoids rewriting FK relationships.                                                       |
| MySQL `bigint unsigned` FKs | Map to `integer`                        | Postgres `integer` is sufficient for expected table sizes and avoids `bigint` JSON serialization issues. |
| MySQL `tinyint`             | Map to `boolean`                        | Postgres native boolean type.                                                                            |

## Schema Changes (`db/schema.ts`)

1. Replace import source:
   - From: `drizzle-orm/mysql-core`
   - To: `drizzle-orm/pg-core`
2. Replace table builder:
   - `mysqlTable` → `pgTable`
3. Replace enum builder:
   - `mysqlEnum` → `pgEnum` (declare enums at module level as required by Drizzle pg-core)
4. Replace foreign-key column types:
   - `bigint("x", { mode: "number", unsigned: true })` → `integer("x")`
5. Replace boolean column type:
   - `tinyint("cancelAtPeriodEnd")` → `boolean("cancelAtPeriodEnd").default(false)`
6. Keep `serial("id").primaryKey()` for primary keys.
7. Keep `timestamp("...").defaultNow()` and `.$onUpdate(() => new Date())` usage.

`db/relations.ts` does not require changes because Drizzle `relations` is dialect-agnostic.

## Connection Changes (`api/queries/connection.ts`)

1. Replace driver import:
   - From: `drizzle-orm/mysql2`
   - To: `drizzle-orm/postgres-js`
2. Import `postgres` from the `postgres` package.
3. Initialize client:
   - `const client = postgres(env.databaseUrl);`
   - `instance = drizzle(client, { schema: fullSchema });`
4. Remove `mode: "planetscale"`.

## Drizzle Kit Config (`drizzle.config.ts`)

- Change `dialect: "mysql"` to `dialect: "postgresql"`.
- Keep `schema`, `out`, and `dbCredentials.url` unchanged.

## Dependency Changes (`package.json`)

- Remove: `mysql2`
- Add: `postgres` (`^3.4.5` or latest compatible version)

Run `npm install` after updating `package.json`.

## Environment Variables

Update `.env.example`:

```bash
# ── Database ───────────────────────────────────────────────────
DATABASE_URL=             # Supabase Postgres connection string (postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres)
```

Also update the comment in the existing `.env` file to match. Do **not** overwrite the actual `DATABASE_URL` value because the Supabase credentials are not known in this migration step; only the descriptive comment is changed.

A placeholder `SUPABASE_ANON_KEY=` is **not** required for the Drizzle path, but can be added if future Supabase client integration is anticipated. It is out of scope for this migration.

## Scripts and Seed

- `db:generate`, `db:migrate`, and `db:push` scripts remain valid.
- Update the comment in `db/seed.ts` from "close MySQL connection pool" to "close Postgres connection".

## Testing Plan

1. `npm install` to update dependencies.
2. `npm run check` to verify TypeScript compilation.
3. Configure a real Supabase project and set `DATABASE_URL`.
4. `npm run db:push` to create tables in Supabase.
5. Run the application locally and exercise database-dependent features.

## Risks

- Postgres enums are stricter than MySQL enums; ensure enum values in code match declared enum names.
- Any MySQL-specific SQL or raw queries elsewhere in the codebase must be converted to Postgres syntax. A pre-implementation grep for `mysql2`, raw SQL strings, and `mysqlTable`/`mysqlEnum` will catch these.
- Foreign-key columns changing from `bigint unsigned` to `integer` alter the generated TypeScript types (`number` remains the same in this case, so consumers are unaffected).
