# MongoDB to Supabase Migration Report

Date: 2026-09-21

## Previous Architecture

The repository previously described a React client with an Express/Mongoose API and custom authentication. No active implementation of that architecture remains in the current workspace.

## New Architecture

The application uses React + Vite with one browser Supabase client, Supabase Auth, PostgreSQL, RLS, and a database scoring RPC. There is no active Express or MongoDB runtime.

## MongoDB Components Removed

- No Mongoose or MongoDB dependency is present in either package manifest.
- No MongoDB connection, model, repository, controller, route, seed, or environment variable remains in active code.
- Search results contain only historical words in this report.

## Supabase Tables Used

The remote project was inspected and contains the checked-in tables: `profiles`, `questions`, `tests`, `test_questions`, `test_attempts`, `test_answers`, `faculty`, `events`, and `study_materials`. The project currently reports zero application rows.

## Supabase Auth

Registration, password login, session restoration, auth-state changes, logout, current-user profile loading, password reset email, and password update use Supabase Auth. Passwords are not stored in application tables.

## RLS Policies

RLS is enabled on every application table. Students read their own attempts, faculty/admin roles manage authorized assessment data, and admins manage faculty/events. Student question delivery uses the authenticated `get_student_test_questions` RPC and never returns `correct_answer`; `submit_test_attempt` calculates and persists results in PostgreSQL.

The Supabase security advisor still reports warnings for authenticated access to intentionally guarded `SECURITY DEFINER` functions. Anonymous execution was revoked. These functions are required for trigger/profile creation, role checks inside RLS, server-side scoring, and answer-key-free question delivery.

## Storage

No existing UI workflow uploads files, so Supabase Storage is not currently required. Study-material records support stored URLs and metadata.

## Authentication Flow

Unauthenticated users are sent to `/login`. Authenticated profiles route by the `student`, `faculty`, or `admin` role. Protected routes enforce those roles in the client, while database policies enforce access server-side.

## MCQ Database Flow

Students select database-backed tests, receive answer-key-free questions, submit answers, and receive a result calculated by PostgreSQL. Attempts and per-question answers are persisted in `test_attempts` and `test_answers`.

## Student Dashboard

Dashboard statistics and history use real `test_attempts` data and show empty states when no rows exist.

## Faculty Dashboard

Faculty metrics, question management, test generation, and result listing use Supabase services and existing RLS policies.

## Admin Dashboard

Admin statistics, question CRUD, test generation/deletion, faculty CRUD, events CRUD, materials CRUD, and attempt listing use Supabase services and existing RLS policies.

## Environment Variables

The Vite project root is `client/`. Configure these in `client/.env` or `client/.env.local`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The sanitized template is `client/.env.example`; local env files are ignored by Git. No service-role key is used in browser code.

## Dependencies Removed

No MongoDB-related dependency remains. Supabase is provided by `@supabase/supabase-js`.

## Build Result

`npm run build` passes. Vite reports only the existing large-bundle advisory.

## Tests Performed

- Inspected remote tables, columns, relationships, RLS status, migrations, and security advisories.
- Applied and verified four non-destructive Supabase migrations.
- Confirmed the Vite development server serves the app and the browser reaches the login route without the missing-env error.
- Searched active project files for MongoDB, Mongoose, service-role keys, and mock production data.
- Ran `npm run build` successfully.

## Remaining Issues

- Live registration/login, role routing, CRUD persistence, and test submission require seeded Supabase users/data. The inspected project has zero application rows, so those flows cannot be honestly marked end-to-end verified here.
- `npm run lint` remains unavailable because the repository has no ESLint configuration file.
- Supabase Storage is not required by the current UI and has not been provisioned.
