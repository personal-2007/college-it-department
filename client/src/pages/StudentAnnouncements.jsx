import { useEffect, useState } from 'react';
import { fetchStudentAnnouncements } from '../services/studentService';

export default function StudentAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentAnnouncements()
      .then(setItems)
      .catch(() => setError('Unable to load announcements.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        {loading ? (
          <p className="mt-6 text-slate-500">Loading announcements...</p>
        ) : items.length ? (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
                  <span className="rounded-full bg-primaryBlue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primaryBlue">{item.audience || 'All'}</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">{new Date(item.created_at).toLocaleDateString()}</p>
                <p className="mt-3 text-slate-700">{item.content || item.description || 'No details provided.'}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-slate-500">No student announcements available.</p>
        )}
      </div>
    </div>
  );
}
