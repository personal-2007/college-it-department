import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="section-shell py-20 text-center">
      <div className="panel mx-auto max-w-xl p-10">
        <h1 className="text-5xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-xl text-slate-600">Page not found</p>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-primaryBlue px-5 py-3 font-semibold text-white">Back to Home</Link>
      </div>
    </div>
  );
}
