import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="section-shell py-24">
      <div className="mx-auto max-w-lg rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center shadow-soft">
        <h1 className="text-4xl font-bold text-slate-900">Unauthorized</h1>
        <p className="mt-4 text-slate-600">You do not have permission to access this page.</p>
        <Link to="/login" className="mt-6 inline-flex rounded-xl bg-primaryBlue px-5 py-3 font-semibold text-white">Return to Login</Link>
      </div>
    </div>
  );
}
