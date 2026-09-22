import { supabase } from '../utils/supabase';

export async function fetchAdminStats() {
  const [
    { count: totalStudents, error: studentsError },
    { count: totalFaculty, error: facultyError },
    { count: totalAdmins, error: adminsError },
    { count: totalQuestions, error: questionsError },
    { count: totalTests, error: testsError },
    { count: totalAttempts, error: attemptsError },
    { data: scores, error: scoresError },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'faculty'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('tests').select('*', { count: 'exact', head: true }),
    supabase.from('test_attempts').select('*', { count: 'exact', head: true }),
    supabase.from('test_attempts').select('percentage'),
  ]);

  if (studentsError) throw studentsError;
  if (facultyError) throw facultyError;
  if (adminsError) throw adminsError;
  if (questionsError) throw questionsError;
  if (testsError) throw testsError;
  if (attemptsError) throw attemptsError;
  if (scoresError) throw scoresError;

  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / scores.length)
    : 0;

  return {
    totalStudents: totalStudents || 0,
    totalFaculty: totalFaculty || 0,
    totalAdmins: totalAdmins || 0,
    totalQuestions: totalQuestions || 0,
    totalTests: totalTests || 0,
    totalAttempts: totalAttempts || 0,
    averageScore,
    activeTests: totalTests || 0,
  };
}

export async function fetchAttempts() {
  const { data, error } = await supabase
    .from('test_attempts')
    .select('id, student_id, score, total_marks, percentage, correct_answers, wrong_answers, unanswered, submitted_at, tests(title, subject), profiles(full_name, email)')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchFacultyStats() {
  const [
    { count: totalQuestions, error: questionsError },
    { count: totalTests, error: testsError },
    { count: totalAttempts, error: attemptsError },
  ] = await Promise.all([
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('tests').select('*', { count: 'exact', head: true }),
    supabase.from('test_attempts').select('*', { count: 'exact', head: true }),
  ]);

  if (questionsError) throw questionsError;
  if (testsError) throw testsError;
  if (attemptsError) throw attemptsError;

  return {
    totalQuestions: totalQuestions || 0,
    totalTests: totalTests || 0,
    testsAttempted: totalAttempts || 0,
  };
}
