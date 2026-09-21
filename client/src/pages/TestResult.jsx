import { Link } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTest } from '../context/TestContext';

export default function TestResult() {
  const { result } = useTest();

  if (!result) {
    return <div className="section-shell py-16 text-center text-slate-600">No result available yet.</div>;
  }

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Test Completed</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Your Score</p>
              <p className="mt-3 text-5xl font-bold text-slate-900">{result.score} <span className="text-2xl text-slate-500">/ {result.total}</span></p>
              <p className="mt-3 text-xl font-semibold text-primaryBlue">{result.percentage}%</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Correct Answers" value={result.correctAnswers} />
              <Stat label="Wrong Answers" value={result.wrongAnswers} />
              <Stat label="Unanswered" value={result.unanswered} />
              <Stat label="Time Taken" value={result.timeTaken} />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/test-history" className="gradient-button">Review Answers</Link>
              <Link to="/start-test" className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700">Try Again</Link>
              <Link to="/mcq-test" className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700">Back to Dashboard</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-xl font-bold text-slate-900">Performance Chart</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Correct', score: result.correctAnswers }, { name: 'Wrong', score: result.wrongAnswers }, { name: 'Unanswered', score: result.unanswered }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
