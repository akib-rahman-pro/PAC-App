import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, Heart, Smile, Frown, Angry } from 'lucide-react';
import { ReactionType, REACTION_EMOJIS } from '../../types';

interface ReactionUser {
  user: string;
  type: ReactionType;
  avatar?: string;
}

interface ReactionListModalProps {
  isOpen: boolean;
  onClose: () => void;
  reactions: ReactionUser[];
}

const TABS: { type: 'all' | ReactionType; label: string; icon?: any; color?: string }[] = [
  { type: 'all', label: 'সব' },
  { type: 'Like', label: 'লাইক', icon: ThumbsUp, color: 'text-blue-600' },
  { type: 'Love', label: 'লাভ', icon: Heart, color: 'text-red-500' },
  { type: 'Care', label: 'কেয়ার', icon: Heart, color: 'text-pink-500' },
  { type: 'Haha', label: 'হা হা', icon: Smile, color: 'text-yellow-500' },
  { type: 'Wow', label: 'ওয়াও', icon: Smile, color: 'text-yellow-500' },
  { type: 'Sad', label: 'স্যাড', icon: Frown, color: 'text-yellow-500' },
  { type: 'Angry', label: 'রাগী', icon: Angry, color: 'text-orange-600' },
];

export const ReactionListModal: React.FC<ReactionListModalProps> = ({ isOpen, onClose, reactions }) => {
  const [activeTab, setActiveTab] = useState<'all' | ReactionType>('all');

  const filteredReactions = activeTab === 'all' 
    ? reactions 
    : reactions.filter(r => r.type === activeTab);

  // Count reactions for tabs
  const counts = reactions.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {TABS.map(tab => {
                  const count = tab.type === 'all' ? reactions.length : counts[tab.type];
                  if (tab.type !== 'all' && !count) return null;

                  return (
                    <button
                      key={tab.type}
                      onClick={() => setActiveTab(tab.type)}
                      className={`flex items-center gap-1.5 pb-2 border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.type 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <span className="text-lg">
                        {tab.type === 'all' ? 'সব' : REACTION_EMOJIS[tab.type as ReactionType]}
                      </span>
                      <span className="text-sm font-medium">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors ml-2 flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredReactions.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  কোনো প্রতিক্রিয়া নেই
                </div>
              ) : (
                filteredReactions.map((reaction, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img 
                          src={reaction.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reaction.user}`} 
                          alt={reaction.user} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <span className="text-sm">{REACTION_EMOJIS[reaction.type]}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm">{reaction.user}</h4>
                    </div>
                    {/* Add Friend Button (Mock) */}
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors">
                      অ্যাড ফ্রেন্ড
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
