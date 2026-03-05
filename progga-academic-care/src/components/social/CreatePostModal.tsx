import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  UserPlus, 
  Smile, 
  MapPin, 
  FileImage, 
  MoreHorizontal,
  Globe,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, privacy: 'public' | 'friends') => void;
  userRole: UserRole;
  userName?: string;
  userAvatar?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  userRole,
  userName = 'User',
  userAvatar
}) => {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends'>('public');
  const [showPrivacySelector, setShowPrivacySelector] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content, privacy);
      setContent('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 relative">
              <h2 className="text-lg font-bold text-slate-900 w-full text-center">পোস্ট তৈরি করুন</h2>
              <button 
                onClick={onClose}
                className="absolute right-3 top-3 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Info & Privacy */}
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <img 
                  src={userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{userName}</h3>
                <div className="relative">
                  <button 
                    onClick={() => setShowPrivacySelector(!showPrivacySelector)}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md text-xs font-medium text-slate-600 transition-colors mt-0.5"
                  >
                    {privacy === 'public' ? <Globe size={12} /> : <Users size={12} />}
                    <span>{privacy === 'public' ? 'পাবলিক' : 'বন্ধুরা'}</span>
                    <span className="ml-1">▼</span>
                  </button>
                  
                  {/* Privacy Dropdown */}
                  {showPrivacySelector && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10">
                      <button 
                        onClick={() => { setPrivacy('public'); setShowPrivacySelector(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs font-medium flex items-center gap-2"
                      >
                        <Globe size={14} /> পাবলিক
                      </button>
                      <button 
                        onClick={() => { setPrivacy('friends'); setShowPrivacySelector(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs font-medium flex items-center gap-2"
                      >
                        <Users size={14} /> বন্ধুরা
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="flex-1 px-4 py-2 overflow-y-auto min-h-[150px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`আপনার মনের কথা লিখুন, ${userName}?`}
                className="w-full h-full min-h-[120px] resize-none text-lg placeholder:text-slate-400 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Add to Post Toolbar */}
            <div className="px-4 pb-4">
              <div className="border border-slate-200 rounded-lg p-3 flex items-center justify-between mb-4 shadow-sm">
                <span className="text-sm font-medium text-slate-900">আপনার পোস্টে যোগ করুন</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => console.log("Gallery clicked")}
                    className="p-2 hover:bg-slate-100 rounded-full text-green-500 transition-colors" 
                    title="Photo/Video"
                  >
                    <ImageIcon size={24} />
                  </button>
                  <button 
                    onClick={() => console.log("Tag Friends clicked")}
                    className="p-2 hover:bg-slate-100 rounded-full text-blue-500 transition-colors" 
                    title="Tag Friends"
                  >
                    <UserPlus size={24} />
                  </button>
                  <button 
                    onClick={() => console.log("Feeling/Activity clicked")}
                    className="p-2 hover:bg-slate-100 rounded-full text-yellow-500 transition-colors" 
                    title="Feeling/Activity"
                  >
                    <Smile size={24} />
                  </button>
                  <button 
                    onClick={() => console.log("Check In clicked")}
                    className="p-2 hover:bg-slate-100 rounded-full text-red-500 transition-colors" 
                    title="Check In"
                  >
                    <MapPin size={24} />
                  </button>
                  <button 
                    onClick={() => console.log("GIF clicked")}
                    className="p-2 hover:bg-slate-100 rounded-full text-teal-500 transition-colors" 
                    title="GIF"
                  >
                    <FileImage size={24} />
                  </button>
                  <button 
                    onClick={() => console.log("More options clicked")}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                  >
                    <MoreHorizontal size={24} />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  content.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-[0.99]' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                পোস্ট করুন
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
