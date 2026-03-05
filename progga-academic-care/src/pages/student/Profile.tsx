import React from 'react';
import { Phone, Mail, Shield, User, Edit, Camera, MapPin, Calendar } from 'lucide-react';
import { Card } from '../../components/ui';

export const Profile = () => {
  // Mock Current User Data
  const user = {
    name: 'আকিব রহমান',
    role: 'student',
    className: '১০ম শ্রেণী - বিজ্ঞান',
    mobile: '017XXXXXXXX',
    email: 'akib@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
    address: 'মিরপুর ১০, ঢাকা',
    dob: '১৫ আগস্ট, ২০০৮',
    guardian: 'রহমান সাহেব',
    guardianMobile: '019XXXXXXXX'
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Header Profile Card */}
      <div className="relative mt-12">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-visible">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-t-2xl relative">
            <button className="absolute bottom-2 right-2 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-sm transition-colors">
              <Camera size={16} />
            </button>
          </div>

          {/* Avatar & Info */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col items-center -mt-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-stone-200 shadow-md overflow-hidden">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full border-2 border-white shadow-sm">
                  <Camera size={14} />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-stone-900 mt-3">{user.name}</h2>
              <p className="text-stone-500 text-sm">{user.className}</p>
              
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                  শিক্ষার্থী
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  রোল: ১২
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-stone-800 text-lg">ব্যক্তিগত তথ্য</h3>
          <button className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline">
            <Edit size={14} />
            এডিট করুন
          </button>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-stone-100">
            <div className="p-4 flex items-center gap-4 hover:bg-stone-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium">মোবাইল নম্বর</p>
                <p className="text-sm text-stone-800 font-medium">{user.mobile}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-4 hover:bg-stone-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium">ইমেইল</p>
                <p className="text-sm text-stone-800 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-4 hover:bg-stone-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium">ঠিকানা</p>
                <p className="text-sm text-stone-800 font-medium">{user.address}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-4 hover:bg-stone-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium">জন্ম তারিখ</p>
                <p className="text-sm text-stone-800 font-medium">{user.dob}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Guardian Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-stone-800 text-lg px-1">অভিভাবকের তথ্য</h3>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
              {user.guardian[0]}
            </div>
            <div>
              <h4 className="font-bold text-stone-900">{user.guardian}</h4>
              <p className="text-sm text-stone-500">{user.guardianMobile}</p>
            </div>
            <button className="ml-auto p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
              <Phone size={18} />
            </button>
          </div>
        </Card>
      </div>

      {/* Account Settings */}
      <div className="space-y-2 pt-2">
        <button className="w-full p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-stone-700 font-medium hover:bg-stone-50 transition-colors">
          <span className="flex items-center gap-3">
            <Shield size={18} className="text-stone-400" />
            পাসওয়ার্ড পরিবর্তন
          </span>
        </button>
        <button className="w-full p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between text-red-600 font-medium hover:bg-red-100 transition-colors">
          <span className="flex items-center gap-3">
            <User size={18} />
            লগ আউট
          </span>
        </button>
      </div>
    </div>
  );
};
