
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ReactionType = 'Like' | 'Love' | 'Care' | 'Haha' | 'Wow' | 'Sad' | 'Angry';

interface ReactionPickerProps {
  isVisible: boolean;
  onSelect: (reaction: ReactionType) => void;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'Like', emoji: '👍', label: 'লাইক' },
  { type: 'Love', emoji: '❤️', label: 'লাভ' },
  { type: 'Care', emoji: '🥰', label: 'কেয়ার' },
  { type: 'Haha', emoji: '😂', label: 'হা হা' },
  { type: 'Wow', emoji: '😮', label: 'ওয়াও' },
  { type: 'Sad', emoji: '😢', label: 'স্যাড' },
  { type: 'Angry', emoji: '😡', label: 'রাগী' },
];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ isVisible, onSelect, onClose, position = 'top' }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
          className={`absolute ${position === 'top' ? '-top-12' : '-bottom-12'} left-0 bg-white rounded-full shadow-xl border border-slate-200 p-1 flex items-center gap-1 z-50`}
          onMouseLeave={onClose}
        >
          {REACTIONS.map((reaction, index) => (
            <motion.button
              key={reaction.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.3, y: -5 }}
              className="p-1.5 text-2xl relative group transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(reaction.type);
              }}
            >
              <span className="block transform transition-transform duration-200 group-hover:scale-110">
                {reaction.emoji}
              </span>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {reaction.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
