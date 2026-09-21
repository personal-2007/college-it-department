import { useEffect, useState } from 'react';
import { createFaculty, deleteFaculty, fetchFaculty } from '../services/contentService';

const emptyForm = { name: '', designation: '', department: 'Information Technology', qualification: '', specialization: '', email: '' };

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = () => fetchFaculty().then(setFaculty).catch(() => setError('Unable to load faculty.'));
  useEffect(load, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try { await createFaculty(form); setForm(emptyForm); setError(''); await load(); } catch { setError('Unable to save faculty.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this faculty record?')) return;
    try { await deleteFaculty(id); await load(); } catch { setError('Unable to delete faculty.'); }
  };

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Manage Faculty</h1>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-3 md:grid-cols-2">
          {Object.entries(form).map(([field, value]) => <input key={field} required={field === 'name'} value={value} onChange={(event) => setForm({ ...form, [field]: event.target.value })} placeholder={field.replace(/([A-Z])/g, ' $1')} className="rounded-xl border border-slate-200 px-4 py-3" />)}
          <button className="gradient-button md:col-span-2">Add Faculty</button>
        </form>
        <div className="mt-8 space-y-3">{faculty.map((member) => <div key={member.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4"><div><p className="font-semibold text-slate-800">{member.name}</p><p className="text-sm text-slate-500">{member.designation || member.specialization}</p></div><button onClick={() => handleDelete(member.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Delete</button></div>)}</div>
      </div>
    </div>
  );
}
