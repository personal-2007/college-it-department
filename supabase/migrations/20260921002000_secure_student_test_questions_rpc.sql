drop view if exists public.student_test_questions;

create or replace function public.get_student_test_questions(p_test_ids uuid[])
returns table (
  test_id uuid,
  question_id uuid,
  question_order integer,
  question text,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  year text,
  semester text,
  subject text,
  unit text,
  difficulty public.question_difficulty,
  marks integer
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  return query
  select
    tq.test_id,
    tq.question_id,
    tq.question_order,
    q.question,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.year,
    q.semester,
    q.subject,
    q.unit,
    q.difficulty,
    q.marks
  from public.test_questions tq
  join public.questions q on q.id = tq.question_id
  where tq.test_id = any(p_test_ids)
  order by tq.test_id, tq.question_order, tq.id;
end;
$$;

revoke all on function public.get_student_test_questions(uuid[]) from public, anon;
grant execute on function public.get_student_test_questions(uuid[]) to authenticated;
