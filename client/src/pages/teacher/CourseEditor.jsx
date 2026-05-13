import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Plus, CheckCircle, Video, FileText, File } from 'lucide-react';

export default function CourseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/courses/${id}`);
      setCourse(res.data.data);
    } catch (error) {
      toast.error('Failed to load course details');
      navigate('/teacher/courses');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      await axios.put(`/courses/${id}`, { isPublished: !course.isPublished });
      setCourse({ ...course, isPublished: !course.isPublished });
      toast.success(course.isPublished ? 'Course unpublished' : 'Course published');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const order = course.chapters.length + 1;
    
    try {
      await axios.post(`/courses/${id}/chapters`, { title, order });
      toast.success('Chapter added');
      setShowChapterModal(false);
      fetchCourse();
    } catch (error) {
      toast.error('Failed to add chapter');
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const type = e.target.type.value;
    const content = e.target.content.value;
    
    const chapter = course.chapters.find(c => c.id === activeChapterId);
    const order = chapter.lessons.length + 1;

    try {
      await axios.post(`/courses/${id}/chapters/${activeChapterId}/lessons`, { title, type, content, order });
      toast.success('Lesson added');
      setShowLessonModal(false);
      fetchCourse();
    } catch (error) {
      toast.error('Failed to add lesson');
    }
  };

  if (loading) return <div>Loading course...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/teacher/courses" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Course Builder</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            Status: <strong className={course.isPublished ? 'text-green-600' : 'text-yellow-600'}>
              {course.isPublished ? 'Published' : 'Draft'}
            </strong>
          </span>
          <button
            onClick={handlePublishToggle}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              course.isPublished 
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                : 'bg-green-600 text-white hover:bg-green-500'
            }`}
          >
            {course.isPublished ? 'Unpublish' : 'Publish Course'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="font-semibold text-lg mb-4">Course Details</h2>
            {course.thumbnail && (
              <img src={course.thumbnail} alt="Thumbnail" className="w-full h-32 object-cover rounded-lg mb-4" />
            )}
            <h3 className="font-medium text-slate-900">{course.title}</h3>
            <p className="text-sm text-slate-500 mt-2">{course.description}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subject:</span>
                <span className="font-medium">{course.subject}</span>
              </div>
              <div className="flex justify-between">
                <span>Grade:</span>
                <span className="font-medium">{course.grade}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-slate-900">Curriculum</h2>
              <button
                onClick={() => setShowChapterModal(true)}
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-4 w-4" /> Add Chapter
              </button>
            </div>

            {course.chapters.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No chapters added yet. Click "Add Chapter" to start building your course.
              </div>
            ) : (
              <div className="space-y-4">
                {course.chapters.map((chapter) => (
                  <div key={chapter.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                      <h3 className="font-medium text-slate-900">
                        Chapter {chapter.order}: {chapter.title}
                      </h3>
                      <button
                        onClick={() => { setActiveChapterId(chapter.id); setShowLessonModal(true); }}
                        className="text-xs font-medium bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-50"
                      >
                        + Lesson
                      </button>
                    </div>
                    <div className="p-4 bg-white">
                      {chapter.lessons.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">No lessons in this chapter.</p>
                      ) : (
                        <ul className="space-y-2">
                          {chapter.lessons.map((lesson) => (
                            <li key={lesson.id} className="flex items-center gap-3 text-sm p-2 hover:bg-slate-50 rounded-md">
                              {lesson.type === 'VIDEO' && <Video className="h-4 w-4 text-primary-500" />}
                              {lesson.type === 'TEXT' && <FileText className="h-4 w-4 text-emerald-500" />}
                              {lesson.type === 'PDF' && <File className="h-4 w-4 text-red-500" />}
                              <span className="flex-1 text-slate-700">{lesson.title}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Chapter</h3>
            <form onSubmit={handleAddChapter}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Chapter Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full border-slate-300 rounded-lg px-4 py-2 border focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Algebra Basics"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowChapterModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-500 rounded-lg">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Lesson</h3>
            <form onSubmit={handleAddLesson}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lesson Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full border-slate-300 rounded-lg px-4 py-2 border focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Solving Equations"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content Type</label>
                  <select name="type" className="w-full border-slate-300 rounded-lg px-4 py-2 border bg-white focus:ring-primary-500 focus:border-primary-500">
                    <option value="VIDEO">Video URL</option>
                    <option value="TEXT">Text Article</option>
                    <option value="PDF">PDF Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content / URL</label>
                  <input
                    type="text"
                    name="content"
                    required
                    className="w-full border-slate-300 rounded-lg px-4 py-2 border focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://youtube.com/... or text content"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowLessonModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-500 rounded-lg">Add Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
