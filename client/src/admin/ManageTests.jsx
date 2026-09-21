import { useEffect, useState } from 'react';
import { deleteTest, fetchTests, generateTest } from '../services/testService';

const emptyForm = { title: '', year: '1st Year', semester: 'Semester 1', subject: '', unit: 'Unit 1', difficulty: 'Mixed', duration: 30, limit: 10 };

export default function ManageTests() {
  const [tests, setTests] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const load = () => fetchTests().then(setTests).catch(() => setError('Unable to load tests.'));
  useEffect(load, []);
  const handleSubmit = async (event) => { event.preventDefault(); try { await generateTest({ ...form, duration: Number(form.duration), limit: Number(form.limit) }); setForm(emptyForm); setError(''); await load(); } catch (err) { setError(err.message || 'Unable to create test. Add matching questions first.'); } };
  const handleDelete = async (id) => { if (!window.confirm('Delete this test?')) return; try { await deleteTest(id); await load(); } catch { setError('Unable to delete test.'); } };

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Manage Tests</h1>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-3 md:grid-cols-2">{Object.entries(form).map(([field, value]) => <input key={field} required={field === 'subject'} type={['duration', 'limit'].includes(field) ? 'number' : 'text'} value={value} onChange={(event) => setForm({ ...form, [field]: event.target.value })} placeholder={field} className="rounded-xl border border-slate-200 px-4 py-3" />)}<button className="gradient-button md:col-span-2">Create Test From Matching Questions</button></form>
        <div className="mt-8 space-y-3">{tests.map((test) => <div key={test.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4"><div><p className="font-semibold text-slate-800">{test.title}</p><p className="text-sm text-slate-500">{test.subject} · {test.questions?.length || test.total_questions} questions · {test.duration} minutes</p></div><button onClick={() => handleDelete(test.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Delete</button></div>)}</div>
      </div>
    </div>
  );
}
