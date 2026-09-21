import { useEffect, useState } from 'react';
import { fetchFaculty } from '../services/contentService';

export default function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFaculty().then(setFaculty).catch(() => setError('Unable to load faculty from Supabase.'));
  }, []);

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-4xl font-bold text-slate-900">Faculty</h1>
        <p className="mt-4 text-slate-600">Our faculty members combine academic rigor with industry-oriented teaching for applied learning.</p>
        {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {faculty.map((member) => <article key={member.id} className="rounded-2xl border border-slate-200 p-5"><h2 className="text-xl font-bold text-slate-900">{member.name}</h2><p className="mt-1 text-primaryBlue">{member.designation || 'Faculty'}</p><p className="mt-3 text-sm text-slate-600">{member.specialization || member.qualification || member.department || 'Information Technology'}</p></article>)}
          {!faculty.length && !error && <p className="text-slate-500">No faculty records are available yet.</p>}
        </div>
      </div>
    </div>
  );
}
