import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get('/attendance/student');
      const data = res.data.data;
      setRecords(data);
      
      const s = { present: 0, absent: 0, late: 0, total: data.length };
      data.forEach(r => {
        if (r.status === 'PRESENT') s.present++;
        else if (r.status === 'ABSENT') s.absent++;
        else if (r.status === 'LATE') s.late++;
      });
      setStats(s);
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const attendancePercentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <Calendar className="h-6 w-6 text-primary-600" /> My Attendance
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Overall Attendance</p>
            <p className="text-2xl font-bold text-slate-900">{attendancePercentage}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Present</p>
            <p className="text-2xl font-bold text-slate-900">{stats.present}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Absent</p>
            <p className="text-2xl font-bold text-slate-900">{stats.absent}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Late</p>
            <p className="text-2xl font-bold text-slate-900">{stats.late}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {records.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No attendance records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {format(new Date(record.session.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {record.session.course.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.status === 'PRESENT' && <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1 self-center"/> Present</span>}
                    {record.status === 'ABSENT' && <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1 self-center"/> Absent</span>}
                    {record.status === 'LATE' && <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1 self-center"/> Late</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
