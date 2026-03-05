import React, { useState } from 'react';
import { Phone, ArrowRight, ShieldCheck, UserPlus, Lock, Loader2 } from 'lucide-react';
import { Card } from '../components/ui';
import { loginUser } from '../services/bootstrapService';

interface LoginProps {
  onLogin: (role: string) => void;
  onRegisterClick: () => void;
}

export default function Login({ onLogin, onRegisterClick }: LoginProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(phone, password);
      
      if (response.success && response.user) {
        onLogin(response.user.role);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur shadow-2xl border-0">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">প্রজ্ঞা একাডেমিক কেয়ার</h1>
          <p className="text-slate-500 text-sm mt-1">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">মোবাইল নম্বর</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="tel"
                placeholder="017XXXXXXXX"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="password"
                placeholder="********"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>লগইন করুন <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">অথবা</span>
          </div>
        </div>

        <button 
          onClick={onRegisterClick}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus size={18} />
          নতুন অ্যাকাউন্ট তৈরি করুন
        </button>
      </Card>
    </div>
  );
}
