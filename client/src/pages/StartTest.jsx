import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';

export default function StartTest() {
  const navigate = useNavigate();
  const { activeTest, testQuestions, setAnswers } = useTest();

  const handleStart = () => {
    setAnswers({});
    navigate('/test-page');
  };

  if (!activeTest || !testQuestions.length) {
    return <div className="section-shell py-16 text-center text-slate-600">Select a test before starting.</div>;
  }

  return (
    <div className="section-shell py-16">
      <div className="mx-auto max-w-3xl panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Start Test</h1>
        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <p className="text-lg font-semibold text-slate-800">Subject: {activeTest.subject}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4"><p className="text-sm text-slate-500">Questions</p><p className="mt-1 text-2xl font-bold text-slate-900">{testQuestions.length}</p></div>
            <div className="rounded-xl bg-white p-4"><p className="text-sm text-slate-500">Time</p><p className="mt-1 text-2xl font-bold text-slate-900">{activeTest.duration} min</p></div>
            <div className="rounded-xl bg-white p-4"><p className="text-sm text-slate-500">Marks</p><p className="mt-1 text-2xl font-bold text-slate-900">{activeTest.totalMarks}</p></div>
          </div>
        </div>
        <button onClick={handleStart} className="mt-8 gradient-button">Start Now</button>
      </div>
    </div>
  );
}
