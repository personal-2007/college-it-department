import { useEffect, useState } from 'react';
import { fetchMaterials } from '../services/contentService';

export default function StudyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaterials().then(setMaterials).catch(() => setError('Unable to load study materials from Supabase.'));
  }, []);

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-4xl font-bold text-slate-900">Study Materials</h1>
        {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <div className="mt-8 space-y-4">
          {materials.map((material) => <article key={material.id} className="rounded-2xl border border-slate-200 p-5"><h2 className="text-xl font-bold text-slate-900">{material.title}</h2><p className="mt-2 text-sm text-slate-600">{material.description || material.subject || 'Study material'}</p>{material.file_url && <a href={material.file_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex font-semibold text-primaryBlue">Open material</a>}</article>)}
          {!materials.length && !error && <p className="text-slate-500">No study materials are available yet.</p>}
        </div>
      </div>
    </div>
  );
}
