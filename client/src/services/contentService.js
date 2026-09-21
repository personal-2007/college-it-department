import { supabase } from '../utils/supabase';

export const fetchFaculty = async () => fetchRows('faculty', 'created_at');
export const fetchEvents = async () => fetchRows('events', 'event_date');
export const fetchMaterials = async () => fetchRows('study_materials', 'created_at');

export const createFaculty = async (faculty) => insertRow('faculty', faculty);
export const updateFaculty = async (id, faculty) => updateRow('faculty', id, faculty);
export const deleteFaculty = async (id) => deleteRow('faculty', id);

export const createEvent = async (event) => insertRow('events', event);
export const updateEvent = async (id, event) => updateRow('events', id, event);
export const deleteEvent = async (id) => deleteRow('events', id);

export const createMaterial = async (material) => insertRow('study_materials', material);
export const updateMaterial = async (id, material) => updateRow('study_materials', id, material);
export const deleteMaterial = async (id) => deleteRow('study_materials', id);

async function fetchRows(table, orderColumn) {
  const { data, error } = await supabase.from(table).select('*').order(orderColumn, { ascending: false, nullsFirst: false });
  if (error) throw error;
  return data;
}

async function insertRow(table, row) {
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  return data;
}

async function updateRow(table, id, row) {
  const { data, error } = await supabase.from(table).update(row).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}
