import { Users } from 'lucide-react';

export default function AdminTeachers() {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center py-20 text-slate-500">
      <Users className="h-16 w-16 text-slate-300 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900">Teacher Management</h1>
      <p>This module is currently under construction. Teacher profiles and assignments will be managed here.</p>
    </div>
  );
}
