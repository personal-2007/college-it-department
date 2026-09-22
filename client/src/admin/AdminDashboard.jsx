import { useEffect, useState } from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { fetchAdminStats } from '../services/adminService';

const colors = ['#2563EB', '#0EA5E9', '#7C3AED', '#16A34A', '#F59E0B', '#DC2626', '#14B8A6', '#F97316'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalAdmins: 0,
    totalQuestions: 0,
    totalTests: 0,
    totalAttempts: 0,
    averageScore: 0,
    activeTests: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminStats().then(setStats).catch(() => setError('Unable to load admin statistics.'));
  }, []);

  const chartData = [
    { name: 'Students', value: stats.totalStudents },
    { name: 'Faculty', value: stats.totalFaculty },
    { name: 'Admins', value: stats.totalAdmins },
    { name: 'Questions', value: stats.totalQuestions },
    { name: 'Tests', value: stats.totalTests },
    { name: 'Attempts', value: stats.totalAttempts },
  ];

  return (
    <div className="section-shell py-16">
      <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Students" value={stats.totalStudents} />
        <Metric label="Total Faculty" value={stats.totalFaculty} />
        <Metric label="Total Admins" value={stats.totalAdmins} />
        <Metric label="Total Questions" value={stats.totalQuestions} />
        <Metric label="Total Tests" value={stats.totalTests} />
        <Metric label="Total Test Attempts" value={stats.totalAttempts} />
        <Metric label="Average Score" value={`${stats.averageScore}%`} />
        <Metric label="Active Tests" value={stats.activeTests} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="text-xl font-bold text-slate-900">Usage Overview</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-xl font-bold text-slate-900">Distribution</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={90}>
                  {chartData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
