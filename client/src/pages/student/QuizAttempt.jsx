import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/quizzes/${id}`);
        setQuiz(res.data.data);
      } catch (error) {
        toast.error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (questionId, optionValue) => {
    setAnswers({ ...answers, [questionId]: optionValue });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      if (!window.confirm('You have unanswered questions. Are you sure you want to submit?')) {
        return;
      }
    }

    setSubmitting(true);
    try {
      await axios.post(`/quizzes/${id}/attempt`, { answers });
      toast.success('Quiz submitted successfully!');
      navigate('/student/quizzes');
    } catch (error) {
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link to="/student/quizzes" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{quiz.title}</h1>
          <p className="text-sm text-slate-500">{quiz.course.title}</p>
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-slate-900">
                <span className="text-primary-600 font-bold mr-2">{index + 1}.</span> 
                {question.text}
              </h3>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {question.marks} Marks
              </span>
            </div>

            <div className="space-y-3 pl-6">
              {question.options.map((option, oIndex) => (
                <label 
                  key={oIndex} 
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    answers[question.id] === option 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleOptionSelect(question.id, option)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                  />
                  <span className="ml-3 text-slate-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-8">
        <div className="text-sm text-slate-500">
          Answered: <span className="font-bold text-slate-900">{Object.keys(answers).length}</span> / {quiz.questions.length}
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : (
            <>
              <CheckCircle className="h-5 w-5" /> Submit Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
}
