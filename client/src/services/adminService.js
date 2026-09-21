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
