import { useEffect, useMemo, useState } from 'react';
import { fetchStudentResults } from '../services/studentService';

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentResults()
      .then(setResults)
      .catch(() => setError('Unable to load results.'))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (!results.length) return { totalTests: 0, averageScore: 0, highestScore: 0, lowestScore: 0, passRate: 0, accuracy: 0 };
    const totalTests = results.length;
    const averageScore = Math.round(results.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / totalTests);
    const highestScore = Math.max(...results.map((item) => Number(item.percentage || 0)));
    const lowestScore = Math.min(...results.map((item) => Number(item.percentage || 0)));
    const passRate = Math.round((results.filter((item) => Number(item.percentage || 0) >= 50).length / totalTests) * 100);
    const accuracy = Math.round(results.reduce((sum, item) => sum + Number(item.correctAnswers || 0), 0) / Math.max(results.reduce((sum, item) => sum + Number(item.totalMarks || 0), 0), 1) * 100);
    return { totalTests, averageScore, highestScore, lowestScore, passRate, accuracy };
  }, [results]);

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Student Results</h1>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Stat label="Total Tests" value={stats.totalTests} />
          <Stat label="Average Score" value={`${stats.averageScore}%`} />
          <Stat label="Highest Score" value={`${stats.highestScore}%`} />
          <Stat label="Lowest Score" value={`${stats.lowestScore}%`} />
          <Stat label="Pass Rate" value={`${stats.passRate}%`} />
          <Stat label="Accuracy" value={`${stats.accuracy}%`} />
        </div>

        {loading ? <p className="mt-6 text-slate-500">Loading results...</p> : (
          <div className="mt-8 space-y-3">
            {results.length ? results.map((result) => (
              <div key={result._id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{result.test?.title || 'MCQ Test'}</p>
                  <p className="text-sm text-slate-500">{result.test?.subject || 'General'} · {new Date(result.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold text-primaryBlue">{result.percentage}%</p>
                  <p className="text-xs text-slate-500">{result.correctAnswers} correct · {result.wrongAnswers} wrong · {result.unanswered} unanswered</p>
                </div>
              </div>
            )) : <p className="text-slate-500">No results available yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="panel p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
