import { supabase } from '../utils/supabase';

export async function fetchDepartments() {
  const { data, error } = await supabase.from('departments').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createDepartment(payload) {
  const { data, error } = await supabase.from('departments').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteDepartment(id) {
  const { error } = await supabase.from('departments').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchSubjects() {
  const { data, error } = await supabase.from('subjects').select('*, departments(name)').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createSubject(payload) {
  const { data, error } = await supabase.from('subjects').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteSubject(id) {
  const { error } = await supabase.from('subjects').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAnnouncements() {
  const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAnnouncement(payload) {
  const { data, error } = await supabase.from('announcements').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteAnnouncement(id) {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAppSettings() {
  const { data, error } = await supabase.from('app_settings').select('*').order('key');
  if (error) throw error;
  return data || [];
}

export async function upsertAppSetting(payload) {
  const { data, error } = await supabase.from('app_settings').upsert(payload, { onConflict: 'key' }).select().single();
  if (error) throw error;
  return data;
}

export async function fetchAuditLogs() {
  const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
  if (error) throw error;
  return data || [];
}

export async function fetchApprovals() {
  const { data, error } = await supabase.from('approvals').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateApproval(id, status, notes = '') {
  const { data, error } = await supabase.from('approvals').update({ status, notes, reviewed_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
