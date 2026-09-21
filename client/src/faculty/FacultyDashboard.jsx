import { useEffect, useState } from 'react';
import { fetchFacultyStats } from '../services/adminService';

export default function FacultyDashboard() {
  const [stats, setStats] = useState({ totalQuestions: 0, totalTests: 0, testsAttempted: 0 });
  const [error, setError] = useState('');
  useEffect(() => { fetchFacultyStats().then(setStats).catch(() => setError('Unable to load faculty statistics.')); }, []);

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-4xl font-bold text-slate-900">Faculty Dashboard</h1>
        <p className="mt-4 text-slate-600">Welcome to the faculty portal. Manage assessments, results, and academic workflows.</p>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <div className="mt-8 grid gap-4 md:grid-cols-3"><Metric label="Questions" value={stats.totalQuestions} /><Metric label="Tests" value={stats.totalTests} /><Metric label="Attempts" value={stats.testsAttempted} /></div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return <div className="rounded-2xl border border-slate-200 p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>;
}
