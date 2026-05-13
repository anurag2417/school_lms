import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { HelpCircle, Plus, Users } from 'lucide-react';

export default function TeacherQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('/quizzes/teacher');
      setQuizzes(res.data.data);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary-600" /> My Quizzes
        </h1>
        <Link
          to="/teacher/quizzes/create"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
        >
          <Plus className="h-4 w-4" /> Create Quiz
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center bg-white p-12 rounded-xl shadow-sm border border-slate-100">
            <HelpCircle className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No quizzes yet</h3>
            <p className="mt-1 text-sm text-slate-500">Create your first quiz to test your students.</p>
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{quiz.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{quiz.course?.title}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Marks:</span>
                  <span className="font-medium text-slate-900">{quiz.totalMarks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Attempts:</span>
                  <span className="font-medium text-primary-600 flex items-center gap-1">
                    <Users className="h-4 w-4" /> {quiz._count?.quizAttempts || 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
