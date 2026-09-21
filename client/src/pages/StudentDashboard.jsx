import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { fetchStudentDashboard } from '../services/testService';
import { useAuth } from '../context/AuthContext';

const chartColors = ['#2563EB', '#0EA5E9', '#7C3AED', '#16A34A', '#F59E0B'];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState({ attempted: 0, averageScore: 0, bestScore: 0, completedTests: 0, results: [] });

  useEffect(() => {
    fetchStudentDashboard()
      .then((data) => setDashboard(data))
      .catch(() => setDashboard({ attempted: 0, averageScore: 0, bestScore: 0, completedTests: 0, results: [] }));
  }, []);

  const progressData = dashboard.results.slice(0, 5).map((result) => ({
    name: result.test?.subject || 'Test',
    score: result.percentage,
  }));

  const pieData = [
    { name: 'Correct', value: dashboard.results.reduce((sum, item) => sum + item.correctAnswers, 0) },
    { name: 'Wrong', value: dashboard.results.reduce((sum, item) => sum + item.wrongAnswers, 0) },
    { name: 'Unanswered', value: dashboard.results.reduce((sum, item) => sum + item.unanswered, 0) },
  ];

  return (
    <div className="section-shell py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-primaryBlue">Student</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Welcome, {user?.name || 'Student'}</h1>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Tests Attempted" value={dashboard.attempted} />
        <Metric label="Average Score" value={`${dashboard.averageScore}%`} />
        <Metric label="Best Score" value={`${dashboard.bestScore}%`} />
        <Metric label="Completed Tests" value={dashboard.completedTests} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="text-xl font-bold text-slate-900">Score History</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="score" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-xl font-bold text-slate-900">Correct vs Wrong</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {pieData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 panel p-6">
        <h2 className="text-xl font-bold text-slate-900">Recent Tests</h2>
        <div className="mt-6 space-y-3">
          {dashboard.results.length ? dashboard.results.slice(0, 5).map((result) => (
            <div key={result._id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-800">{result.test?.title || 'MCQ Test'}</p>
                <p className="text-sm text-slate-500">{result.test?.subject || 'General'}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primaryBlue">{result.percentage}%</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
            </div>
          )) : <p className="text-slate-500">No tests attempted yet.</p>}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="panel p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
