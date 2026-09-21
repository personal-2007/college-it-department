import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { submitTest } from '../services/testService';

export default function TestPage() {
  const navigate = useNavigate();
  const { testQuestions, answers, setAnswers, activeTest, setResult } = useTest();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState((activeTest?.duration || 30) * 60);
  const [markedQuestions, setMarkedQuestions] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const answersRef = useRef(answers);
  const timeLeftRef = useRef(timeLeft);
  const submittedRef = useRef(false);

  answersRef.current = answers;
  timeLeftRef.current = timeLeft;

  useEffect(() => {
    submittedRef.current = false;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest]);

  const currentQuestion = testQuestions[currentIndex];

  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion._id]: option }));
  };

  const handleSubmit = async () => {
    if (submittedRef.current || !activeTest?._id) return;

    submittedRef.current = true;
    setSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitTest({
        testId: activeTest._id,
        answers: Object.entries(answersRef.current).map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
          isMarked: Boolean(markedQuestions[questionId]),
        })),
        timeTaken: formatTime((activeTest.duration || 30) * 60 - timeLeftRef.current),
      });
      setResult(result);
      navigate('/test-result');
    } catch (error) {
      submittedRef.current = false;
      setSubmitError(error?.response?.data?.message || 'Unable to submit the test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const questionStatus = useMemo(
    () =>
      testQuestions.map((question, index) => {
        const choice = answers[question._id];
        if (choice) return 'answered';
        if (markedQuestions[question._id]) return 'review';
        if (index === currentIndex) return 'current';
        return 'unanswered';
      }),
    [answers, currentIndex, markedQuestions, testQuestions],
  );

  if (!currentQuestion) {
    return <div className="section-shell py-16 text-center text-slate-600">No questions available for this test.</div>;
  }

  return (
    <div className="section-shell py-16">
      <div className="panel p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-primaryBlue">Subject: {activeTest?.subject || 'Data Structures'}</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Question {currentIndex + 1} / {testQuestions.length}</h1>
          </div>
          <div className="rounded-2xl bg-slate-100 px-5 py-3 text-center">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Time Remaining</p>
            <p className="text-2xl font-bold text-slate-900">{formatTime(timeLeft)}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
          <div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="text-xl font-semibold text-slate-800">{currentQuestion.question}</p>
              <div className="mt-6 space-y-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                      answers[currentQuestion._id] === option
                        ? 'border-primaryBlue bg-blue-50 text-primaryBlue'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                    }`}
                  >
                    <span className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs">○</span>{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700">Previous</button>
              <button onClick={() => setMarkedQuestions((prev) => ({ ...prev, [currentQuestion._id]: !prev[currentQuestion._id] }))} className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-3 font-semibold text-orange-700">
                {markedQuestions[currentQuestion._id] ? 'Remove Review' : 'Mark for Review'}
              </button>
              <button onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, testQuestions.length - 1))} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700">Next</button>
              <button onClick={handleSubmit} disabled={submitting} className="ml-auto rounded-xl bg-gradient-to-r from-primaryBlue to-skyBlue px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit Test'}</button>
            </div>
            {submitError && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>}
          </div>

          <aside className="panel p-4">
            <h2 className="text-xl font-bold text-slate-900">Question Navigation</h2>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {testQuestions.map((question, index) => (
                <button
                  key={question._id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex h-10 items-center justify-center rounded-lg text-sm font-semibold ${
                    questionStatus[index] === 'answered' ? 'bg-green-500 text-white' :
                    questionStatus[index] === 'review' ? 'bg-orange-400 text-white' :
                    questionStatus[index] === 'current' ? 'bg-blue-500 text-white' :
                    index === currentIndex ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500"></span>Answered</p>
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-500"></span>Current</p>
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-300"></span>Not Attempted</p>
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-400"></span>Review</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
