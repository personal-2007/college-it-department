import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TestProvider } from './context/TestContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Faculty from './pages/Faculty';
import Academics from './pages/Academics';
import Labs from './pages/Labs';
import MCQTest from './pages/MCQTest';
import TestInstructions from './pages/TestInstructions';
import StartTest from './pages/StartTest';
import TestPage from './pages/TestPage';
import TestResult from './pages/TestResult';
import TestHistory from './pages/TestHistory';
import StudentDashboard from './pages/StudentDashboard';
import Timetable from './pages/Timetable';
import Placement from './pages/Placement';
import Events from './pages/Events';
import StudyMaterials from './pages/StudyMaterials';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import AdminDashboard from './admin/AdminDashboard';
import ManageQuestions from './admin/ManageQuestions';
import AddQuestion from './admin/AddQuestion';
import ManageTests from './admin/ManageTests';
import StudentAttempts from './admin/StudentAttempts';
import ManageFaculty from './admin/ManageFaculty';
import ManageEvents from './admin/ManageEvents';
import ManageMaterials from './admin/ManageMaterials';
import FacultyDashboard from './faculty/FacultyDashboard';

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
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
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
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
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><ManageMaterials /></ProtectedRoute>} />

        <Route path="/timetable" element={<ProtectedRoute allowedRoles={['student']}><Timetable /></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute allowedRoles={['student']}><Placement /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute allowedRoles={['student']}><Events /></ProtectedRoute>} />
        <Route path="/study-materials" element={<ProtectedRoute allowedRoles={['student']}><StudyMaterials /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute allowedRoles={['student']}><Gallery /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute allowedRoles={['student']}><Contact /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
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