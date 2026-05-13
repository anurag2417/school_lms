import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StudentCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.profile?.id) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Learning</h1>

      {enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white p-12 rounded-xl shadow-sm border border-slate-100">
          <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No courses yet</h3>
          <p className="mt-1 text-sm text-slate-500">You haven't enrolled in any courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Link key={enrollment.id} to={`/student/courses/${enrollment.course.id}`} className="block group">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-shadow hover:shadow-md h-full">
                <div className="h-48 bg-slate-100 relative">
                  {enrollment.course.thumbnail ? (
                    <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-300">
                      <BookOpen className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{enrollment.course.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{enrollment.course.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>Progress</span>
                      <span className="font-medium text-primary-600">{enrollment.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${enrollment.progressPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
