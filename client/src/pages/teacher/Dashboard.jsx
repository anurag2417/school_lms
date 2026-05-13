import React from 'react';

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['My Courses', 'Pending Assignments', 'Upcoming Classes'].map((stat) => (
          <div key={stat} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm font-medium text-slate-500">{stat}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
          </div>
        ))}
      </div>
    </div>
  );
}
