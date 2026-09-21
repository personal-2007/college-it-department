import { useEffect, useState } from 'react';
import { fetchAttempts } from '../services/adminService';

export default function StudentAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { fetchAttempts().then(setAttempts).catch(() => setError('Unable to load student attempts.')); }, []);

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Student Attempts</h1>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="p-3">Student</th><th className="p-3">Test</th><th className="p-3">Score</th><th className="p-3">Submitted</th></tr></thead><tbody>{attempts.map((attempt) => <tr key={attempt.id} className="border-b border-slate-100"><td className="p-3">{attempt.profiles?.full_name || attempt.profiles?.email || attempt.student_id}</td><td className="p-3">{attempt.tests?.title || 'Test'}</td><td className="p-3">{attempt.percentage}%</td><td className="p-3">{new Date(attempt.submitted_at).toLocaleString()}</td></tr>)}</tbody></table></div>
        {!attempts.length && !error && <p className="mt-5 text-slate-500">No submitted attempts yet.</p>}
      </div>
    </div>
  );
}
