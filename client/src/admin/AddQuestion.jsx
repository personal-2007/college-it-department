import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuestion } from '../services/questionService';

const initialForm = { question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '', year: '1st Year', semester: 'Semester 1', subject: '', unit: 'Unit 1', difficulty: 'Medium', marks: 1 };

export default function AddQuestion() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const updateOption = (index, value) => setForm((current) => ({ ...current, options: current.options.map((option, optionIndex) => optionIndex === index ? value : option) }));
  const handleSubmit = async (event) => { event.preventDefault(); try { await createQuestion(form); navigate('/admin/questions'); } catch { setError('Unable to save the question to Supabase.'); } };

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Add Question</h1>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <textarea required value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} placeholder="Question" className="md:col-span-2 rounded-xl border border-slate-200 p-3" />
          {form.options.map((option, index) => <input key={index} required value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${String.fromCharCode(65 + index)}`} className="rounded-xl border border-slate-200 p-3" />)}
          <input required value={form.correctAnswer} onChange={(event) => setForm({ ...form, correctAnswer: event.target.value })} placeholder="Correct answer" className="rounded-xl border border-slate-200 p-3" />
          <input required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Subject" className="rounded-xl border border-slate-200 p-3" />
          <textarea value={form.explanation} onChange={(event) => setForm({ ...form, explanation: event.target.value })} placeholder="Explanation" className="md:col-span-2 rounded-xl border border-slate-200 p-3" />
          {error && <p className="md:col-span-2 text-red-600">{error}</p>}
          <button type="submit" className="gradient-button md:col-span-2">Save Question</button>
        </form>
      </div>
    </div>
  );
}
