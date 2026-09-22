import { supabase } from '../utils/supabase';

export async function fetchStudentDashboard() {
  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authUser?.user) throw new Error('Authentication required');

  const userId = authUser.user.id;

  const [
    { data: attempts, error: attemptsError },
    { data: profile, error: profileError },
    { count: totalTests, error: testsError },
    { data: materials, error: materialsError },
    { data: announcements, error: announcementsError },
  ] = await Promise.all([
    supabase
      .from('test_attempts')
      .select('id, percentage, correct_answers, wrong_answers, unanswered, submitted_at, tests(title, subject, year, semester)')
      .eq('student_id', userId)
      .order('submitted_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('tests').select('*', { count: 'exact', head: true }),
    supabase.from('study_materials').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  if (attemptsError) throw attemptsError;
  if (profileError) throw profileError;
  if (testsError) throw testsError;
  if (materialsError) throw materialsError;
  if (announcementsError) throw announcementsError;

  const results = (attempts || []).map(normalizeAttempt);
  const attempted = results.length;
  const averageScore = attempted ? Math.round(results.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / attempted) : 0;
  const bestScore = attempted ? Math.max(...results.map((item) => Number(item.percentage || 0))) : 0;
  const completedTests = attempted;

  return {
    user: profile,
    totalTests: totalTests || 0,
    attempted,
    averageScore,
    bestScore,
    completedTests,
    pendingTests: Math.max((totalTests || 0) - attempted, 0),
    results,
    materials: materials || [],
    announcements: announcements || [],
  };
}

export async function fetchStudentResults() {
  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authUser?.user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('test_attempts')
    .select('id, score, total_marks, percentage, correct_answers, wrong_answers, unanswered, time_taken, submitted_at, tests(title, subject, year, semester)')
    .eq('student_id', authUser.user.id)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeAttempt);
}

export async function fetchStudentProfile() {
  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authUser?.user) throw new Error('Authentication required');

  const { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.user.id).single();
  if (error) throw error;
  return { ...data, name: data.full_name, registerNumber: data.register_number };
}

export async function updateStudentProfile(updates) {
  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authUser?.user) throw new Error('Authentication required');

  const payload = {
    full_name: updates.full_name ?? updates.name ?? undefined,
    department: updates.department ?? undefined,
    year: updates.year ?? undefined,
    semester: updates.semester ?? undefined,
    avatar_url: updates.avatar_url ?? undefined,
    updated_at: new Date().toISOString(),
  };

  Object.keys(payload).forEach((key) => {
    if (typeof payload[key] === 'undefined') delete payload[key];
  });

  const { data, error } = await supabase.from('profiles').update(payload).eq('id', authUser.user.id).select().single();
  if (error) throw error;
  return { ...data, name: data.full_name, registerNumber: data.register_number };
}

export async function fetchStudentAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .in('audience', ['All', 'Students'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchStudentMaterials() {
  const { data, error } = await supabase
    .from('study_materials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

function normalizeAttempt(result) {
  return {
    ...result,
    _id: result.id,
    createdAt: result.submitted_at,
    totalMarks: result.total_marks,
    correctAnswers: result.correct_answers,
    wrongAnswers: result.wrong_answers,
    unanswered: result.unanswered,
    test: result.tests,
  };
}
