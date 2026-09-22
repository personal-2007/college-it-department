# Student Module Report

## Student Features

- Student dashboard now reads real Supabase metrics for attempts, average score, best score, completed tests, and recent results.
- Student quick actions route to actual student pages for dashboard, results, history, materials, announcements, and profile.
- Student profile page reads and updates the authenticated user profile from the `profiles` table.
- Student results page calculates totals directly from `test_attempts` data.
- Student announcements page reads published student-targeted announcements from the `announcements` table.

## MCQ Features

- The MCQ listing pulls test records from Supabase with filters applied at the database query layer.
- The test flow uses the existing `tests` and `test_questions` tables.
- The test page keeps selected answers and time remaining in local storage so refreshes restore progress where possible.
- Submission uses the existing Supabase RPC `submit_test_attempt` to persist attempts and answers.

## Database Tables

- `profiles`
- `tests`
- `test_questions`
- `test_attempts`
- `test_answers`
- `study_materials`
- `announcements`

## Authentication

- Student authentication remains Supabase Auth based.
- Student-only routes are guarded with the role-protected route logic.

## RLS

- Access is restricted by existing RLS policies on the tables used by students.
- The app does not disable RLS.

## Test Flow

- Login -> Student dashboard -> MCQ list -> Test instructions -> Test page -> Submit -> Result page -> History

## Result Flow

- Submission persists to `test_attempts` and `test_answers` via the existing SQL RPC.
- Student result pages read the saved records back from Supabase.

## Storage

- Study-material metadata is read from `study_materials`.
- File URLs can be persisted in the same table when uploaded to Supabase Storage.

## Build Status

- Local production build passes.

## Remaining Issues

- Full remote database verification (live student login, seeded records, and exact RLS behavior) requires direct access to the actual Supabase project and dashboard.
- If the `announcements` table is not yet created in the remote project, the migration file under `supabase/migrations` should be run from the Supabase dashboard or CLI.
