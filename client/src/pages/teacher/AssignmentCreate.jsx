import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function AssignmentCreate() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    maxMarks: '100'
  });

  useEffect(() => {
    // Fetch courses so teacher can select which course to assign to
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/courses');
        setCourses(res.data.data);
      } catch (error) {
        toast.error('Failed to fetch courses');
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/assignments', formData);
      toast.success('Assignment created successfully');
      navigate('/teacher/assignments');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/teacher/assignments" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Create New Assignment</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Assignment Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              placeholder="e.g., Chapter 4 Essay"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Course</label>
            <select
              name="courseId"
              required
              value={formData.courseId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title} ({course.grade})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Description / Instructions</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              placeholder="Provide instructions for the assignment..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Due Date</label>
              <input
                type="datetime-local"
                name="dueDate"
                required
                value={formData.dueDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Max Marks</label>
              <input
                type="number"
                name="maxMarks"
                required
                min="1"
                value={formData.maxMarks}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Link
              to="/teacher/assignments"
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
