import { useEffect, useState } from 'react';
import { createAnnouncement, createDepartment, createSubject, deleteAnnouncement, deleteDepartment, deleteSubject, fetchAnnouncements, fetchAppSettings, fetchApprovals, fetchAuditLogs, fetchDepartments, fetchSubjects, upsertAppSetting, updateApproval } from '../services/adminFeaturesService';

export default function AdminSupport() {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [settings, setSettings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [departmentForm, setDepartmentForm] = useState({ name: '', code: '', description: '' });
  const [subjectForm, setSubjectForm] = useState({ department_id: '', name: '', code: '', year: '1st Year', semester: 'Semester 1', credits: 3 });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', audience: 'All', priority: 'Normal', is_published: true });
  const [settingsForm, setSettingsForm] = useState({ key: 'college_name', value: '', description: '' });
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [deptData, subjectData, announcementData, settingsData, logsData, approvalsData] = await Promise.all([
        fetchDepartments(),
        fetchSubjects(),
        fetchAnnouncements(),
        fetchAppSettings(),
        fetchAuditLogs(),
        fetchApprovals(),
      ]);
      setDepartments(deptData);
      setSubjects(subjectData);
      setAnnouncements(announcementData);
      setSettings(settingsData);
      setLogs(logsData);
      setApprovals(approvalsData);
    } catch {
      setError('Unable to load administration data.');
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDepartmentSubmit = async (event) => {
    event.preventDefault();
    try {
      await createDepartment(departmentForm);
      setDepartmentForm({ name: '', code: '', description: '' });
      await loadData();
    } catch {
      setError('Unable to save department.');
    }
  };

  const handleSubjectSubmit = async (event) => {
    event.preventDefault();
    try {
      await createSubject({ ...subjectForm, credits: Number(subjectForm.credits) });
      setSubjectForm({ department_id: '', name: '', code: '', year: '1st Year', semester: 'Semester 1', credits: 3 });
      await loadData();
    } catch {
      setError('Unable to save subject.');
    }
  };

  const handleAnnouncementSubmit = async (event) => {
    event.preventDefault();
    try {
      await createAnnouncement({ ...announcementForm, is_published: Boolean(announcementForm.is_published) });
      setAnnouncementForm({ title: '', content: '', audience: 'All', priority: 'Normal', is_published: true });
      await loadData();
    } catch {
      setError('Unable to save announcement.');
    }
  };

  const handleSettingSubmit = async (event) => {
    event.preventDefault();
    try {
      await upsertAppSetting({ key: settingsForm.key, value: settingsForm.value, description: settingsForm.description });
      setSettingsForm({ key: 'college_name', value: '', description: '' });
      await loadData();
    } catch {
      setError('Unable to save setting.');
    }
  };

  const handleApproval = async (id, status) => {
    try {
      await updateApproval(id, status);
      await loadData();
    } catch {
      setError('Unable to update approval.');
    }
  };

  return (
    <div className="section-shell py-16">
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900">Administration & System Settings</h1>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">{error}</p>}

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Departments</h2>
            <form onSubmit={handleDepartmentSubmit} className="mt-4 grid gap-3">
              <input value={departmentForm.name} onChange={(event) => setDepartmentForm({ ...departmentForm, name: event.target.value })} placeholder="Department name" className="rounded-xl border border-slate-200 px-4 py-3" required />
              <input value={departmentForm.code} onChange={(event) => setDepartmentForm({ ...departmentForm, code: event.target.value })} placeholder="Code" className="rounded-xl border border-slate-200 px-4 py-3" required />
              <textarea value={departmentForm.description} onChange={(event) => setDepartmentForm({ ...departmentForm, description: event.target.value })} placeholder="Description" className="rounded-xl border border-slate-200 px-4 py-3" rows="3" />
              <button className="gradient-button">Add Department</button>
            </form>
            <div className="mt-4 space-y-3">
              {departments.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div><p className="font-semibold text-slate-800">{item.name}</p><p className="text-xs text-slate-500">{item.code}</p></div>
                  <button onClick={async () => { await deleteDepartment(item.id); await loadData(); }} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Delete</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Subjects</h2>
            <form onSubmit={handleSubjectSubmit} className="mt-4 grid gap-3">
              <select value={subjectForm.department_id} onChange={(event) => setSubjectForm({ ...subjectForm, department_id: event.target.value })} className="rounded-xl border border-slate-200 px-4 py-3">
                <option value="">Select department</option>
                {departments.map((dept) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
              </select>
              <input value={subjectForm.name} onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })} placeholder="Subject name" className="rounded-xl border border-slate-200 px-4 py-3" required />
              <input value={subjectForm.code} onChange={(event) => setSubjectForm({ ...subjectForm, code: event.target.value })} placeholder="Subject code" className="rounded-xl border border-slate-200 px-4 py-3" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={subjectForm.year} onChange={(event) => setSubjectForm({ ...subjectForm, year: event.target.value })} placeholder="Year" className="rounded-xl border border-slate-200 px-4 py-3" />
                <input value={subjectForm.semester} onChange={(event) => setSubjectForm({ ...subjectForm, semester: event.target.value })} placeholder="Semester" className="rounded-xl border border-slate-200 px-4 py-3" />
              </div>
              <input type="number" value={subjectForm.credits} onChange={(event) => setSubjectForm({ ...subjectForm, credits: event.target.value })} placeholder="Credits" className="rounded-xl border border-slate-200 px-4 py-3" />
              <button className="gradient-button">Add Subject</button>
            </form>
            <div className="mt-4 space-y-3">
              {subjects.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div><p className="font-semibold text-slate-800">{item.name}</p><p className="text-xs text-slate-500">{item.code} · {item.year} · {item.semester}</p></div>
                  <button onClick={async () => { await deleteSubject(item.id); await loadData(); }} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
            <form onSubmit={handleAnnouncementSubmit} className="mt-4 grid gap-3">
              <input value={announcementForm.title} onChange={(event) => setAnnouncementForm({ ...announcementForm, title: event.target.value })} placeholder="Announcement title" className="rounded-xl border border-slate-200 px-4 py-3" required />
              <textarea value={announcementForm.content} onChange={(event) => setAnnouncementForm({ ...announcementForm, content: event.target.value })} placeholder="Announcement content" className="rounded-xl border border-slate-200 px-4 py-3" rows="4" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={announcementForm.audience} onChange={(event) => setAnnouncementForm({ ...announcementForm, audience: event.target.value })} className="rounded-xl border border-slate-200 px-4 py-3">
                  <option>All</option>
                  <option>Students</option>
                  <option>Faculty</option>
                </select>
                <select value={announcementForm.priority} onChange={(event) => setAnnouncementForm({ ...announcementForm, priority: event.target.value })} className="rounded-xl border border-slate-200 px-4 py-3">
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={announcementForm.is_published} onChange={(event) => setAnnouncementForm({ ...announcementForm, is_published: event.target.checked })} />
                Publish immediately
              </label>
              <button className="gradient-button">Create Announcement</button>
            </form>
            <div className="mt-4 space-y-3">
              {announcements.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <button onClick={async () => { await deleteAnnouncement(item.id); await loadData(); }} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Delete</button>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.content}</p>
                  <p className="mt-2 text-xs text-slate-500">{item.audience} · {item.priority}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">System Settings</h2>
            <form onSubmit={handleSettingSubmit} className="mt-4 grid gap-3">
              <select value={settingsForm.key} onChange={(event) => setSettingsForm({ ...settingsForm, key: event.target.value })} className="rounded-xl border border-slate-200 px-4 py-3">
                <option value="college_name">College Name</option>
                <option value="department_name">Department Name</option>
                <option value="academic_year">Academic Year</option>
                <option value="default_test_duration">Default Test Duration</option>
                <option value="default_passing_percentage">Default Passing Percentage</option>
              </select>
              <input value={settingsForm.value} onChange={(event) => setSettingsForm({ ...settingsForm, value: event.target.value })} placeholder="Setting value" className="rounded-xl border border-slate-200 px-4 py-3" required />
              <textarea value={settingsForm.description} onChange={(event) => setSettingsForm({ ...settingsForm, description: event.target.value })} placeholder="Description" className="rounded-xl border border-slate-200 px-4 py-3" rows="3" />
              <button className="gradient-button">Save Setting</button>
            </form>
            <div className="mt-4 space-y-3">
              {settings.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="font-semibold text-slate-800">{item.key}</p>
                  <p className="text-sm text-slate-600">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Approvals</h2>
            <div className="mt-4 space-y-3">
              {approvals.length ? approvals.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="font-semibold text-slate-800">{item.role} · {item.status}</p>
                  <p className="text-sm text-slate-600">{item.notes || 'No notes yet.'}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => handleApproval(item.id, 'approved')} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Approve</button>
                    <button onClick={() => handleApproval(item.id, 'rejected')} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Reject</button>
                  </div>
                </div>
              )) : <p className="text-slate-500">No pending approvals.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Audit Logs</h2>
            <div className="mt-4 space-y-3">
              {logs.length ? logs.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="font-semibold text-slate-800">{item.action}</p>
                  <p className="text-sm text-slate-600">{item.entity} · {item.entity_id || 'n/a'}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
                </div>
              )) : <p className="text-slate-500">No audit entries yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
