import { GraduationCap } from 'lucide-react';

export default function StudentGrades() {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center py-20 text-slate-500">
      <GraduationCap className="h-16 w-16 text-slate-300 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900">Grades Central</h1>
      <p>This module is currently under construction. Check back later to see your official report cards!</p>
    </div>
  );
}
