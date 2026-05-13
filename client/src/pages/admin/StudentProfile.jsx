import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, BookOpen, Plus } from 'lucide-react';

export default function AdminStudentProfile() {
  const { id } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [enrollRes, coursesRes] = await Promise.all([
        axios.get(`/enrollments/student/${id}`),
        axios.get('/courses')
      ]);
      setEnrollments(enrollRes.data.data);
      setCourses(coursesRes.data.data.filter(c => c.isPublished));
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return toast.error('Select a course');
    try {
      await axios.post('/enrollments', { studentId: id, courseId: selectedCourseId });
      toast.success('Student enrolled!');
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to enroll student');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/students" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
        >
          <Plus className="h-4 w-4" /> Enroll in Course
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-slate-400" /> Enrolled Courses
        </h2>

        {enrollments.length === 0 ? (
          <p className="text-slate-500 text-sm">Student is not enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="border border-slate-200 p-4 rounded-lg flex flex-col">
                <h3 className="font-semibold text-slate-900">{enrollment.course.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{enrollment.course.subject}</p>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span className="font-medium text-primary-600">{enrollment.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${enrollment.progressPercentage}%` }}></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-2 text-right">
                    {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Enroll in Course</h3>
            <form onSubmit={handleEnroll}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Course</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full border-slate-300 rounded-lg px-4 py-2 border bg-white focus:ring-primary-500"
                >
                  <option value="">Choose a course...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.subject})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-500 rounded-lg">Enroll Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
