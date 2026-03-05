import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, MoreVertical, Phone, Video, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { UserProfileData } from './UserProfile';
import { ReactionPicker, ReactionType } from '../social/ReactionPicker';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  reactions?: { [emoji: string]: number }; // e.g., { '❤️': 1 }
  isMe: boolean;
}

interface ChatWindowProps {
  chatId: string;
  currentUser: UserProfileData;
  otherUser: UserProfileData;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  onProfileClick: () => void;
  isTyping?: boolean;
}

const REACTION_EMOJIS: Record<ReactionType, string> = {
  Like: '👍',
  Love: '❤️',
  Care: '🥰',
  Haha: '😂',
  Wow: '😮',
  Sad: '😢',
  Angry: '😡'
};

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  currentUser,
  otherUser,
  messages,
  onSendMessage,
  onBack,
  onProfileClick,
  isTyping = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [showReactions, setShowReactions] = useState<string | null>(null); // Message ID
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  const handleReactionSelect = (msgId: string, type: ReactionType) => {
    // In a real app, you would send this to the server
    console.log(`Reacted to message ${msgId} with ${type}`);
    setShowReactions(null);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <header className="px-4 py-3 border-b border-stone-100 flex items-center justify-between bg-white z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-stone-100 rounded-full md:hidden">
            <ArrowLeft size={20} className="text-stone-600" />
          </button>
          
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-stone-50 p-1 rounded-lg transition-colors"
            onClick={onProfileClick}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold overflow-hidden">
                {otherUser.avatar ? (
                  <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
                ) : (
                  otherUser.name[0]
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 leading-tight">{otherUser.name}</h3>
              <p className="text-xs text-stone-500">
                {isTyping ? <span className="text-emerald-600 font-medium animate-pulse">টাইপ করছেন...</span> : 'সক্রিয়'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-stone-100 rounded-full text-stone-500">
            <Phone size={20} />
          </button>
          <button className="p-2 hover:bg-stone-100 rounded-full text-stone-500">
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-stone-100 rounded-full text-stone-500">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50" onClick={() => setShowReactions(null)}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} group relative`}
          >
            {/* Avatar for other user */}
            {!msg.isMe && (
              <div className="w-8 h-8 rounded-full bg-stone-200 mr-2 self-end mb-1 overflow-hidden shrink-0">
                 {otherUser.avatar ? (
                  <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
                ) : (
                  otherUser.name[0]
                )}
              </div>
            )}

            <div className="max-w-[75%] relative">
              {/* Message Bubble */}
              <div
                className={`px-4 py-2 rounded-2xl text-sm relative cursor-pointer select-none ${
                  msg.isMe
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-100 rounded-bl-none shadow-sm'
                }`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowReactions(msg.id);
                }}
                // Long press for mobile
                onTouchStart={(e) => {
                   const timer = setTimeout(() => setShowReactions(msg.id), 500);
                   e.target.addEventListener('touchend', () => clearTimeout(timer), { once: true });
                }}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                
                {/* Timestamp & Status */}
                <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${msg.isMe ? 'text-emerald-100' : 'text-stone-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.isMe && (
                    <span>
                      {msg.status === 'sent' && <Check size={12} />}
                      {msg.status === 'delivered' && <CheckCheck size={12} />}
                      {msg.status === 'read' && <CheckCheck size={12} className="text-blue-200" />}
                    </span>
                  )}
                </div>

                {/* Reactions Display */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="absolute -bottom-2 right-0 bg-white border border-stone-100 rounded-full px-1 py-0.5 shadow-sm flex items-center gap-0.5 text-xs z-10">
                    {Object.keys(msg.reactions).map((emoji) => (
                      <span key={emoji}>{emoji}</span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Reaction Picker */}
              <div className={`absolute -top-12 ${msg.isMe ? 'right-0' : 'left-0'} z-20`}>
                <ReactionPicker 
                  isVisible={showReactions === msg.id}
                  onSelect={(type) => handleReactionSelect(msg.id, type)}
                  onClose={() => setShowReactions(null)}
                  position="top"
                />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden">
               {otherUser.avatar ? (
                  <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
                ) : (
                  otherUser.name[0]
                )}
            </div>
            <div className="bg-white border border-stone-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                className="w-2 h-2 bg-stone-400 rounded-full"
              />
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                className="w-2 h-2 bg-stone-400 rounded-full"
              />
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                className="w-2 h-2 bg-stone-400 rounded-full"
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-stone-100 flex items-end gap-2 relative">
        {/* Emoji Picker Popover */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 left-4 z-50 shadow-xl rounded-xl border border-stone-200"
              ref={emojiPickerRef}
            >
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                width={300}
                height={400}
                searchDisabled={false}
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'bg-emerald-100 text-emerald-600' : 'text-stone-400 hover:text-emerald-600 hover:bg-stone-50'}`}
        >
          <Smile size={24} />
        </button>
        <div className="flex-1 bg-stone-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="মেসেজ লিখুন..."
            className="w-full bg-transparent border-none focus:outline-none resize-none max-h-32 text-sm py-1"
            rows={1}
            style={{ minHeight: '24px' }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className={`p-3 rounded-full transition-all ${
            inputText.trim()
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transform hover:scale-105'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
          }`}
        >
          <Send size={20} className={inputText.trim() ? 'ml-0.5' : ''} />
        </button>
      </div>
    </div>
  );
};
