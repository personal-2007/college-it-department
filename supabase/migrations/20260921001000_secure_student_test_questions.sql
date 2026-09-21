create or replace view public.student_test_questions as
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
join public.questions q on q.id = tq.question_id;

revoke all on public.student_test_questions from anon;
grant select on public.student_test_questions to authenticated;

drop policy if exists questions_read_authenticated on public.questions;
create policy questions_read_staff on public.questions
for select using (public.is_faculty_or_admin());
