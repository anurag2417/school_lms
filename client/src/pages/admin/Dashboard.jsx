import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Bell, Send } from 'lucide-react';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({ title: '', message: '', targetRole: 'ALL' });
  const [loading, setLoading] = useState(false);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/notifications', formData);
      toast.success('Announcement sent successfully!');
      setFormData({ title: '', message: '', targetRole: 'ALL' });
    } catch (error) {
      toast.error('Failed to send announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder cards */}
        {['Total Students', 'Total Teachers', 'Total Courses', 'Active Classes'].map((stat) => (
          <div key={stat} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">120</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 max-w-2xl mt-8 transition-colors duration-300">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-primary-600 dark:text-primary-400" /> Send Global Announcement
        </h2>
        <form onSubmit={handleSendNotification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Audience</label>
            <select
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className="mt-1 block w-full rounded-lg border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white dark:bg-slate-700 dark:text-white transition-colors duration-300"
            >
              <option value="ALL">Everyone</option>
              <option value="STUDENTS">Students Only</option>
              <option value="TEACHERS">Teachers Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-lg border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 sm:text-sm px-4 py-2 border bg-white dark:bg-slate-700 dark:text-white transition-colors duration-300"
              placeholder="E.g., School Closed Tomorrow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
            <textarea
              required
              rows="3"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1 block w-full rounded-lg border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 sm:text-sm px-4 py-2 border bg-white dark:bg-slate-700 dark:text-white transition-colors duration-300"
              placeholder="Write your announcement here..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> {loading ? 'Sending...' : 'Send Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
