import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CheckSquare, 
  LogOut, 
  Menu, 
  X,
  Bell,
  GraduationCap,
  Calendar,
  CreditCard,
  Settings
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigation = () => {
    switch (user?.role) {
      case 'SUPERADMIN':
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Courses', href: '/admin/courses', icon: BookOpen },
          { name: 'Students', href: '/admin/students', icon: Users },
          { name: 'Teachers', href: '/admin/teachers', icon: Users },
          { name: 'Attendance', href: '/admin/attendance', icon: Calendar },
          { name: 'Fees', href: '/admin/fees', icon: CreditCard },
          { name: 'Settings', href: '/admin/settings', icon: Settings },
        ];
      case 'TEACHER':
        return [
          { name: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
          { name: 'My Courses', href: '/teacher/courses', icon: BookOpen },
          { name: 'Students', href: '/teacher/students', icon: Users },
          { name: 'Assignments', href: '/teacher/assignments', icon: CheckSquare },
          { name: 'Quizzes', href: '/teacher/quizzes', icon: CheckSquare },
          { name: 'Attendance', href: '/teacher/attendance', icon: Calendar },
        ];
      case 'STUDENT':
        return [
          { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
          { name: 'My Courses', href: '/student/courses', icon: BookOpen },
          { name: 'Assignments', href: '/student/assignments', icon: CheckSquare },
          { name: 'Quizzes', href: '/student/quizzes', icon: CheckSquare },
          { name: 'Attendance', href: '/student/attendance', icon: Calendar },
          { name: 'Grades', href: '/student/grades', icon: GraduationCap },
          { name: 'Fees', href: '/student/fees', icon: CreditCard },
        ];
      case 'PARENT':
        return [
          { name: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
          { name: 'Progress', href: '/parent/progress', icon: GraduationCap },
          { name: 'Attendance', href: '/parent/attendance', icon: Calendar },
          { name: 'Fees', href: '/parent/fees', icon: CreditCard },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 shadow-xl transition duration-300 ease-in-out">
          <div className="flex h-16 items-center justify-between px-6 bg-primary-600 dark:bg-primary-700 text-white">
            <span className="text-xl font-bold">School LMS</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-6 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors duration-300">
          <div className="flex h-16 items-center px-6 bg-primary-600 dark:bg-primary-700 text-white transition-colors duration-300">
            <span className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6" /> School LMS
            </span>
          </div>
          <nav className="mt-6 flex-1 px-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-200 dark:border-slate-700 p-4 transition-colors duration-300">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500 dark:text-red-400" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
          <button
            className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-end items-center gap-4">
            <ThemeToggle />
            <NotificationDropdown />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Main section */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
