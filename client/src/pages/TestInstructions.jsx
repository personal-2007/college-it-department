import { Link } from 'react-router-dom';

export default function TestInstructions() {
  return (
    <div className="section-shell py-16">
      <div className="mx-auto max-w-3xl panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Test Instructions</h1>
        <div className="mt-6 space-y-4 text-slate-600">
          <p>1. Read each question carefully before choosing the most appropriate answer.</p>
          <p>2. Each question carries one mark and there is no negative marking.</p>
          <p>3. You will have a limited time to complete the assessment.</p>
          <p>4. Use the navigation panel to move across questions and mark for review when needed.</p>
          <p>5. The timer will automatically submit the test when it reaches zero.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/start-test" className="gradient-button">Start Test</Link>
          <Link to="/mcq-test" className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
