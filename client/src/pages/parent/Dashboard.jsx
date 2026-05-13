import React from 'react';

export default function ParentDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Parent Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Child Attendance', 'Pending Fees'].map((stat) => (
          <div key={stat} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm font-medium text-slate-500">{stat}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">Good</p>
          </div>
        ))}
      </div>
    </div>
  );
}
