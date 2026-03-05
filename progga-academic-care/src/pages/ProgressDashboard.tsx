import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Card, Badge } from '../components/ui';
import { calculateProgress, MOCK_ACADEMIC_RECORDS } from '../services/security';
import { TrendingUp, Calendar, Award } from 'lucide-react';

export default function ProgressDashboard() {
  const stats = calculateProgress(MOCK_ACADEMIC_RECORDS);
  const { attendance, examTrends } = stats;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <TrendingUp className="text-blue-600" />
        প্রগ্রেস রিপোর্ট (Progress Report)
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">উপস্থিতির হার</p>
              <h3 className="text-3xl font-bold mt-1">{attendance.percentage}%</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-xs text-blue-100 mt-4">
            মোট ক্লাস: {attendance.total} | উপস্থিত: {attendance.present}
          </p>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">গড় নম্বর (Average)</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">86%</h3>
            </div>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Award size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-4 font-medium">
            গত মাসের চেয়ে ৫% উন্নতি হয়েছে
          </p>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">পেমেন্ট স্ট্যাটাস</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">পরিশোধিত</h3>
            </div>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Award size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            জানুয়ারি ২০২৪ পর্যন্ত ক্লিয়ার
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Performance Bar Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 mb-6">বিষয়ভিত্তিক ফলাফল (Exam Marks)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={examTrends.slice(0, 4)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="percentage" name="Marks (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Performance Trend Line Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 mb-6">উন্নতির গ্রাফ (Performance Trend)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={examTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  name="Overall %" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{fill: '#10b981', strokeWidth: 2}} 
                  activeDot={{r: 6}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
