import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCourses from './pages/admin/Courses';
import AdminStudents from './pages/admin/Students';
import AdminStudentProfile from './pages/admin/StudentProfile';
import AdminAttendance from './pages/admin/Attendance';
import AdminFees from './pages/admin/Fees';
import AdminTeachers from './pages/admin/Teachers';
import AdminSettings from './pages/admin/Settings';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherCourses from './pages/teacher/Courses';
import TeacherStudents from './pages/teacher/Students';
import TeacherAssignments from './pages/teacher/Assignments';
import AssignmentCreate from './pages/teacher/AssignmentCreate';
import Submissions from './pages/teacher/Submissions';
import TeacherQuizzes from './pages/teacher/Quizzes';
import QuizCreate from './pages/teacher/QuizCreate';
import CourseCreate from './pages/teacher/CourseCreate';
import CourseEditor from './pages/teacher/CourseEditor';
import TeacherAttendance from './pages/teacher/Attendance';
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentAssignments from './pages/student/Assignments';
import StudentQuizzes from './pages/student/Quizzes';
import QuizAttempt from './pages/student/QuizAttempt';
import CourseView from './pages/student/CourseView';
import StudentAttendance from './pages/student/Attendance';
import StudentFees from './pages/student/Fees';
import StudentGrades from './pages/student/Grades';
import ParentDashboard from './pages/parent/Dashboard';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      <Route element={<Layout />}>
        {/* Admin Routes */}
        <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/courses" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminCourses /></ProtectedRoute>} />
        <Route path="admin/students" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminStudents /></ProtectedRoute>} />
        <Route path="admin/students/:id" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminStudentProfile /></ProtectedRoute>} />
        <Route path="admin/attendance" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminAttendance /></ProtectedRoute>} />
        <Route path="admin/fees" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminFees /></ProtectedRoute>} />
        <Route path="admin/teachers" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminTeachers /></ProtectedRoute>} />
        <Route path="admin/settings" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminSettings /></ProtectedRoute>} />
        
        {/* Teacher Routes */}
        <Route path="teacher/dashboard" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="teacher/courses" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherCourses /></ProtectedRoute>} />
        <Route path="teacher/courses/create" element={<ProtectedRoute allowedRoles={['TEACHER']}><CourseCreate /></ProtectedRoute>} />
        <Route path="teacher/courses/:id" element={<ProtectedRoute allowedRoles={['TEACHER']}><CourseEditor /></ProtectedRoute>} />
        <Route path="teacher/students" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherStudents /></ProtectedRoute>} />
        <Route path="teacher/assignments" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherAssignments /></ProtectedRoute>} />
        <Route path="teacher/assignments/create" element={<ProtectedRoute allowedRoles={['TEACHER']}><AssignmentCreate /></ProtectedRoute>} />
        <Route path="teacher/assignments/:id/submissions" element={<ProtectedRoute allowedRoles={['TEACHER']}><Submissions /></ProtectedRoute>} />
        <Route path="teacher/quizzes" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherQuizzes /></ProtectedRoute>} />
        <Route path="teacher/quizzes/create" element={<ProtectedRoute allowedRoles={['TEACHER']}><QuizCreate /></ProtectedRoute>} />
        <Route path="teacher/attendance" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherAttendance /></ProtectedRoute>} />
        
        {/* Student Routes */}
        <Route path="student/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="student/courses" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentCourses /></ProtectedRoute>} />
        <Route path="student/courses/:id" element={<ProtectedRoute allowedRoles={['STUDENT']}><CourseView /></ProtectedRoute>} />
        <Route path="student/assignments" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentAssignments /></ProtectedRoute>} />
        <Route path="student/quizzes" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentQuizzes /></ProtectedRoute>} />
        <Route path="student/quizzes/:id" element={<ProtectedRoute allowedRoles={['STUDENT']}><QuizAttempt /></ProtectedRoute>} />
        <Route path="student/attendance" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentAttendance /></ProtectedRoute>} />
        <Route path="student/fees" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentFees /></ProtectedRoute>} />
        <Route path="student/grades" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentGrades /></ProtectedRoute>} />
        
        {/* Parent Routes */}
        <Route path="parent/dashboard" element={<ProtectedRoute allowedRoles={['PARENT']}><ParentDashboard /></ProtectedRoute>} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
