import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  School, 
  BookOpen, 
  Hash, 
  ArrowRight, 
  ShieldAlert,
  Loader2,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { registerUserSecurely } from '../services/bootstrapService';
import { UserRole } from '../constants';

interface RegistrationProps {
  onRegisterComplete: (userData: any) => void;
  onBackToLogin: () => void;
}

type RegistrationStep = 'basic' | 'role' | 'details' | 'otp' | 'pending' | 'bootstrap_success';

export default function Registration({ onRegisterComplete, onBackToLogin }: RegistrationProps) {
  const [step, setStep] = useState<RegistrationStep>('basic');
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'student' as UserRole,
    schoolName: '',
    classGrade: '',
    schoolRoll: '',
    linkedCoachingRoll: ''
  });

  const [otp, setOtp] = useState('');

  // Phase 1: Basic Info
  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('role');
  };

  // Phase 2: Role Selection
  const handleRoleSelect = (role: UserRole) => {
    setFormData({ ...formData, role });
    if (role === 'management') {
      setStep('otp'); // Management skips details
    } else {
      setStep('details');
    }
  };

  // Phase 3: Details
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  // Phase 4: OTP & Submission
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate OTP Verification
    if (otp !== '1234') {
      setLoading(false);
      alert('ভুল OTP! আবার চেষ্টা করুন। (Demo: 1234)');
      return;
    }

    // Call Secure Registration Logic
    try {
      const response = await registerUserSecurely({
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        schoolName: formData.schoolName,
        classGrade: formData.classGrade,
        schoolRoll: formData.schoolRoll,
        linkedCoachingRoll: formData.linkedCoachingRoll
      });

      setLoading(false);
      setRegisteredUser(response.user);

      if (response.success) {
        if (response.isBootstrap) {
          setStep('bootstrap_success');
        } else {
          setStep('pending');
        }
      } else {
        alert(response.message);
      }
    } catch (error) {
      setLoading(false);
      alert('রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  // Render Step 1: Basic Info (Name, Phone, Password)
  if (step === 'basic') {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white shadow-2xl border-0">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
            <p className="text-slate-500 text-sm mt-1">ধাপ ১: সাধারণ তথ্য</p>
          </div>

          <form onSubmit={handleBasicSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">আপনার নাম (Name)</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">মোবাইল নম্বর (Mobile)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">পাসওয়ার্ড সেট করুন</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="********"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg mt-4 flex items-center justify-center gap-2">
              পরবর্তী ধাপ <ArrowRight size={18} />
            </button>

            <button 
              type="button"
              onClick={onBackToLogin}
              className="w-full text-slate-500 text-sm py-2 hover:text-blue-600"
            >
              ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন
            </button>
          </form>
        </Card>
      </div>
    );
  }

  // Render Step 2: Role Selection
  if (step === 'role') {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white shadow-2xl border-0">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">আপনার পরিচয় নির্বাচন করুন</h1>
            <p className="text-slate-500 text-sm mt-1">ধাপ ২: পদবী (Role)</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'student', label: 'শিক্ষার্থী (Student)', icon: BookOpen },
              { id: 'guardian', label: 'অভিভাবক (Guardian)', icon: User },
              { id: 'management', label: 'ম্যানেজমেন্ট (Management)', icon: ShieldCheck }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id as UserRole)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-600 group-hover:text-blue-600">
                    <role.icon size={20} />
                  </div>
                  <span className="font-medium text-slate-700 group-hover:text-blue-700">{role.label}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600" />
              </button>
            ))}
          </div>

          <button 
            onClick={() => setStep('basic')}
            className="w-full text-slate-500 text-sm py-4 hover:text-slate-700 mt-4"
          >
            পেছনে যান
          </button>
        </Card>
      </div>
    );
  }

  // Render Step 3: Details (Conditional)
  if (step === 'details') {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white shadow-2xl border-0">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">বিস্তারিত তথ্য দিন</h1>
            <p className="text-slate-500 text-sm mt-1">ধাপ ৩: {formData.role === 'student' ? 'শিক্ষার্থীর তথ্য' : 'অভিভাবকের তথ্য'}</p>
          </div>

          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            
            {formData.role === 'student' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">স্কুলের নাম</label>
                  <div className="relative">
                    <School className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="আপনার স্কুলের নাম"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">ক্লাস (Class)</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="১০ম"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                        value={formData.classGrade}
                        onChange={(e) => setFormData({...formData, classGrade: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">স্কুলের রোল</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="১২"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                        value={formData.schoolRoll}
                        onChange={(e) => setFormData({...formData, schoolRoll: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {formData.role === 'guardian' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">শিক্ষার্থীর কোচিং রোল</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="PAC-2024-XXXX"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formData.linkedCoachingRoll}
                    onChange={(e) => setFormData({...formData, linkedCoachingRoll: e.target.value})}
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">
                  * আপনার সন্তানের কোচিং আইডি কার্ডে এই নম্বরটি পাবেন।
                </p>
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg mt-4 flex items-center justify-center gap-2">
              পরবর্তী ধাপ <ArrowRight size={18} />
            </button>
            
            <button 
              type="button"
              onClick={() => setStep('role')}
              className="w-full text-slate-500 text-sm py-2 hover:text-slate-700"
            >
              পেছনে যান
            </button>
          </form>
        </Card>
      </div>
    );
  }

  // Render Step 4: OTP
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white shadow-2xl border-0">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">OTP যাচাইকরণ</h1>
            <p className="text-slate-500 text-sm mt-1">{formData.phone} নম্বরে একটি কোড পাঠানো হয়েছে</p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="XXXX"
              className="w-full text-center text-3xl tracking-[1em] py-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-mono"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg mt-4 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : 'যাচাই করুন ও সাবমিট করুন'}
            </button>
            
            <button 
              type="button"
              onClick={() => setStep('basic')}
              className="w-full text-slate-500 text-sm py-2 hover:text-slate-700"
            >
              নম্বর পরিবর্তন করুন
            </button>
          </form>
        </Card>
      </div>
    );
  }

  // Render Step 5: Pending Approval
  if (step === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white shadow-xl border-0 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-yellow-600 w-10 h-10" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">আবেদন জমা হয়েছে!</h1>
          <Badge variant="secondary" className="mb-4 text-yellow-700 bg-yellow-50 border-yellow-200">
            স্ট্যাটাস: পেন্ডিং (Pending)
          </Badge>
          
          <p className="text-slate-600 mb-6 leading-relaxed">
            আপনার রেজিস্ট্রেশন সফল হয়েছে। একজন মডারেটর আপনার তথ্য যাচাই করে অনুমোদন দিলেই আপনি অ্যাপটি ব্যবহার করতে পারবেন।
          </p>

          <div className="bg-slate-50 p-4 rounded-lg text-left mb-6 border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">আপনার তথ্য:</p>
            <p className="font-medium text-slate-900">{formData.name}</p>
            <p className="text-sm text-slate-600">{formData.phone}</p>
            <p className="text-sm text-slate-600 capitalize">{formData.role}</p>
            {formData.schoolName && <p className="text-sm text-slate-600">{formData.schoolName}</p>}
          </div>

          <button 
            onClick={onBackToLogin}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            লগইন পেজে ফিরে যান
          </button>
        </Card>
      </div>
    );
  }

  // Render Step 6: Bootstrap Success (Admin)
  if (step === 'bootstrap_success') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-slate-800 shadow-xl border-slate-700 text-center text-white">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50">
            <ShieldCheck className="text-emerald-400 w-10 h-10" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">সিস্টেম বুটস্ট্র্যাপ সফল!</h1>
          <Badge variant="default" className="mb-4 bg-emerald-600 hover:bg-emerald-700">
            রোল: সুপার অ্যাডমিন (Super Admin)
          </Badge>
          
          <p className="text-slate-300 mb-6 leading-relaxed">
            স্বাগতম, <strong>{registeredUser?.name}</strong>। আপনি এই সিস্টেমের প্রথম ব্যবহারকারী হিসেবে <strong>সুপার মডারেটর</strong> অ্যাক্সেস পেয়েছেন।
          </p>

          <div className="bg-slate-900/50 p-4 rounded-lg text-left mb-6 border border-slate-700">
            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Security Key</p>
            <p className="font-mono text-emerald-400 break-all">{registeredUser?.securityKey}</p>
            <p className="text-[10px] text-slate-500 mt-2">* এই কি (Key) টি সংরক্ষণ করুন। এটি পরবর্তীতে প্রয়োজন হতে পারে।</p>
          </div>

          <button 
            onClick={onBackToLogin}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            ড্যাশবোর্ডে প্রবেশ করুন
          </button>
        </Card>
      </div>
    );
  }

  return null;
}
