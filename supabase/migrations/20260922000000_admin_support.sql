create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  description text default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.departments(id) on delete set null,
  name text not null,
  code text not null unique,
  year text not null default '1st Year',
  semester text not null default 'Semester 1',
  credits integer not null default 3 check (credits >= 0),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  audience text not null default 'All',
  priority text not null default 'Normal',
  is_published boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null default '',
  description text default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  status text not null default 'pending',
  notes text default '',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create index if not exists departments_name_idx on public.departments(name);
create index if not exists subjects_department_idx on public.subjects(department_id, year, semester);
create index if not exists announcements_audience_idx on public.announcements(audience, is_published, created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity, created_at desc);
create index if not exists approvals_status_idx on public.approvals(status, created_at desc);

alter table public.departments enable row level security;
alter table public.subjects enable row level security;
alter table public.announcements enable row level security;
alter table public.app_settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.approvals enable row level security;

create policy departments_read_authenticated on public.departments for select using (auth.uid() is not null);
create policy departments_manage_admin on public.departments for all using (public.is_admin()) with check (public.is_admin());

create policy subjects_read_authenticated on public.subjects for select using (auth.uid() is not null);
create policy subjects_manage_admin on public.subjects for all using (public.is_admin()) with check (public.is_admin());

create policy announcements_read_authenticated on public.announcements for select using (auth.uid() is not null);
create policy announcements_manage_admin on public.announcements for all using (public.is_admin()) with check (public.is_admin());

create policy settings_read_authenticated on public.app_settings for select using (auth.uid() is not null);
create policy settings_manage_admin on public.app_settings for all using (public.is_admin()) with check (public.is_admin());

create policy audit_logs_read_admin on public.audit_logs for select using (public.is_admin());
create policy audit_logs_insert_admin on public.audit_logs for insert with check (public.is_admin());

create policy approvals_read_admin on public.approvals for select using (public.is_admin() or user_id = auth.uid());
create policy approvals_manage_admin on public.approvals for all using (public.is_admin()) with check (public.is_admin());

insert into public.app_settings (key, value, description)
values
  ('college_name', 'ITCore Department', 'College or department display name'),
  ('department_name', 'Information Technology', 'Primary academic department label'),
  ('academic_year', '2026-2027', 'Current academic year'),
  ('default_test_duration', '30', 'Default test duration in minutes'),
  ('default_passing_percentage', '50', 'Default passing percentage for quizzes')
on conflict (key) do nothing;

insert into storage.buckets (id, name, public)
values ('itcore-storage', 'itcore-storage', true)
on conflict (id) do nothing;
