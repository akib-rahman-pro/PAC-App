import React, { useState } from 'react';
import { Search, MessageSquare, AlertTriangle, UserX } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { getStudentChatHistory, ChatMessage } from '../services/security';

export default function ModeratorSpy() {
  const [studentId, setStudentId] = useState('');
  const [chats, setChats] = useState<ChatMessage[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const history = getStudentChatHistory(studentId);
      setChats(history);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <UserX className="text-red-600" />
          মনিটরিং প্যানেল (Spy Mode)
        </h2>
        <Badge variant="destructive">CONFIDENTIAL</Badge>
      </div>

      <Card className="p-6 bg-slate-900 text-white border-slate-800">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="শিক্ষার্থীর আইডি (Student UID) লিখুন..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-white placeholder-slate-500"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'অনুসন্ধান হচ্ছে...' : 'যাচাই করুন'}
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
          <AlertTriangle size={12} className="text-yellow-500" />
          সতর্কতা: এই অ্যাকশনটি অ্যাডমিন লগে রেকর্ড করা হবে। শুধুমাত্র প্রয়োজনীয় ক্ষেত্রে ব্যবহার করুন।
        </p>
      </Card>

      {chats && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-semibold text-slate-700 border-b border-slate-200 pb-2">
            মেসেজ হিস্ট্রি (Read-Only)
          </h3>
          
          {chats.length === 0 ? (
            <p className="text-slate-500 text-center py-8">কোনো মেসেজ পাওয়া যায়নি।</p>
          ) : (
            <div className="space-y-3">
              {chats.map((msg) => (
                <Card key={msg.id} className={`p-4 border-l-4 ${msg.type === 'private' ? 'border-l-purple-500' : 'border-l-blue-500'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{msg.senderName}</span>
                      <span className="text-xs text-slate-500 ml-2">({msg.senderId})</span>
                    </div>
                    <span className="text-xs text-slate-400">{msg.timestamp}</span>
                  </div>
                  
                  {msg.type === 'group' && (
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-[10px]">
                        Group: {msg.groupName}
                      </Badge>
                    </div>
                  )}
                  
                  <p className="text-slate-700 text-sm bg-slate-50 p-2 rounded border border-slate-100">
                    {msg.content}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
