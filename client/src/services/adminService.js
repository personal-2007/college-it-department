import { supabase } from '../utils/supabase';

export async function fetchAdminStats() {
  const tables = ['profiles', 'questions', 'tests', 'test_attempts'];
  const counts = await Promise.all(tables.map(async (table) => {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  }));
  const { data: scores, error } = await supabase.from('test_attempts').select('percentage');
  if (error) throw error;
  return {
    totalStudents: counts[0],
    totalQuestions: counts[1],
    totalTests: counts[2],
    testsAttempted: counts[3],
    averageScore: scores.length ? Math.round(scores.reduce((sum, item) => sum + item.percentage, 0) / scores.length) : 0,
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
  const tables = ['questions', 'tests', 'test_attempts'];
  const counts = await Promise.all(tables.map(async (table) => {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  }));
  return { totalQuestions: counts[0], totalTests: counts[1], testsAttempted: counts[2] };
}
