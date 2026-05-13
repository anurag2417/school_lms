import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Calendar, Save, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function TeacherAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'PRESENT'|'ABSENT'|'LATE' }
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchStudents(selectedCourseId);
      fetchSessions(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/courses');
      setCourses(res.data.data);
    } catch (error) {
      toast.error('Failed to load courses');
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/enrollments/course/${courseId}`);
      const enrolledStudents = res.data.data.map(e => e.student);
      setStudents(enrolledStudents);
      
      // Initialize attendance
      const initialAtt = {};
      enrolledStudents.forEach(s => {
        initialAtt[s.id] = 'PRESENT'; // Default to present
      });
      setAttendance(initialAtt);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async (courseId) => {
    try {
      const res = await axios.get(`/attendance/session/${courseId}`);
      setSessions(res.data.data);
    } catch (error) {
      console.error('Failed to load sessions');
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedCourseId || !date) return toast.error('Select course and date');
    
    const records = Object.keys(attendance).map(studentId => ({
      studentId,
      status: attendance[studentId]
    }));

    try {
      setLoading(true);
      await axios.post('/attendance/session', {
        courseId: selectedCourseId,
        date,
        records
      });
      toast.success('Attendance saved successfully!');
      fetchSessions(selectedCourseId);
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary-600" /> Take Attendance
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
              >
                <option value="">-- Choose a Course --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title} ({course.grade})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
              />
            </div>
          </div>

          {selectedCourseId && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Student Roster</h3>
                <span className="text-sm text-slate-500">{students.length} Students</span>
              </div>
              
              {loading ? (
                <div className="p-8 text-center text-slate-500">Loading roster...</div>
              ) : students.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No students enrolled in this course.</div>
              ) : (
                <>
                  <ul className="divide-y divide-slate-100">
                    {students.map(student => (
                      <li key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {student.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{student.user?.name}</p>
                            <p className="text-xs text-slate-500">{student.user?.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                            className={`px-3 py-1.5 rounded-md flex items-center gap-1 text-sm font-medium transition-colors ${
                              attendance[student.id] === 'PRESENT' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <CheckCircle className="h-4 w-4" /> Present
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                            className={`px-3 py-1.5 rounded-md flex items-center gap-1 text-sm font-medium transition-colors ${
                              attendance[student.id] === 'ABSENT' 
                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <XCircle className="h-4 w-4" /> Absent
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'LATE')}
                            className={`px-3 py-1.5 rounded-md flex items-center gap-1 text-sm font-medium transition-colors ${
                              attendance[student.id] === 'LATE' 
                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <Clock className="h-4 w-4" /> Late
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                      onClick={handleSaveAttendance}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" /> Save Attendance
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Recent Sessions Sidebar */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Past Sessions</h3>
            {!selectedCourseId ? (
              <p className="text-sm text-slate-500 text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">Select a course to view past sessions.</p>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No attendance records found.</p>
            ) : (
              <div className="space-y-4">
                {sessions.map(session => {
                  const presentCount = session.records.filter(r => r.status === 'PRESENT').length;
                  const totalCount = session.records.length;
                  return (
                    <div key={session.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900">{format(new Date(session.date), 'MMM d, yyyy')}</span>
                        <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                          {presentCount}/{totalCount} Present
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${totalCount ? (presentCount/totalCount)*100 : 0}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
