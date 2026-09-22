import { useEffect, useState } from 'react';
import { fetchStudentProfile, updateStudentProfile } from '../services/studentService';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ full_name: '', department: '', year: '', semester: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudentProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          full_name: data.full_name || '',
          department: data.department || '',
          year: data.year || '',
          semester: data.semester || '',
          avatar_url: data.avatar_url || '',
        });
      })
      .catch(() => setError('Unable to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const nextProfile = await updateStudentProfile(form);
      setProfile(nextProfile);
    } catch {
      setError('Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="section-shell py-16 text-center text-slate-600">Loading profile...</div>;
  }

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Student Profile</h1>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}
        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primaryBlue/10 text-2xl font-bold text-primaryBlue">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <p className="mt-4 text-xl font-bold text-slate-900">{profile?.full_name || 'Student'}</p>
            <p className="text-sm text-slate-500">{profile?.role || 'student'}</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} />
            <Field label="Email" value={profile?.email || ''} readOnly />
            <Field label="Register Number" value={profile?.register_number || profile?.registerNumber || ''} readOnly />
            <Field label="Department" value={form.department} onChange={(value) => setForm({ ...form, department: value })} />
            <Field label="Year" value={form.year} onChange={(value) => setForm({ ...form, year: value })} />
            <Field label="Semester" value={form.semester} onChange={(value) => setForm({ ...form, semester: value })} />
            <Field label="Profile Image URL" value={form.avatar_url} onChange={(value) => setForm({ ...form, avatar_url: value })} className="md:col-span-2" />
            <button disabled={saving} className="gradient-button md:col-span-2">{saving ? 'Saving...' : 'Save Profile'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, readOnly = false, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <input
        readOnly={readOnly}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-700 outline-none transition focus:border-primaryBlue"
      />
    </label>
  );
}
