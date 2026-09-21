import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/contentService';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents().then(setEvents).catch(() => setError('Unable to load events from Supabase.'));
  }, []);

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-4xl font-bold text-slate-900">Events</h1>
        {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {events.map((event) => <article key={event.id} className="rounded-2xl border border-slate-200 p-5"><p className="text-sm text-primaryBlue">{event.event_date || 'Date to be announced'}</p><h2 className="mt-2 text-xl font-bold text-slate-900">{event.title}</h2><p className="mt-3 text-slate-600">{event.description || 'Department event details will be announced soon.'}</p></article>)}
          {!events.length && !error && <p className="text-slate-500">No events are available yet.</p>}
        </div>
      </div>
    </div>
  );
}
