import { useEffect, useState } from 'react';
import { createEvent, deleteEvent, fetchEvents } from '../services/contentService';

const emptyForm = { title: '', description: '', event_date: '' };

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const load = () => fetchEvents().then(setEvents).catch(() => setError('Unable to load events.'));
  useEffect(load, []);
  const handleSubmit = async (event) => { event.preventDefault(); try { await createEvent(form); setForm(emptyForm); await load(); } catch { setError('Unable to save event.'); } };
  const handleDelete = async (id) => { if (!window.confirm('Delete this event?')) return; try { await deleteEvent(id); await load(); } catch { setError('Unable to delete event.'); } };

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Manage Events</h1>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-3"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Title" className="rounded-xl border border-slate-200 px-4 py-3" /><input type="date" value={form.event_date} onChange={(event) => setForm({ ...form, event_date: event.target.value })} className="rounded-xl border border-slate-200 px-4 py-3" /><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="rounded-xl border border-slate-200 px-4 py-3" /><button className="gradient-button">Add Event</button></form>
        <div className="mt-8 space-y-3">{events.map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4"><div><p className="font-semibold text-slate-800">{item.title}</p><p className="text-sm text-slate-500">{item.event_date || 'No date'}</p></div><button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Delete</button></div>)}</div>
      </div>
    </div>
  );
}
