import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialState = {
  name: '',
  registerNumber: '',
  email: '',
  department: 'Information Technology',
  year: '1st Year',
  semester: 'Semester 1',
  role: 'student',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: form.name,
        registerNumber: form.registerNumber,
        email: form.email,
        department: form.department,
        year: form.year,
        semester: form.semester,
        password: form.password,
      });
      if (result.requiresEmailConfirmation) setError('Check your email to confirm your account before signing in.');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">Student Registration</h1>
        <p className="mt-2 text-sm text-slate-600">Create your academic account to access MCQ tests and analytics.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Register Number</label>
            <input value={form.registerNumber} onChange={(e) => setForm({ ...form, registerNumber: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3">
              <option>Information Technology</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Year</label>
            <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3">
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Semester</label>
            <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3">
              <option>Semester 1</option>
              <option>Semester 2</option>
              <option>Semester 3</option>
              <option>Semester 4</option>
              <option>Semester 5</option>
              <option>Semester 6</option>
              <option>Semester 7</option>
              <option>Semester 8</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
          </div>
          {error && <div className="md:col-span-2 text-sm text-red-600">{error}</div>}
          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-primaryBlue to-skyBlue px-4 py-3 font-semibold text-white shadow-soft">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-semibold text-primaryBlue">Login</Link>
        </p>
      </div>
    </div>
  );
}
