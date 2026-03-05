
import React, { useState } from 'react';
import { MessageCircle, Heart, MoreHorizontal, CornerDownRight, Smile, Send } from 'lucide-react';
import { ReactionPicker, ReactionType } from './ReactionPicker';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string, parentId?: string) => void;
}

const CommentItem: React.FC<{ comment: Comment; onReply: (id: string, author: string) => void }> = ({ comment, onReply }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<ReactionType[]>([]);

  const handleReaction = (type: ReactionType) => {
    setReactions(prev => [...prev, type]);
    setShowReactions(false);
  };

  return (
    <div className="flex gap-3 group">
      <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} alt={comment.author} />
      </div>
      <div className="flex-1">
        <div className="bg-slate-100 rounded-2xl px-4 py-2 inline-block relative group/bubble">
          <h4 className="font-semibold text-sm text-slate-900">{comment.author}</h4>
          <p className="text-sm text-slate-800">{comment.content}</p>
          
          {/* Reaction Summary Bubble */}
          {reactions.length > 0 && (
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-1.5 py-0.5 shadow-sm border border-slate-100 flex items-center gap-0.5 text-[10px]">
              <span>👍</span>
              <span>{reactions.length + comment.likes}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-slate-500 font-medium">
          <span className="cursor-pointer hover:underline">{comment.timestamp}</span>
          <button 
            className={`hover:text-blue-600 relative ${reactions.length > 0 ? 'text-blue-600 font-semibold' : ''}`}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setTimeout(() => setShowReactions(false), 500)}
            onClick={() => {
              if (reactions.length > 0) {
                setReactions([]); // Unlike
              } else {
                handleReaction('Like'); // Default Like
              }
            }}
          >
            লাইক
            <ReactionPicker 
              isVisible={showReactions} 
              onSelect={handleReaction} 
              onClose={() => setShowReactions(false)}
              position="top"
            />
          </button>
          <button 
            className="hover:text-blue-600"
            onClick={() => onReply(comment.id, comment.author)}
          >
            রিপ্লাই
          </button>
        </div>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 pl-4 border-l-2 border-slate-100">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [replyTo, setReplyTo] = useState<{ id: string; author: string } | null>(null);
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddComment(text, replyTo?.id);
      setText('');
      setReplyTo(null);
      setShowEmoji(false);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Comments List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            onReply={(id, author) => setReplyTo({ id, author })} 
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="relative pt-2">
        {replyTo && (
          <div className="flex items-center justify-between bg-blue-50 px-3 py-1.5 rounded-t-lg text-xs text-blue-600 mb-0.5">
            <span className="flex items-center gap-1">
              <CornerDownRight size={12} />
              Replying to <b>{replyTo.author}</b>
            </span>
            <button onClick={() => setReplyTo(null)} className="hover:text-blue-800">
              <MoreHorizontal size={14} />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-end gap-2 bg-slate-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 overflow-hidden">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser`} alt="Me" />
          </div>
          
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="একটি মন্তব্য লিখুন..."
              className="w-full bg-transparent border-none focus:outline-none text-sm resize-none py-2 max-h-24"
              rows={1}
            />
            {showEmoji && (
              <div className="absolute bottom-full left-0 mb-2 z-50">
                <EmojiPicker 
                  onEmojiClick={(e) => setText(prev => prev + e.emoji)}
                  width={300}
                  height={350}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button 
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            >
              <Smile size={20} />
            </button>
            <button 
              type="submit"
              disabled={!text.trim()}
              className={`p-2 rounded-full transition-colors ${
                text.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} className={text.trim() ? 'ml-0.5' : ''} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
