import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteQuestion, fetchQuestions } from '../services/questionService';

export default function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadQuestions = () => fetchQuestions().then(setQuestions).catch(() => setError('Unable to load questions from Supabase.'));
  useEffect(loadQuestions, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try { await deleteQuestion(id); setQuestions((current) => current.filter((question) => question.id !== id)); }
    catch { setError('Unable to delete this question.'); }
  };

  const filteredQuestions = questions.filter((question) => question.question.toLowerCase().includes(search.toLowerCase()) || question.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Question Management</h1>
        <p className="mt-2 text-slate-600">Add, update, delete and search questions for department assessments.</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/admin/questions/new" className="gradient-button">Add Question</Link>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search questions" className="rounded-xl border border-slate-200 px-4 py-3" />
        </div>
        {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <div className="mt-6 space-y-3">
          {filteredQuestions.map((question) => <div key={question.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-800">{question.question}</p><p className="text-sm text-slate-500">{question.subject} · {question.year} · {question.difficulty}</p></div><button onClick={() => handleDelete(question.id)} className="self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600">Delete</button></div>)}
          {!filteredQuestions.length && !error && <p className="text-slate-500">No questions found.</p>}
        </div>
      </div>
    </div>
  );
}
