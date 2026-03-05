
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Send, Users, User } from 'lucide-react';

interface ShareTarget {
  id: string;
  name: string;
  avatar?: string;
  type: 'user' | 'group';
  subtitle?: string;
}

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (targetIds: string[], message?: string) => void;
}

const MOCK_TARGETS: ShareTarget[] = [
  { id: '1', name: '১০ম শ্রেণী - গ্রুপ A', type: 'group', subtitle: '৪৫ জন সদস্য' },
  { id: '2', name: 'পদার্থবিজ্ঞান আলোচনা', type: 'group', subtitle: '১২০ জন সদস্য' },
  { id: '3', name: 'রাফসান আহমেদ', type: 'user', subtitle: 'শিক্ষক' },
  { id: '4', name: 'সাদিয়া ইসলাম', type: 'user', subtitle: 'শিক্ষার্থী' },
  { id: '5', name: 'অভিভাবক ফোরাম', type: 'group', subtitle: '২০০ জন সদস্য' },
];

export const ShareSheet: React.FC<ShareSheetProps> = ({ isOpen, onClose, onShare }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const filteredTargets = MOCK_TARGETS.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTarget = (id: string) => {
    setSelectedTargets(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleShare = () => {
    onShare(selectedTargets, message);
    onClose();
    setSelectedTargets([]);
    setMessage('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] flex flex-col shadow-2xl md:max-w-md md:left-1/2 md:-translate-x-1/2 md:rounded-2xl md:bottom-4 md:h-auto"
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">শেয়ার করুন</h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Targets List */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">সাজেস্টেড</p>
                {filteredTargets.map(target => (
                  <div
                    key={target.id}
                    onClick={() => toggleTarget(target.id)}
                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                      selectedTargets.includes(target.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${target.type === 'group' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {target.avatar ? (
                        <img src={target.avatar} alt={target.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        target.type === 'group' ? <Users size={20} /> : <User size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 text-sm">{target.name}</h4>
                      <p className="text-xs text-slate-500">{target.subtitle}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedTargets.includes(target.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                    }`}>
                      {selectedTargets.includes(target.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="pt-2">
                <textarea
                  placeholder="কিছু লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white md:rounded-b-2xl">
              <button
                onClick={handleShare}
                disabled={selectedTargets.length === 0}
                className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  selectedTargets.length > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
                <span>পাঠান ({selectedTargets.length})</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
