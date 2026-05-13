import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FileText, CheckCircle, Clock, Upload } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModal, setSubmitModal] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('/assignments/student');
      setAssignments(res.data.data);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const textContent = e.target.textContent.value;
    const fileUrl = e.target.fileUrl.value;

    try {
      await axios.post(`/assignments/${submitModal.id}/submit`, { textContent, fileUrl });
      toast.success('Assignment submitted successfully');
      setSubmitModal(null);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to submit assignment');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary-600" /> My Assignments
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {assignments.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
            <p className="text-sm text-slate-500 mt-1">You don't have any assignments due.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {assignments.map(assignment => {
              const submission = assignment.submissions[0];
              const isSubmitted = !!submission;
              const isGraded = submission?.status === 'GRADED';

              return (
                <div key={assignment.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg text-slate-900">{assignment.title}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {assignment.course.title}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{assignment.description}</p>
                    
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                      <div className="flex items-center gap-1 font-medium text-red-600">
                        <Clock className="h-4 w-4" /> Due {format(new Date(assignment.dueDate), 'MMM d, yyyy h:mm a')}
                      </div>
                      <div>Max Marks: {assignment.maxMarks}</div>
                    </div>
                  </div>

                  <div className="md:w-48 shrink-0 flex flex-col items-end justify-center">
                    {isGraded ? (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{submission.marks} <span className="text-sm text-slate-400 font-medium">/ {assignment.maxMarks}</span></div>
                        <div className="text-xs text-slate-500 mt-1">Graded</div>
                      </div>
                    ) : isSubmitted ? (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                          <Clock className="h-4 w-4" /> Pending Grade
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSubmitModal(assignment)}
                        className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors"
                      >
                        <Upload className="h-4 w-4" /> Submit Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {submitModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Submit Assignment</h3>
            <p className="text-sm text-slate-500 mb-6">{submitModal.title}</p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Text Answer</label>
                  <textarea
                    name="textContent"
                    rows="5"
                    className="w-full border-slate-300 rounded-lg px-4 py-2 border focus:ring-primary-500"
                    placeholder="Type your answer here..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">File Attachment URL (Optional)</label>
                  <input
                    type="url"
                    name="fileUrl"
                    className="w-full border-slate-300 rounded-lg px-4 py-2 border focus:ring-primary-500"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setSubmitModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-500 rounded-lg">
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
