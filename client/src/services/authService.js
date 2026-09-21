import { supabase } from '../utils/supabase';

export const registerUser = async (payload) => {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.name,
        register_number: payload.registerNumber,
        department: payload.department,
        year: payload.year,
        semester: payload.semester,
      },
    },
  });
  if (error) throw error;
  return { user: data.user, session: data.session };
};

export const loginUser = async (payload) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email: payload.email, password: payload.password });
  if (error) throw error;
  return { user: data.user, session: data.session };
};

export const getProfile = async (userId) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return { ...data, _id: data.id, name: data.full_name, registerNumber: data.register_number };
};
