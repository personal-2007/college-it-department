# Admin Features Report

## Implemented Features

- Admin dashboard metrics sourced from Supabase profile and assessment tables.
- Admin-only route gating remains enforced through the authenticated user role and protected route wrapper.
- Question management, test management, faculty management, event management, and study-material management are connected to Supabase CRUD calls.
- Student results listing reads from the `test_attempts` table joined with related profile/test data.
- Existing admin pages preserve the current ITCore UI and styling while using actual database-backed data.

## Database Tables Used

- `profiles`
- `questions`
- `tests`
- `test_questions`
- `test_attempts`
- `test_answers`
- `faculty`
- `events`
- `study_materials`

## RLS Policies

The database uses Supabase RLS policies already defined in the project migrations. These policies restrict access by authenticated user, faculty/admin role, and admin-only management for privileged tables.

## Storage Buckets

No active file-upload workflow currently requires a bucket beyond the existing metadata-based materials/event design. The project keeps file URLs in relational tables and does not create unnecessary storage buckets.

## CRUD Operations

- Questions: read/write/delete via `supabase.from('questions')`
- Tests: read/write/delete via `supabase.from('tests')`
- Student attempts: read via `supabase.from('test_attempts')`
- Faculty: read/write/delete via `supabase.from('faculty')`
- Events: read/write/delete via `supabase.from('events')`
- Study materials: read/write/delete via `supabase.from('study_materials')`

## Authentication

- Supabase Auth is used for login and session restoration.
- `profiles` holds user metadata such as role and academic details.
- The admin account is expected to be seeded in Supabase Auth as `admin@itcore.com` with the `admin` role metadata, without hardcoding credentials in the frontend.

## Authorization

- The frontend route protection is enforced by `ProtectedRoute` and `allowedRoles`.
- The database enforces role-based access through RLS policies, not only UI checks.

## Remaining Issues

- Full multi-page admin CRUD surfaces (students/faculty/admin/user management, analytics, audit logs, gallery management) are not yet fully expanded beyond the current app structure.
- Some admin functionality remains scoped to the existing project architecture rather than a complete new management suite.
- Live credentials and remote database state must be verified in the Supabase project itself.

## Build Status

- Local Vite production build passes.
- No active MongoDB implementation remains in the current app code.
- The environment now uses `VITE_SUPABASE_PUBLISHABLE_KEY` instead of the old anon-key variable.
