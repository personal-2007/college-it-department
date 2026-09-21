create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'faculty', 'admin');
create type public.question_difficulty as enum ('Easy', 'Medium', 'Hard', 'Mixed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  register_number text unique not null,
  email text not null,
  role public.app_role not null default 'student',
  department text not null default 'Information Technology',
  year text not null default '1st Year',
  semester text not null default 'Semester 1',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text not null,
  explanation text not null default '',
  year text not null,
  semester text not null,
  subject text not null,
  unit text not null default 'Unit 1',
  difficulty public.question_difficulty not null default 'Medium',
  marks integer not null default 1 check (marks > 0),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text not null,
  semester text not null,
  subject text not null,
  unit text not null default 'Unit 1',
  difficulty public.question_difficulty not null default 'Mixed',
  duration integer not null default 30 check (duration > 0),
  total_questions integer not null default 0 check (total_questions >= 0),
  total_marks integer not null default 0 check (total_marks >= 0),
  passing_marks integer not null default 0 check (passing_marks >= 0),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  question_order integer not null default 0,
  unique (test_id, question_id)
);

create table public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  test_id uuid not null references public.tests(id) on delete restrict,
  score integer not null default 0,
  total_marks integer not null default 0,
  percentage integer not null default 0 check (percentage between 0 and 100),
  correct_answers integer not null default 0,
  wrong_answers integer not null default 0,
  unanswered integer not null default 0,
  time_taken text not null default '00:00',
  started_at timestamptz not null default now(),
  submitted_at timestamptz not null default now()
);

create table public.test_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete restrict,
  selected_answer text not null default '',
  correct_answer text not null,
  is_correct boolean not null default false,
  is_marked boolean not null default false,
  created_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create table public.faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text,
  department text,
  qualification text,
  specialization text,
  email text,
  phone text,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date,
  image_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.study_materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_path text,
  file_url text,
  subject text,
  year text,
  semester text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index questions_filters_idx on public.questions (year, semester, subject, unit, difficulty);
create index attempts_student_idx on public.test_attempts (student_id, submitted_at desc);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create or replace function public.is_faculty_or_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('faculty', 'admin')) $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, register_number, email, department, year, semester)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'register_number', new.email),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'department', 'Information Technology'),
    coalesce(new.raw_user_meta_data ->> 'year', '1st Year'),
    coalesce(new.raw_user_meta_data ->> 'semester', 'Semester 1')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.submit_test_attempt(
  p_test_id uuid,
  p_answers jsonb,
  p_time_taken text
)
returns jsonb language plpgsql security definer set search_path = public
as $$
declare
  v_attempt public.test_attempts;
  v_total integer;
  v_score integer := 0;
  v_correct integer := 0;
  v_wrong integer := 0;
  v_unanswered integer := 0;
  v_question record;
  v_answer jsonb;
  v_selected text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select count(*) into v_total from public.test_questions where test_id = p_test_id;
  if v_total = 0 then raise exception 'Test has no questions'; end if;

  insert into public.test_attempts (student_id, test_id, total_marks, unanswered, time_taken)
  values (auth.uid(), p_test_id, v_total, v_total, coalesce(p_time_taken, '00:00'))
  returning * into v_attempt;

  for v_question in
    select q.id, q.correct_answer from public.test_questions tq join public.questions q on q.id = tq.question_id where tq.test_id = p_test_id order by tq.question_order, tq.id
  loop
    select value into v_answer from jsonb_array_elements(coalesce(p_answers, '[]'::jsonb)) where value ->> 'questionId' = v_question.id::text limit 1;
    v_selected := coalesce(v_answer ->> 'selectedOption', '');
    if v_selected = '' then v_unanswered := v_unanswered + 1;
    elsif v_selected = v_question.correct_answer then v_score := v_score + 1; v_correct := v_correct + 1;
    else v_wrong := v_wrong + 1;
    end if;
    insert into public.test_answers (attempt_id, question_id, selected_answer, correct_answer, is_correct, is_marked)
    values (v_attempt.id, v_question.id, v_selected, v_question.correct_answer, v_selected <> '' and v_selected = v_question.correct_answer, coalesce((v_answer ->> 'isMarked')::boolean, false));
  end loop;

  update public.test_attempts set score = v_score, correct_answers = v_correct, wrong_answers = v_wrong, unanswered = v_unanswered, percentage = round((v_score::numeric / v_total) * 100), submitted_at = now() where id = v_attempt.id returning * into v_attempt;
  return to_jsonb(v_attempt);
end;
$$;

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.test_attempts enable row level security;
alter table public.test_answers enable row level security;
alter table public.faculty enable row level security;
alter table public.events enable row level security;
alter table public.study_materials enable row level security;

create policy profiles_read_own on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = 'student');
create policy profiles_update_admin on public.profiles for update using (public.is_admin()) with check (public.is_admin());
create policy questions_read_authenticated on public.questions for select using (auth.uid() is not null);
create policy questions_manage_staff on public.questions for all using (public.is_faculty_or_admin()) with check (public.is_faculty_or_admin());
create policy tests_read_authenticated on public.tests for select using (auth.uid() is not null);
create policy tests_manage_staff on public.tests for all using (public.is_faculty_or_admin()) with check (public.is_faculty_or_admin());
create policy test_questions_read_authenticated on public.test_questions for select using (auth.uid() is not null);
create policy test_questions_manage_staff on public.test_questions for all using (public.is_faculty_or_admin()) with check (public.is_faculty_or_admin());
create policy attempts_read_own on public.test_attempts for select using (student_id = auth.uid() or public.is_admin() or public.is_faculty_or_admin());
create policy answers_read_own on public.test_answers for select using (exists (select 1 from public.test_attempts a where a.id = attempt_id and (a.student_id = auth.uid() or public.is_admin() or public.is_faculty_or_admin())));
create policy faculty_read_authenticated on public.faculty for select using (auth.uid() is not null);
create policy faculty_manage_admin on public.faculty for all using (public.is_admin()) with check (public.is_admin());
create policy events_read_authenticated on public.events for select using (auth.uid() is not null);
create policy events_manage_admin on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy materials_read_authenticated on public.study_materials for select using (auth.uid() is not null);
create policy materials_manage_staff on public.study_materials for all using (public.is_faculty_or_admin()) with check (public.is_faculty_or_admin());

grant execute on function public.submit_test_attempt(uuid, jsonb, text) to authenticated;
