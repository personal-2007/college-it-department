# MongoDB to Supabase Migration Report

Date: 2026-09-21

## Before

The application used a React client, an Express API, Mongoose models, custom JWT authentication, and a local database connection.

## After

The application now targets a direct React/Vite to Supabase architecture:

- Supabase Auth manages sessions and passwords.
- `profiles` stores application roles and academic profile data.
- PostgreSQL tables store questions, tests, test relationships, attempts, answers, faculty, events, and study materials.
- RLS policies enforce authenticated and role-based access.
- `submit_test_attempt` calculates and persists results in PostgreSQL.

## Migrated

- Authentication: `supabase.auth.signUp`, `signInWithPassword`, `getSession`, `onAuthStateChange`, and `signOut`.
- Profiles: `profiles` queried by the authenticated user ID.
- Questions: Supabase select/insert/update/delete service functions.
- Tests: relational `tests`, `test_questions`, and `questions` queries.
- Results: `test_attempts`, `test_answers`, and the scoring RPC.
- Student dashboard/history: Supabase attempt queries and computed statistics.
- Admin dashboard: Supabase count and score queries.
- Admin question management: Supabase CRUD UI.

## Removed

- The obsolete API client boundary.
- Express/Mongoose backend source and package metadata.
- Custom JWT middleware, Mongoose models, database connection, and seed runner.
- Mongo-specific environment configuration.

## Verification

- Supabase client: PASS by build/import validation; live endpoint reachable.
- Supabase Auth: CODE MIGRATED; live credentials and email configuration were not available for an end-to-end sign-in.
- PostgreSQL: BLOCKED; the live `profiles` probe returned `PGRST205` because the migration has not been applied in the project.
- RLS: POLICIES PROVIDED in the migration; live policy tests require applying the migration.
- Storage: NOT USED by the current UI; no upload workflow existed to migrate.
- Client build: PASS (`npm run build`).
- MongoDB references in active application code: expected zero after cleanup; documentation uses no legacy database instructions.

## Remaining Required Step

Apply the SQL migration in the Supabase dashboard, then run the browser flow with a real test account. The migration cannot be applied using the publishable browser key, and no unmasked server secret or database password was used.
