import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, UserX, UserCheck, Shield, Phone, Mail, MapPin, School } from 'lucide-react';
import { UserRole } from '../../types';

export interface UserProfileData {
  id: string;
  name: string;
  role: UserRole;
  className?: string;
  avatar?: string;
  mobile?: string;
  email?: string;
  address?: string;
  bio?: string;
}

interface UserProfileProps {
  user: UserProfileData;
  viewerRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  viewerRole, 
  isOpen, 
  onClose,
  onBlock,
  onUnblock
}) => {
  const isStudent = user.role === 'student';
  const isAdmin = viewerRole === 'admin' || viewerRole === 'moderator';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Cover Photo */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
              <button 
                onClick={onClose}
                className="absolute right-3 top-3 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6 relative">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white absolute -top-12 left-6 shadow-md overflow-hidden">
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 gap-2">
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                  <MessageCircle size={20} />
                </button>
                {isAdmin && (
                  <button 
                    onClick={onBlock}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                    title="Block User"
                  >
                    <UserX size={20} />
                  </button>
                )}
              </div>

              {/* Name & Bio */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  {user.name}
                  {user.role === 'admin' && <Shield size={18} className="text-blue-600" />}
                </h2>
                <p className="text-slate-500 font-medium capitalize flex items-center gap-2">
                  {user.role}
                  {user.className && <span className="text-slate-400">• {user.className}</span>}
                </p>
                {user.bio && <p className="text-slate-600 mt-2 text-sm">{user.bio}</p>}
              </div>

              {/* Details List */}
              <div className="mt-6 space-y-3">
                {user.className && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <School size={18} className="text-slate-400" />
                    <span className="text-sm">শ্রেণী: <span className="font-medium text-slate-900">{user.className}</span></span>
                  </div>
                )}
                
                {(isAdmin || user.role === 'teacher') && user.mobile && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={18} className="text-slate-400" />
                    <span className="text-sm">{user.mobile}</span>
                  </div>
                )}

                {(isAdmin || user.role === 'teacher') && user.email && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                )}

                {user.address && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin size={18} className="text-slate-400" />
                    <span className="text-sm">{user.address}</span>
                  </div>
                )}
              </div>

              {/* Stats (Mock) */}
              <div className="mt-6 flex border-t border-slate-100 pt-4">
                <div className="flex-1 text-center border-r border-slate-100">
                  <div className="font-bold text-slate-900">১২০</div>
                  <div className="text-xs text-slate-500">পোস্ট</div>
                </div>
                <div className="flex-1 text-center border-r border-slate-100">
                  <div className="font-bold text-slate-900">৪৫০</div>
                  <div className="text-xs text-slate-500">ফলোয়ার</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="font-bold text-slate-900">৩২০</div>
                  <div className="text-xs text-slate-500">ফলোইং</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
