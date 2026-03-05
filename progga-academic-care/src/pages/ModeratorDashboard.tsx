import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Shield, 
  UserX,
  UserCheck
} from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { 
  getPendingUsers, 
  approveUser, 
  rejectUser, 
  getModerators, 
  updateModeratorStatus,
  PendingUser,
  Moderator
} from '../services/adminService';
import ModeratorSpy from './ModeratorSpy';

interface ModeratorDashboardProps {
  currentUserRole: string;
}

export default function ModeratorDashboard({ currentUserRole }: ModeratorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'requests' | 'moderators' | 'spy'>('requests');
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Selected User for Detail View
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [coachingRollInput, setCoachingRollInput] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    if (activeTab === 'requests') {
      const users = await getPendingUsers();
      setPendingUsers(users);
    } else if (activeTab === 'moderators') {
      const mods = await getModerators();
      setModerators(mods);
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedUser) return;

    if (selectedUser.role === 'student' && !coachingRollInput.trim()) {
      alert('অনুগ্রহ করে শিক্ষার্থীর জন্য একটি কোচিং রোল প্রদান করুন।');
      return;
    }

    setLoading(true);
    await approveUser(selectedUser.uid, coachingRollInput);
    setLoading(false);
    setSelectedUser(null);
    setCoachingRollInput('');
    loadData(); // Refresh list
    alert('ব্যবহারকারী সফলভাবে অনুমোদিত হয়েছে!');
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই আবেদনটি বাতিল করতে চান?')) return;

    setLoading(true);
    await rejectUser(selectedUser.uid);
    setLoading(false);
    setSelectedUser(null);
    loadData();
  };

  const toggleModeratorStatus = async (uid: string, currentStatus: string) => {
    // Map 'approved' <-> 'rejected' (Active <-> Inactive)
    const newStatus = currentStatus === 'approved' ? 'rejected' : 'approved';
    await updateModeratorStatus(uid, newStatus as any);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Shield className="text-blue-600" />
          অ্যাডমিন ড্যাশবোর্ড
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'requests' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            পেন্ডিং রিকোয়েস্ট
            {pendingUsers.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {pendingUsers.length}
              </span>
            )}
          </button>
          
          {currentUserRole === 'admin' && (
            <button 
              onClick={() => setActiveTab('moderators')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'moderators' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              মডারেটর লিস্ট
            </button>
          )}

          <button 
            onClick={() => setActiveTab('spy')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'spy' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
            }`}
          >
            Spy Mode
          </button>
        </div>
      </div>

      {/* --- Tab: Pending Requests --- */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List View */}
          <div className="lg:col-span-1 space-y-3">
            {loading ? (
              <p className="text-slate-500 text-center py-4">লোড হচ্ছে...</p>
            ) : pendingUsers.length === 0 ? (
              <Card className="p-8 text-center text-slate-500">
                <CheckCircle className="mx-auto mb-2 text-emerald-500" size={32} />
                <p>কোনো পেন্ডিং রিকোয়েস্ট নেই</p>
              </Card>
            ) : (
              pendingUsers.map((user) => (
                <div 
                  key={user.uid}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedUser?.uid === user.uid 
                      ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900">{user.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{user.phone}</p>
                    </div>
                    <Badge variant={user.role === 'student' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-3">
                    <Clock size={10} />
                    <span>{user.submissionDate || 'N/A'}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <Card className="p-6 sticky top-6">
                <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedUser.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">আবেদনকারীর বিস্তারিত তথ্য</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">
                    Status: Pending
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">মোবাইল নম্বর</p>
                    <p className="font-medium text-slate-800">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">আবেদনের তারিখ</p>
                    <p className="font-medium text-slate-800">{selectedUser.submissionDate || 'N/A'}</p>
                  </div>
                  
                  {/* Role Specific Details */}
                  {selectedUser.role === 'student' && (
                    <>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold mb-1">স্কুলের নাম</p>
                        <p className="font-medium text-slate-800">{selectedUser.schoolName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold mb-1">ক্লাস ও রোল</p>
                        <p className="font-medium text-slate-800">{selectedUser.classGrade} (রোল: {selectedUser.schoolRoll})</p>
                      </div>
                    </>
                  )}

                  {selectedUser.role === 'guardian' && (
                    <div className="col-span-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-500 uppercase font-semibold mb-1">লিঙ্ক করা শিক্ষার্থীর কোচিং রোল</p>
                      <p className="font-mono font-bold text-blue-900 text-lg">{selectedUser.linkedCoachingRoll}</p>
                    </div>
                  )}

                  {selectedUser.role === 'management' && (
                    <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-600">ম্যানেজমেন্ট রোলের জন্য আবেদন করেছেন।</p>
                    </div>
                  )}
                </div>

                {/* Action Area */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">অ্যাকশন নিন</h4>
                  
                  {selectedUser.role === 'student' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        নতুন কোচিং রোল অ্যাসাইন করুন <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="উদাহরণ: PAC-2024-1050"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                        value={coachingRollInput}
                        onChange={(e) => setCoachingRollInput(e.target.value)}
                      />
                      <p className="text-xs text-slate-500 mt-1">এই রোল নম্বরটি অভিভাবক লিঙ্ক করার জন্য ব্যবহার করবেন।</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      onClick={handleApprove}
                      disabled={loading}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={18} />
                      অ্যাপ্রুভ করুন
                    </button>
                    <button 
                      onClick={handleReject}
                      disabled={loading}
                      className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      বাতিল করুন
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-12">
                <Search size={48} className="mb-4 opacity-20" />
                <p>তালিকা থেকে একটি রিকোয়েস্ট সিলেক্ট করুন</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Tab: Moderators List (Super Admin Only) --- */}
      {activeTab === 'moderators' && (
        <div className="space-y-4">
          {moderators.map((mod) => (
            <Card key={mod.uid} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${mod.status === 'approved' ? 'bg-blue-600' : 'bg-slate-400'}`}>
                  {mod.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{mod.name}</h3>
                  <p className="text-xs text-slate-500">{mod.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant={mod.status === 'approved' ? 'default' : 'secondary'}>
                  {mod.status === 'approved' ? 'Active' : 'Inactive'}
                </Badge>
                
                <button 
                  onClick={() => toggleModeratorStatus(mod.uid, mod.status)}
                  className={`p-2 rounded-lg transition-colors ${
                    mod.status === 'approved' 
                      ? 'text-red-500 hover:bg-red-50' 
                      : 'text-emerald-500 hover:bg-emerald-50'
                  }`}
                  title={mod.status === 'approved' ? 'Deactivate' : 'Activate'}
                >
                  {mod.status === 'approved' ? <UserX size={20} /> : <UserCheck size={20} />}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* --- Tab: Spy Mode --- */}
      {activeTab === 'spy' && (
        <ModeratorSpy />
      )}
    </div>
  );
}
