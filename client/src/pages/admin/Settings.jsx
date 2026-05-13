import { Settings } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center py-20 text-slate-500">
      <Settings className="h-16 w-16 text-slate-300 mb-4 animate-spin-slow" />
      <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
      <p>Global LMS configurations will be available here soon.</p>
    </div>
  );
}
