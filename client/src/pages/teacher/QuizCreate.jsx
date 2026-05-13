import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function QuizCreate() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    totalMarks: 0
  });

  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }
  ]);

  useEffect(() => {
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

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQ = [...questions];
    newQ.splice(index, 1);
    setQuestions(newQ);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQ = [...questions];
    newQ[index][field] = value;
    setQuestions(newQ);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQ = [...questions];
    newQ[qIndex].options[oIndex] = value;
    setQuestions(newQ);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Calculate total marks
    const total = questions.reduce((acc, q) => acc + parseInt(q.marks || 0), 0);

    // Validate that correct answer exists in options
    for (let i=0; i<questions.length; i++) {
      if (!questions[i].options.includes(questions[i].correctAnswer)) {
        toast.error(`Question ${i+1}: Correct answer must exactly match one of the options.`);
        setLoading(false);
        return;
      }
    }

    try {
      await axios.post('/quizzes', { ...formData, totalMarks: total, questions });
      toast.success('Quiz created successfully');
      navigate('/teacher/quizzes');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link to="/teacher/quizzes" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Create New Quiz</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Quiz Settings</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700">Quiz Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              placeholder="e.g., Midterm Exam"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Course</label>
            <select
              required
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title} ({course.grade})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 flex justify-between items-center">
            Questions
            <button type="button" onClick={handleAddQuestion} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
              <Plus className="h-4 w-4" /> Add Question
            </button>
          </h2>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-slate-900">Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div>
                <textarea
                  required
                  rows="2"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                  placeholder="What is the capital of France?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex}>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 sm:text-sm px-4 py-2 border"
                      placeholder={`Option ${oIndex + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Correct Answer (Must match an option exactly)</label>
                  <input
                    type="text"
                    required
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-green-500 border-green-200 sm:text-sm px-4 py-2 border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={q.marks}
                    onChange={(e) => handleQuestionChange(qIndex, 'marks', e.target.value)}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 sm:text-sm px-4 py-2 border"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/teacher/quizzes"
            className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}
