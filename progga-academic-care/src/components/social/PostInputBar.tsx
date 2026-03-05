import React from 'react';
import { Video, Image, Smile } from 'lucide-react';
import { UserRole } from '../../types';

interface PostInputBarProps {
  userRole: UserRole;
  userName?: string;
  userAvatar?: string;
  onClick: () => void;
}

export const PostInputBar: React.FC<PostInputBarProps> = ({ 
  userRole, 
  userName = 'User', 
  userAvatar,
  onClick 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 cursor-pointer">
          <img 
            src={userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} 
            alt="User" 
            className="w-full h-full object-cover"
          />
        </div>
        <div 
          onClick={onClick}
          className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full px-4 py-2.5 cursor-pointer flex items-center"
        >
          <span className="text-slate-500 text-sm truncate">
            আপনার মনের কথা লিখুন, {userName}?
          </span>
        </div>
      </div>
      
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between px-2">
        <button 
          onClick={onClick}
          className="flex items-center gap-2 text-slate-500 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors flex-1 justify-center"
        >
          <Video className="text-red-500" size={24} />
          <span className="text-sm font-medium text-slate-600 hidden sm:inline">লাইভ ভিডিও</span>
        </button>
        
        <button 
          onClick={onClick}
          className="flex items-center gap-2 text-slate-500 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors flex-1 justify-center"
        >
          <Image className="text-green-500" size={24} />
          <span className="text-sm font-medium text-slate-600 hidden sm:inline">ছবি/ভিডিও</span>
        </button>
        
        <button 
          onClick={onClick}
          className="flex items-center gap-2 text-slate-500 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors flex-1 justify-center"
        >
          <Smile className="text-yellow-500" size={24} />
          <span className="text-sm font-medium text-slate-600 hidden sm:inline">অনুভূতি</span>
        </button>
      </div>
    </div>
  );
};
