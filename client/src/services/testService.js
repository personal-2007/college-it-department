import { supabase } from '../utils/supabase';

export const fetchTests = async (filters = {}) => {
  let query = supabase.from('tests').select('*').order('created_at', { ascending: false });
  for (const [column, value] of Object.entries(filters)) {
    if (value && !String(value).startsWith('All ') && value !== 'Mixed' && column !== 'limit') query = query.eq(column, value);
  }
  const { data, error } = await query;
  if (error) throw error;
  return attachStudentQuestions(data);
};

export const fetchTestById = async (id) => {
  const { data, error } = await supabase.from('tests').select('*').eq('id', id).single();
  if (error) throw error;
  const [test] = await attachStudentQuestions([data]);
  return test;
};

export const generateTest = async (payload) => {
  const questions = await fetchQuestionsForTest(payload);
  const { data: test, error } = await supabase.from('tests').insert({ title: payload.title || `${payload.subject} - ${payload.year}`, year: payload.year, semester: payload.semester, subject: payload.subject, unit: payload.unit || 'Unit 1', difficulty: payload.difficulty || 'Mixed', duration: payload.duration || 30, total_questions: questions.length, total_marks: questions.reduce((sum, question) => sum + question.marks, 0), passing_marks: Math.ceil(questions.length * 0.4) }).select().single();
  if (error) throw error;
  const { error: relationError } = await supabase.from('test_questions').insert(questions.map((question, index) => ({ test_id: test.id, question_id: question.id, question_order: index })));
  if (relationError) throw relationError;
  return fetchTestById(test.id);
};

export const deleteTest = async (id) => {
  const { error } = await supabase.from('tests').delete().eq('id', id);
  if (error) throw error;
};

export const submitTest = async (payload) => {
  const { data, error } = await supabase.rpc('submit_test_attempt', { p_test_id: payload.testId, p_answers: payload.answers, p_time_taken: payload.timeTaken });
  if (error) throw error;
  return normalizeAttempt(data);
};

export const fetchMyResults = async () => {
  const { data, error } = await supabase.from('test_attempts').select('*, tests(title, subject, year, semester)').order('submitted_at', { ascending: false });
  if (error) throw error;
  return data.map((result) => normalizeAttempt({ ...result, test: result.tests }));
};

export const fetchStudentDashboard = async () => {
  const results = await fetchMyResults();
  const attempted = results.length;
  return { attempted, averageScore: attempted ? Math.round(results.reduce((sum, item) => sum + item.percentage, 0) / attempted) : 0, bestScore: attempted ? Math.max(...results.map((item) => item.percentage)) : 0, completedTests: attempted, results };
};

async function fetchQuestionsForTest(filters) {
  let query = supabase.from('questions').select('*').eq('year', filters.year).eq('semester', filters.semester).eq('subject', filters.subject);
  if (filters.unit) query = query.eq('unit', filters.unit);
  if (filters.difficulty && filters.difficulty !== 'Mixed') query = query.eq('difficulty', filters.difficulty);
  const { data, error } = await query.limit(filters.limit || 20);
  if (error) throw error;
  return data;
}

async function attachStudentQuestions(tests) {
  if (!tests.length) return [];

  const { data: questionRows, error } = await supabase.rpc('get_student_test_questions', {
    p_test_ids: tests.map((test) => test.id),
  });
  if (error) throw error;

  return tests.map((test) => normalizeTest({
    ...test,
    test_questions: questionRows
      .filter((question) => question.test_id === test.id)
      .map((question) => ({ question_order: question.question_order, questions: question })),
  }));
}

function normalizeTest(test) {
  const questions = (test.test_questions || []).sort((a, b) => a.question_order - b.question_order).map((item) => ({ ...item.questions, _id: item.questions.question_id || item.questions.id, options: [item.questions.option_a, item.questions.option_b, item.questions.option_c, item.questions.option_d] }));
  return { ...test, _id: test.id, duration: test.duration, totalMarks: test.total_marks, questions };
}

function normalizeAttempt(result) {
  return { ...result, _id: result.id, createdAt: result.submitted_at, total: result.total || result.total_marks, totalMarks: result.total_marks, correctAnswers: result.correct_answers, wrongAnswers: result.wrong_answers, test: result.test || result.tests };
}
