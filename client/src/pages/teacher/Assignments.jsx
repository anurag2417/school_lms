import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FileText, Plus, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('/assignments/teacher');
      setAssignments(res.data.data);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary-600" /> My Assignments
        </h1>
        <Link
          to="/teacher/assignments/create"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
        >
          <Plus className="h-4 w-4" /> Create Assignment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center bg-white p-12 rounded-xl shadow-sm border border-slate-100">
            <FileText className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No assignments yet</h3>
            <p className="mt-1 text-sm text-slate-500">Create your first assignment for your students.</p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{assignment.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{assignment.course?.title}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Due Date:</span>
                  <span className="font-medium text-slate-900">{format(new Date(assignment.dueDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Max Marks:</span>
                  <span className="font-medium text-slate-900">{assignment.maxMarks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Submissions:</span>
                  <span className="font-medium text-primary-600 flex items-center gap-1">
                    <Users className="h-4 w-4" /> {assignment._count?.submissions || 0}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <Link
                  to={`/teacher/assignments/${assignment.id}/submissions`}
                  className="w-full block text-center bg-slate-50 text-slate-700 font-medium py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  View Submissions
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
