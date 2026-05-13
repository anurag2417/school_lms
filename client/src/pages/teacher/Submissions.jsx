import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function Submissions() {
  const { id } = useParams(); // assignmentId
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [id]);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`/assignments/${id}/submissions`);
      setSubmissions(res.data.data);
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    const marks = e.target.marks.value;
    const feedback = e.target.feedback.value;

    try {
      await axios.put(`/assignments/submissions/${gradingSubmission.id}/grade`, { marks, feedback });
      toast.success('Submission graded!');
      setGradingSubmission(null);
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to grade submission');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/teacher/assignments" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Submissions</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No submissions received yet.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {submissions.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{sub.student.user.name}</div>
                    <div className="text-sm text-slate-500">{sub.student.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {format(new Date(sub.submittedAt), 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.status === 'GRADED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {sub.marks !== null ? sub.marks : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setGradingSubmission(sub)}
                      className="text-primary-600 hover:text-primary-900 bg-primary-50 px-3 py-1.5 rounded-md"
                    >
                      {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {gradingSubmission && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Grade Submission</h3>
            
            <div className="mb-6 space-y-4 text-sm">
              <div>
                <span className="text-slate-500 block mb-1">Student</span>
                <span className="font-medium text-slate-900">{gradingSubmission.student.user.name}</span>
              </div>
              {gradingSubmission.textContent && (
                <div>
                  <span className="text-slate-500 block mb-1">Text Submission</span>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 whitespace-pre-wrap">
                    {gradingSubmission.textContent}
                  </div>
                </div>
              )}
              {gradingSubmission.fileUrl && (
                <div>
                  <span className="text-slate-500 block mb-1">Attachment</span>
                  <a href={gradingSubmission.fileUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline flex items-center gap-1">
                    View File
                  </a>
                </div>
              )}
            </div>

            <form onSubmit={handleGrade}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marks Awarded</label>
                  <input
                    type="number"
                    name="marks"
                    required
                    defaultValue={gradingSubmission.marks || ''}
                    className="w-full border-slate-300 rounded-lg px-4 py-2 border focus:ring-primary-500"
                    placeholder="e.g., 85"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Feedback Comments</label>
                  <textarea
                    name="feedback"
                    rows="3"
                    defaultValue={gradingSubmission.feedback || ''}
                    className="w-full border-slate-300 rounded-lg px-4 py-2 border focus:ring-primary-500"
                    placeholder="Great job..."
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setGradingSubmission(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-500 rounded-lg">
                  <CheckCircle className="h-4 w-4" /> Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
