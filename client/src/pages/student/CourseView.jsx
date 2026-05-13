import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, PlayCircle, FileText, CheckCircle, Circle } from 'lucide-react';

export default function StudentCourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/courses/${id}`);
        setCourse(res.data.data);
        
        // Set first lesson active by default if exists
        if (res.data.data.chapters.length > 0 && res.data.data.chapters[0].lessons.length > 0) {
          setActiveLesson(res.data.data.chapters[0].lessons[0]);
        }
      } catch (error) {
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const markLessonComplete = async (lessonId) => {
    // In a full implementation, this calls /api/progress
    toast.success('Lesson marked as complete!');
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -m-4 sm:-m-6 lg:-m-8">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shrink-0">
        <Link to="/student/courses" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-slate-900">{course.title}</h1>
          <p className="text-sm text-slate-500">By {course.teacher?.user?.name}</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {activeLesson.type === 'VIDEO' ? (
                <div className="aspect-video bg-slate-900 flex items-center justify-center text-white relative">
                  {/* For MVP, we just render an iframe if it's a youtube link, else a placeholder */}
                  {activeLesson.content?.includes('youtube.com') ? (
                    <iframe 
                      src={activeLesson.content.replace('watch?v=', 'embed/')} 
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="text-center">
                      <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Video Player Placeholder</p>
                      <a href={activeLesson.content} target="_blank" rel="noreferrer" className="text-primary-400 hover:underline mt-2 inline-block">External Link</a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 prose max-w-none">
                  <h2>{activeLesson.title}</h2>
                  <p>{activeLesson.content}</p>
                </div>
              )}

              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{activeLesson.title}</h2>
                </div>
                <button 
                  onClick={() => markLessonComplete(activeLesson.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors"
                >
                  <CheckCircle className="h-5 w-5" /> Mark Complete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <BookOpen className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a lesson from the sidebar to begin.</p>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto shrink-0 hidden lg:block">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Course Content</h2>
            <div className="mt-2 text-xs font-medium text-slate-500">0% Complete</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
              <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {course.chapters.map((chapter) => (
              <div key={chapter.id} className="space-y-2">
                <h3 className="font-semibold text-sm text-slate-900 px-2">{chapter.order}. {chapter.title}</h3>
                <div className="space-y-1">
                  {chapter.lessons.map((lesson) => {
                    const isActive = activeLesson?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-start gap-3 px-3 py-2 text-left rounded-lg text-sm transition-colors ${
                          isActive ? 'bg-primary-50 text-primary-700' : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Circle className="h-4 w-4 mt-0.5 shrink-0 opacity-30" />
                        <div className="flex-1">
                          <span className="font-medium line-clamp-2">{lesson.title}</span>
                          <span className="text-xs opacity-60 flex items-center gap-1 mt-1">
                            {lesson.type === 'VIDEO' ? <PlayCircle className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                            {lesson.type}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
