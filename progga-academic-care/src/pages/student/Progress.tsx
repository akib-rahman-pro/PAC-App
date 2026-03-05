import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Award, TrendingUp } from 'lucide-react';

const ATTENDANCE_DATA = [
  { name: 'Jan', present: 22 },
  { name: 'Feb', present: 20 },
  { name: 'Mar', present: 24 },
  { name: 'Apr', present: 18 },
  { name: 'May', present: 23 },
];

const EXAM_DATA = [
  { name: 'Quiz 1', marks: 85 },
  { name: 'Mid', marks: 78 },
  { name: 'Quiz 2', marks: 92 },
  { name: 'Final', marks: 88 },
];

export const Progress = () => {
  return (
    <div className="h-full overflow-y-auto bg-stone-50 pb-20">
      <header className="bg-white px-4 py-4 border-b border-stone-100 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-stone-900">আমার প্রগ্রেস</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <Calendar size={20} />
              <span className="text-sm font-medium">উপস্থিতি</span>
            </div>
            <p className="text-2xl font-bold text-stone-900">৯২%</p>
            <p className="text-xs text-stone-500 mt-1">গত মাসের চেয়ে ২% বেশি</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Award size={20} />
              <span className="text-sm font-medium">গড় নম্বর</span>
            </div>
            <p className="text-2xl font-bold text-stone-900">৮৫.৫</p>
            <p className="text-xs text-stone-500 mt-1">গ্রেড: A+</p>
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-stone-400" />
            মাসিক উপস্থিতি
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#78716c'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#78716c'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f5f5f4'}}
                />
                <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exam Results Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Award size={18} className="text-stone-400" />
            পরীক্ষার ফলাফল
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={EXAM_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#78716c'}} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#78716c'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="marks" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
