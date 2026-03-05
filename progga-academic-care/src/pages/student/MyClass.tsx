import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../components/ui';
import { ChatWindow, Message } from '../../components/chat/ChatWindow';
import { UserProfileData } from '../../components/chat/UserProfile';
import SecurePDFViewer from '../SecurePDFViewer';

const CURRENT_USER: UserProfileData = {
  id: 'me',
  name: 'আকিব রহমান',
  role: 'student',
  className: '১০ম শ্রেণী - বিজ্ঞান',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
};

const GROUP_USER: UserProfileData = {
  id: 'group_10_sci',
  name: '১০ম শ্রেণী - বিজ্ঞান শাখা',
  role: 'student',
  className: '১০ম শ্রেণী',
  avatar: 'https://ui-avatars.com/api/?name=Class+10+Science&background=0D9488&color=fff',
};

const INITIAL_MESSAGES: Message[] = [
  { id: '1', senderId: 'teacher1', text: "আগামীকাল পরীক্ষা হবে।", timestamp: new Date(Date.now() - 86400000), status: 'read', isMe: false },
  { id: '2', senderId: 'me', text: "স্যার, সিলেবাস কি চ্যাপ্টার ৩ পর্যন্ত?", timestamp: new Date(Date.now() - 86300000), status: 'read', isMe: true },
  { id: '3', senderId: 'teacher1', text: "হ্যাঁ, চ্যাপ্টার ১, ২ এবং ৩।", timestamp: new Date(Date.now() - 86200000), status: 'read', isMe: false },
];

export const MyClass = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'group_chat'>('posts');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date(),
      status: 'sent',
      isMe: true,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="h-full flex flex-col bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 px-4 py-3 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-stone-900">১০ম শ্রেণী - বিজ্ঞান শাখা</h1>
        <p className="text-xs text-stone-500">রোল: ১২ • ব্যাচ: প্রভাতী</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-stone-100 bg-white sticky top-[60px] z-10">
        <button
          onClick={() => setActiveTab('posts')}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors relative",
            activeTab === 'posts' ? "text-emerald-600" : "text-stone-500"
          )}
        >
          পোস্ট (নোটিশ/নোটস)
          {activeTab === 'posts' && (
            <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('group_chat')}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors relative",
            activeTab === 'group_chat' ? "text-emerald-600" : "text-stone-500"
          )}
        >
          গ্রুপ চ্যাট
          {activeTab === 'group_chat' && (
            <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'group_chat' ? (
          <div className="h-full">
             <ChatWindow
              chatId="group_chat"
              currentUser={CURRENT_USER}
              otherUser={GROUP_USER}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBack={() => {}} 
              onProfileClick={() => {}}
            />
          </div>
        ) : (
          <div className="p-4 space-y-3 overflow-y-auto h-full pb-20">
            <SecurePDFViewer />
          </div>
        )}
      </div>
    </div>
  );
};
