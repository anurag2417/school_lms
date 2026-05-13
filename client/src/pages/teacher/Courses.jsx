import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, BookOpen, Edit2, Trash2 } from 'lucide-react';

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/courses');
      setCourses(res.data.data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
        <Link
          to="/teacher/courses/create"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
        >
          <Plus className="h-4 w-4" /> Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white p-12 rounded-xl shadow-sm border border-slate-100">
          <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No courses yet</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by creating your first course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="h-48 bg-slate-100 relative group">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <BookOpen className="h-12 w-12" />
                  </div>
                )}
                {!course.isPublished && (
                  <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                    Draft
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {course.grade} • {course.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/teacher/courses/${course.id}`}
                      className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
