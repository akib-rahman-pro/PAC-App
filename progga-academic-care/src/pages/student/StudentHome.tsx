import React from 'react';
import { Bell } from 'lucide-react';
import Feed from '../../pages/Feed';

export const StudentHome = () => {
  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-stone-900">প্রজ্ঞা একাডেমিক</h1>
          <p className="text-xs text-stone-500">স্বাগতম, আকিব রহমান</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-full hover:bg-stone-100 relative">
            <Bell size={20} className="text-stone-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* Feed */}
      <div className="p-4">
        <Feed userRole="student" />
      </div>
    </div>
  );
};
