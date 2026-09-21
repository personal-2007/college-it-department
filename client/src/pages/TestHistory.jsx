import { useEffect, useState } from 'react';
import { fetchMyResults } from '../services/testService';

export default function TestHistory() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyResults()
      .then(setResults)
      .catch(() => setError('Unable to load your test history.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-4xl font-bold text-slate-900">Test History</h1>
        {loading && <p className="mt-6 text-slate-500">Loading your attempts...</p>}
        {error && <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        {!loading && !error && !results.length && <p className="mt-6 text-slate-500">No tests attempted yet.</p>}
        {!loading && !error && results.length > 0 && (
          <div className="mt-6 space-y-3">
            {results.map((result) => (
              <div key={result._id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{result.test?.title || 'MCQ Test'}</p>
                  <p className="text-sm text-slate-500">{result.test?.subject || 'General'} · {new Date(result.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold text-primaryBlue">{result.percentage}%</p>
                  <p className="text-xs text-slate-500">{result.score}/{result.totalMarks} · {result.timeTaken}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
