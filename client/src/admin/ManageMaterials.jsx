import { useEffect, useState } from 'react';
import { createMaterial, deleteMaterial, fetchMaterials } from '../services/contentService';

const emptyForm = { title: '', description: '', subject: '', year: '', semester: '', file_url: '' };

export default function ManageMaterials() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const load = () => fetchMaterials().then(setMaterials).catch(() => setError('Unable to load study materials.'));
  useEffect(load, []);
  const handleSubmit = async (event) => { event.preventDefault(); try { await createMaterial(form); setForm(emptyForm); await load(); } catch { setError('Unable to save study material.'); } };
  const handleDelete = async (id) => { if (!window.confirm('Delete this material?')) return; try { await deleteMaterial(id); await load(); } catch { setError('Unable to delete study material.'); } };

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Manage Materials</h1>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-3 md:grid-cols-2">{Object.entries(form).map(([field, value]) => <input key={field} required={field === 'title'} value={value} onChange={(event) => setForm({ ...form, [field]: event.target.value })} placeholder={field.replace(/_/g, ' ')} className="rounded-xl border border-slate-200 px-4 py-3" />)}<button className="gradient-button md:col-span-2">Add Material</button></form>
        <div className="mt-8 space-y-3">{materials.map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4"><div><p className="font-semibold text-slate-800">{item.title}</p><p className="text-sm text-slate-500">{item.subject || 'General material'}</p></div><button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Delete</button></div>)}</div>
      </div>
    </div>
  );
}
