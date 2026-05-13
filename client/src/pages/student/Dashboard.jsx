import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.profile?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/enrollments/student/${user.profile.id}`);
      setEnrollments(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.progressPercentage === 100).length;
  const overallProgress = totalCourses > 0 
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progressPercentage, 0) / totalCourses) 
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Enrolled Courses</p>
            <p className="text-2xl font-bold text-slate-900">{totalCourses}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed Courses</p>
            <p className="text-2xl font-bold text-slate-900">{completedCourses}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Overall Progress</p>
            <p className="text-2xl font-bold text-slate-900">{overallProgress}%</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-4">Continue Learning</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {enrollments.length === 0 ? (
          <div className="p-6 text-center text-slate-500">You haven't enrolled in any courses yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {enrollments.map(enrollment => (
              <div key={enrollment.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h3 className="font-semibold text-slate-900">{enrollment.course.title}</h3>
                  <p className="text-sm text-slate-500">{enrollment.completedLessons} of {enrollment.totalLessons} lessons completed</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-slate-200 rounded-full h-2 hidden sm:block">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${enrollment.progressPercentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-primary-600">{enrollment.progressPercentage}%</span>
                  <Link
                    to={`/student/courses/${enrollment.course.id}`}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    Resume
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
