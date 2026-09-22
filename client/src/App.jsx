import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TestProvider } from './context/TestContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Faculty = lazy(() => import('./pages/Faculty'));
const Academics = lazy(() => import('./pages/Academics'));
const Labs = lazy(() => import('./pages/Labs'));
const MCQTest = lazy(() => import('./pages/MCQTest'));
const TestInstructions = lazy(() => import('./pages/TestInstructions'));
const StartTest = lazy(() => import('./pages/StartTest'));
const TestPage = lazy(() => import('./pages/TestPage'));
const TestResult = lazy(() => import('./pages/TestResult'));
const TestHistory = lazy(() => import('./pages/TestHistory'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const Timetable = lazy(() => import('./pages/Timetable'));
const Placement = lazy(() => import('./pages/Placement'));
const Events = lazy(() => import('./pages/Events'));
const StudyMaterials = lazy(() => import('./pages/StudyMaterials'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const ManageQuestions = lazy(() => import('./admin/ManageQuestions'));
const AddQuestion = lazy(() => import('./admin/AddQuestion'));
const ManageTests = lazy(() => import('./admin/ManageTests'));
const StudentAttempts = lazy(() => import('./admin/StudentAttempts'));
const ManageFaculty = lazy(() => import('./admin/ManageFaculty'));
const ManageEvents = lazy(() => import('./admin/ManageEvents'));
const ManageMaterials = lazy(() => import('./admin/ManageMaterials'));
const AdminSupport = lazy(() => import('./admin/AdminSupport'));
const FacultyDashboard = lazy(() => import('./faculty/FacultyDashboard'));

function RootRedirect() {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <img src="/college-logo.png" alt="Mahendra Engineering College logo" className="mx-auto h-20 w-20 rounded-full shadow-soft" />
          <p className="mt-4 text-lg font-semibold text-slate-800">Department of Information Technology</p>
          <p className="mt-2 text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
  if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
  if (user.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
  if (user.role === 'hod') return <Navigate to="/hod/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

function ProtectedApp() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/mcq-test" element={<ProtectedRoute allowedRoles={['student']}><MCQTest /></ProtectedRoute>} />
        <Route path="/test-instructions" element={<ProtectedRoute allowedRoles={['student']}><TestInstructions /></ProtectedRoute>} />
        <Route path="/start-test" element={<ProtectedRoute allowedRoles={['student']}><StartTest /></ProtectedRoute>} />
        <Route path="/test-page" element={<ProtectedRoute allowedRoles={['student']}><TestPage /></ProtectedRoute>} />
        <Route path="/test-result" element={<ProtectedRoute allowedRoles={['student']}><TestResult /></ProtectedRoute>} />
        <Route path="/test-history" element={<ProtectedRoute allowedRoles={['student']}><TestHistory /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/mcq" element={<ProtectedRoute allowedRoles={['student']}><MCQTest /></ProtectedRoute>} />
        <Route path="/student/result/:id" element={<ProtectedRoute allowedRoles={['student']}><TestResult /></ProtectedRoute>} />
        <Route path="/student/history" element={<ProtectedRoute allowedRoles={['student']}><TestHistory /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/materials" element={<ProtectedRoute allowedRoles={['student']}><StudyMaterials /></ProtectedRoute>} />
        <Route path="/student/timetable" element={<ProtectedRoute allowedRoles={['student']}><Timetable /></ProtectedRoute>} />

        <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/faculty/questions" element={<ProtectedRoute allowedRoles={['faculty']}><ManageQuestions /></ProtectedRoute>} />
        <Route path="/faculty/tests" element={<ProtectedRoute allowedRoles={['faculty']}><ManageTests /></ProtectedRoute>} />
        <Route path="/faculty/results" element={<ProtectedRoute allowedRoles={['faculty']}><StudentAttempts /></ProtectedRoute>} />

        <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={['staff']}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/hod/dashboard" element={<ProtectedRoute allowedRoles={['hod']}><FacultyDashboard /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/questions" element={<ProtectedRoute allowedRoles={['admin']}><ManageQuestions /></ProtectedRoute>} />
        <Route path="/admin/questions/new" element={<ProtectedRoute allowedRoles={['admin']}><AddQuestion /></ProtectedRoute>} />
        <Route path="/admin/tests" element={<ProtectedRoute allowedRoles={['admin']}><ManageTests /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><StudentAttempts /></ProtectedRoute>} />
        <Route path="/admin/results" element={<ProtectedRoute allowedRoles={['admin']}><StudentAttempts /></ProtectedRoute>} />
        <Route path="/admin/faculty" element={<ProtectedRoute allowedRoles={['admin']}><ManageFaculty /></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><ManageEvents /></ProtectedRoute>} />
        <Route path="/admin/materials" element={<ProtectedRoute allowedRoles={['admin']}><ManageMaterials /></ProtectedRoute>} />
        <Route path="/admin/support" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupport /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupport /></ProtectedRoute>} />

        <Route path="/timetable" element={<ProtectedRoute allowedRoles={['student']}><Timetable /></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute allowedRoles={['student']}><Placement /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute allowedRoles={['student']}><Events /></ProtectedRoute>} />
        <Route path="/study-materials" element={<ProtectedRoute allowedRoles={['student']}><StudyMaterials /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute allowedRoles={['student']}><Gallery /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute allowedRoles={['student']}><Contact /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function PageLoading() {
  return <div className="flex min-h-screen items-center justify-center bg-slate-50"><p className="text-sm font-semibold text-slate-600">Loading...</p></div>;
}

function App() {
  return (
    <AuthProvider>
      <TestProvider>
        <ProtectedApp />
      </TestProvider>
    </AuthProvider>
  );
}

export default App;