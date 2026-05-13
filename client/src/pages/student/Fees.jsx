import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { format, isPast } from 'date-fns';

export default function StudentFees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await axios.get('/fees/student');
      setFees(res.data.data);
    } catch (error) {
      toast.error('Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentId) => {
    try {
      setProcessingId(paymentId);
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await axios.post(`/fees/payment/${paymentId}`);
      toast.success('Payment successful!');
      fetchFees();
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  const totalPending = fees.reduce((acc, fee) => fee.status === 'PENDING' || fee.status === 'OVERDUE' ? acc + fee.amount : acc, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary-600" /> Fee Management
        </h1>
        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">Total Outstanding:</span>
          <span className={`text-2xl font-bold ${totalPending > 0 ? 'text-red-600' : 'text-green-600'}`}>
            ₹{totalPending.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {fees.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No fee records found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {fees.map((fee) => {
              const isOverdue = fee.status === 'PENDING' && isPast(new Date(fee.feeStructure.dueDate));
              const displayStatus = fee.status === 'PAID' ? 'PAID' : isOverdue ? 'OVERDUE' : 'PENDING';
              
              return (
                <div key={fee.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-slate-900">{fee.feeStructure.name}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                        {fee.feeStructure.type}
                      </span>
                      {displayStatus === 'PAID' && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Paid</span>}
                      {displayStatus === 'OVERDUE' && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Overdue</span>}
                      {displayStatus === 'PENDING' && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>}
                    </div>
                    
                    <p className="text-sm text-slate-500">Academic Year: {fee.feeStructure.academicYear}</p>
                    
                    {fee.status === 'PAID' ? (
                      <div className="mt-3 text-sm text-slate-500 flex items-center gap-4">
                        <span>Paid on: <span className="font-medium text-slate-900">{format(new Date(fee.paidAt), 'MMM d, yyyy')}</span></span>
                        <span>Receipt: <span className="font-mono text-slate-900">{fee.receiptNo}</span></span>
                      </div>
                    ) : (
                      <div className="mt-3 text-sm text-slate-500">
                        Due Date: <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-slate-900'}`}>{format(new Date(fee.feeStructure.dueDate), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="text-2xl font-bold text-slate-900">₹{fee.amount.toFixed(2)}</div>
                    {fee.status !== 'PAID' && (
                      <button
                        onClick={() => handlePayment(fee.id)}
                        disabled={processingId === fee.id}
                        className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {processingId === fee.id ? 'Processing...' : 'Pay Now'}
                      </button>
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
