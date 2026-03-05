import React, { useState } from 'react';
import { Search, Edit } from 'lucide-react';
import { ChatWindow, Message } from '../../components/chat/ChatWindow';
import { UserProfile, UserProfileData, UserRole } from '../../components/chat/UserProfile';

// --- Mock Data ---

const CURRENT_USER: UserProfileData = {
  id: 'me',
  name: 'আকিব রহমান',
  role: 'student',
  className: '১০ম শ্রেণী - বিজ্ঞান',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
};

const MOCK_USERS: Record<string, UserProfileData> = {
  '1': {
    id: '1',
    name: 'তানভীর স্যার (Physics)',
    role: 'teacher',
    className: 'পদার্থবিজ্ঞান বিভাগ',
    mobile: '01700000000',
    email: 'tanvir.physics@school.edu',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=150&h=150',
  },
  '2': {
    id: '2',
    name: '১০ম শ্রেণী - গ্রুপ চ্যাট',
    role: 'student', // Group chat logic simplified for UI demo
    className: '১০ম শ্রেণী',
    avatar: 'https://ui-avatars.com/api/?name=Group+Chat&background=0D9488&color=fff',
  },
  '3': {
    id: '3',
    name: 'সাদমান সাকিব',
    role: 'student',
    className: '১০ম শ্রেণী - বিজ্ঞান',
    mobile: '01900000000',
    email: 'sadman.sakib@student.edu',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150',
  },
  '4': {
    id: '4',
    name: 'অফিস এডমিন',
    role: 'moderator',
    mobile: '01800000000',
    email: 'admin@school.edu',
    avatar: 'https://ui-avatars.com/api/?name=Office+Admin&background=6366f1&color=fff',
  },
};

const MOCK_CHATS = [
  { id: '1', userId: '1', lastMsg: "আগামীকাল প্র্যাক্টিক্যাল খাতা জমা দিবে।", time: "10m", unread: 2, online: true },
  { id: '2', userId: '2', lastMsg: "রাকিব: দোস্ত কালকে কি স্কুল খোলা?", time: "1h", unread: 0, online: false },
  { id: '3', userId: '3', lastMsg: "নোটসগুলো পাঠাস তো।", time: "2h", unread: 0, online: true },
  { id: '4', userId: '4', lastMsg: "তোমার বেতন পরিশোধ হয়েছে।", time: "1d", unread: 0, online: false },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: '1', text: 'আগামীকাল প্র্যাক্টিক্যাল খাতা জমা দিবে।', timestamp: new Date(Date.now() - 600000), status: 'sent', isMe: false },
  ],
  '3': [
    { id: 'm1', senderId: 'me', text: 'দোস্ত, আজকের ফিজিক্স নোটসগুলো আছে?', timestamp: new Date(Date.now() - 7200000), status: 'read', isMe: true },
    { id: 'm2', senderId: '3', text: 'হ্যাঁ আছে। ছবি তুলে পাঠাচ্ছি।', timestamp: new Date(Date.now() - 7100000), status: 'read', isMe: false },
    { id: 'm3', senderId: '3', text: 'নোটসগুলো পাঠাস তো।', timestamp: new Date(Date.now() - 7000000), status: 'delivered', isMe: false },
  ],
};

export const Messages = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const activeChatUser = selectedChatId ? MOCK_USERS[MOCK_CHATS.find(c => c.id === selectedChatId)?.userId || ''] : null;

  const handleSendMessage = (text: string) => {
    if (!selectedChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date(),
      status: 'sent',
      isMe: true,
    };

    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
    }));
  };

  const handleBlock = (userId: string) => {
    setBlockedUsers(prev => [...prev, userId]);
    // In a real app, this would also call an API
    alert(`${MOCK_USERS[userId].name} কে ব্লক করা হয়েছে।`);
    setShowProfile(false);
  };

  const handleUnblock = (userId: string) => {
    setBlockedUsers(prev => prev.filter(id => id !== userId));
    alert(`${MOCK_USERS[userId].name} কে আনব্লক করা হয়েছে।`);
    setShowProfile(false);
  };

  // If a chat is selected, show the ChatWindow
  if (selectedChatId && activeChatUser) {
    return (
      <>
        <ChatWindow
          chatId={selectedChatId}
          currentUser={CURRENT_USER}
          otherUser={activeChatUser}
          messages={messages[selectedChatId] || []}
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedChatId(null)}
          onProfileClick={() => setShowProfile(true)}
          isTyping={selectedChatId === '3'} // Mock typing for demo
        />
        
        {/* Profile Modal */}
        <UserProfile
          user={{...activeChatUser, isBlocked: blockedUsers.includes(activeChatUser.id)}}
          viewerRole={CURRENT_USER.role}
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
        />
      </>
    );
  }

  // Otherwise, show the Chat List
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="px-4 py-3 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold text-stone-900">মেসেজ</h1>
        <button className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
          <Edit size={20} className="text-stone-600" />
        </button>
      </header>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="খুঁজুন..." 
            className="w-full bg-stone-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {MOCK_CHATS.map((chat) => {
          const user = MOCK_USERS[chat.userId];
          return (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChatId(chat.id)}
              className="px-4 py-3 flex items-center gap-3 hover:bg-stone-50 cursor-pointer transition-colors border-b border-stone-50 last:border-0"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold text-lg overflow-hidden shadow-sm">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name[0]
                  )}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-stone-900 truncate text-base">{user.name}</h3>
                  <span className={`text-xs shrink-0 ${chat.unread > 0 ? 'text-emerald-600 font-bold' : 'text-stone-400'}`}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate pr-2 ${chat.unread > 0 ? 'text-stone-900 font-medium' : 'text-stone-500'}`}>
                    {chat.unread > 0 ? chat.lastMsg : `আপনি: ${chat.lastMsg}`}
                  </p>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0 shadow-sm">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
