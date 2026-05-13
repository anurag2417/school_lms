import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CreditCard, Plus, IndianRupee, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminFees() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    grade: '10th',
    type: 'TUITION',
    academicYear: '2025-2026'
  });

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    try {
      const res = await axios.get('/fees/structure');
      setStructures(res.data.data);
    } catch (error) {
      toast.error('Failed to load fee structures');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/fees/structure', formData);
      toast.success(`Created structure and assigned to ${res.data.assignedCount} students!`);
      setShowModal(false);
      fetchStructures();
    } catch (error) {
      toast.error('Failed to create fee structure');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary-600" /> Fee Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
        >
          <Plus className="h-4 w-4" /> Create Fee Structure
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {structures.map(structure => (
          <div key={structure.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-primary-600">
              <IndianRupee className="h-24 w-24" />
            </div>
            <div className="relative z-10">
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded uppercase tracking-wide">
                {structure.type}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-3">{structure.name}</h3>
              <p className="text-sm text-slate-500 mb-4">Grade {structure.grade} • {structure.academicYear}</p>
              
              <div className="text-3xl font-bold text-primary-600 mb-6">
                ₹{structure.amount.toFixed(2)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Due Date:</span>
                  <span className="font-medium text-slate-900">{format(new Date(structure.dueDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Assigned Students:</span>
                  <span className="font-medium text-slate-900 flex items-center gap-1">
                    <Users className="h-4 w-4 text-slate-400" /> {structure._count?.payments || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {structures.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
            <CreditCard className="h-12 w-12 text-slate-300 mb-2" />
            <p>No fee structures created yet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">New Fee Structure</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Fee Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                  placeholder="e.g., Q1 Tuition Fee"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Target Grade</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
                  >
                    <option value="6th">6th Grade</option>
                    <option value="7th">7th Grade</option>
                    <option value="8th">8th Grade</option>
                    <option value="9th">9th Grade</option>
                    <option value="10th">10th Grade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Fee Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
                  >
                    <option value="TUITION">Tuition</option>
                    <option value="EXAM">Exam Fee</option>
                    <option value="TRANSPORT">Transport</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500"
                >
                  Create & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
