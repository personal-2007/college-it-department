import { supabase } from '../utils/supabase';

export const fetchQuestions = async (filters = {}) => {
  let query = supabase.from('questions').select('*').order('created_at', { ascending: false });
  for (const [column, value] of Object.entries(filters)) {
    if (value && !String(value).startsWith('All ') && value !== 'Mixed' && column !== 'limit') query = query.eq(column, value);
  }
  if (filters.limit) query = query.limit(Number(filters.limit));
  const { data, error } = await query;
  if (error) throw error;
  return data.map(normalizeQuestion);
};

export const fetchQuestionStats = async () => {
  const { data, error } = await supabase.from('questions').select('year, subject');
  if (error) throw error;
  return { years: [...new Set(data.map((item) => item.year))], subjects: [...new Set(data.map((item) => item.subject))], totalQuestions: data.length };
};

export const createQuestion = async (question) => {
  const { data, error } = await supabase.from('questions').insert(toQuestionRow(question)).select().single();
  if (error) throw error;
  return normalizeQuestion(data);
};

export const updateQuestion = async (id, question) => {
  const { data, error } = await supabase.from('questions').update(toQuestionRow(question)).eq('id', id).select().single();
  if (error) throw error;
  return normalizeQuestion(data);
};

export const deleteQuestion = async (id) => {
  const { error } = await supabase.from('questions').delete().eq('id', id);
  if (error) throw error;
};

function toQuestionRow(question) {
  const options = question.options || [];
  return { question: question.question, option_a: options[0] || '', option_b: options[1] || '', option_c: options[2] || '', option_d: options[3] || '', correct_answer: question.correct_answer || question.correctAnswer, explanation: question.explanation || '', year: question.year, semester: question.semester, subject: question.subject, unit: question.unit || 'Unit 1', difficulty: question.difficulty || 'Medium', marks: question.marks || 1 };
}

function normalizeQuestion(question) {
  return { ...question, _id: question.id, options: [question.option_a, question.option_b, question.option_c, question.option_d], correctAnswer: question.correct_answer };
}
