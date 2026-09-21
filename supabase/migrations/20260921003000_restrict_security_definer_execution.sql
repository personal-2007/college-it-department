revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_faculty_or_admin() from public, anon;
revoke all on function public.submit_test_attempt(uuid, jsonb, text) from public, anon;
revoke all on function public.get_student_test_questions(uuid[]) from public, anon;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_faculty_or_admin() to authenticated;
grant execute on function public.submit_test_attempt(uuid, jsonb, text) to authenticated;
grant execute on function public.get_student_test_questions(uuid[]) to authenticated;
