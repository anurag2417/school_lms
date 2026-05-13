import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CourseCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    thumbnail: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/courses', formData);
      toast.success('Course created successfully');
      navigate(`/teacher/courses/${res.data.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/teacher/courses" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Course Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              placeholder="e.g., Introduction to Algebra"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              placeholder="What will students learn in this course?"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Subject</label>
              <select
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
              >
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Grade Level</label>
              <select
                name="grade"
                required
                value={formData.grade}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
              >
                <option value="">Select Grade</option>
                <option value="6th">6th Grade</option>
                <option value="7th">7th Grade</option>
                <option value="8th">8th Grade</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Thumbnail URL (optional)</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Link
              to="/teacher/courses"
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
