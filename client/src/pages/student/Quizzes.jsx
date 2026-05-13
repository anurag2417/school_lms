import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { HelpCircle, CheckCircle, Clock } from 'lucide-react';

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('/quizzes/student');
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
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <HelpCircle className="h-6 w-6 text-primary-600" /> My Quizzes
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {quizzes.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No pending quizzes</h3>
            <p className="text-sm text-slate-500 mt-1">You don't have any quizzes to take right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {quizzes.map(quiz => {
              const attempt = quiz.quizAttempts?.[0];
              const isAttempted = !!attempt;

              return (
                <div key={quiz.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg text-slate-900">{quiz.title}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {quiz.course.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-slate-500 mt-2">
                      <div>Questions: {quiz._count?.questions || 0}</div>
                      <div>Total Marks: {quiz.totalMarks}</div>
                    </div>
                  </div>

                  <div className="md:w-48 shrink-0 flex flex-col items-end justify-center">
                    {isAttempted ? (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{attempt.score} <span className="text-sm text-slate-400 font-medium">/ {quiz.totalMarks}</span></div>
                        <div className="text-xs text-slate-500 mt-1">Completed</div>
                      </div>
                    ) : (
                      <Link
                        to={`/student/quizzes/${quiz.id}`}
                        className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors"
                      >
                        <Clock className="h-4 w-4" /> Start Quiz
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
