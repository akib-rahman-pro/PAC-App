/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  LogOut, 
  ShieldCheck,
  Search,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Feed from './pages/Feed';
import SecurePDFViewer from './pages/SecurePDFViewer';
import ModeratorDashboard from './pages/ModeratorDashboard';
import ProgressDashboard from './pages/ProgressDashboard';
import { StudentLayout } from './layouts/StudentLayout';
import { StudentHome } from './pages/student/StudentHome';
import { MyClass } from './pages/student/MyClass';
import { Messages } from './pages/student/Messages';
import { Progress } from './pages/student/Progress';
import { Profile } from './pages/student/Profile';
import { NAV_ITEMS, UserRole } from './constants';
import { cn } from './components/ui';
import { shouldEnableScreenSecurity } from './services/security';

export default function App() {
  // Default to 'student' for demo purposes as requested
  const [userRole, setUserRole] = useState<UserRole | null>('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDrmWarning, setShowDrmWarning] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();

  const notifications = [
    { id: 1, text: "আপনার পোস্টে নতুন লাইক পড়েছে", time: "২ মিনিট আগে", read: false },
    { id: 2, text: "আগামীকাল ক্লাস টেস্ট আছে", time: "১ ঘণ্টা আগে", read: false },
    { id: 3, text: "নতুন লেকচার শিট আপলোড করা হয়েছে", time: "৩ ঘণ্টা আগে", read: true },
  ];

  // DRM Simulation: Detect PrintScreen or Focus loss
  useEffect(() => {
    if (!userRole) return;

    // Check if security should be enabled for this role
    const isSecurityEnabled = shouldEnableScreenSecurity(userRole);

    if (!isSecurityEnabled) return; // Skip if admin/moderator

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        setShowDrmWarning(true);
        navigator.clipboard.writeText(''); // Clear clipboard
        setTimeout(() => setShowDrmWarning(false), 3000);
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [userRole]);

  // Handle Registration Flow
  if (isRegistering) {
    return (
      <Registration 
        onRegisterComplete={() => setIsRegistering(false)} 
        onBackToLogin={() => setIsRegistering(false)} 
      />
    );
  }

  // Handle Login Flow
  if (!userRole) {
    return (
      <Login 
        onLogin={(role) => setUserRole(role as UserRole)} 
        onRegisterClick={() => setIsRegistering(true)}
      />
    );
  }

  // Student Layout
  if (userRole === 'student') {
    return (
      <>
        {/* DRM Warning Overlay */}
        {showDrmWarning && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-xl text-center max-w-sm mx-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-red-600 mb-2">সতর্কীকরণ!</h3>
              <p className="text-slate-600">স্ক্রিনশট নেওয়া বা স্ক্রিন রেকর্ড করা কঠোরভাবে নিষিদ্ধ।</p>
            </div>
          </div>
        )}
        
        <StudentLayout>
          <Routes>
            <Route path="/student/home" element={<StudentHome />} />
            <Route path="/student/class" element={<MyClass />} />
            <Route path="/student/messages" element={<Messages />} />
            <Route path="/student/progress" element={<Progress />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/student/home" replace />} />
          </Routes>
        </StudentLayout>
      </>
    );
  }

  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <div className={cn(
      "min-h-screen bg-slate-50 font-sans text-slate-900",
      shouldEnableScreenSecurity(userRole) ? "drm-protected" : ""
    )}>
      
      {/* DRM Warning Overlay */}
      {showDrmWarning && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-xl text-center max-w-sm mx-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-red-600 mb-2">সতর্কীকরণ!</h3>
            <p className="text-slate-600">স্ক্রিনশট নেওয়া বা স্ক্রিন রেকর্ড করা কঠোরভাবে নিষিদ্ধ।</p>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 lg:hidden">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
          <Menu size={24} />
        </button>
        <span className="font-bold text-lg text-blue-900">প্রজ্ঞা একাডেমিক</span>
        <button className="p-2 -mr-2 text-slate-600 relative">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-blue-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shadow-xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-blue-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-900 font-bold text-xl shadow-lg">
              P
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">প্রজ্ঞা একাডেমিক</h1>
              <p className="text-blue-300 text-xs">কেয়ার অ্যান্ড গাইডেন্স</p>
            </div>
          </div>

          {/* User Profile Summary */}
          <div className="p-4 mx-4 mt-4 bg-blue-800/50 rounded-xl flex items-center gap-3 border border-blue-700/50">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold border-2 border-blue-300">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} alt="User" className="w-full h-full rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">ব্যবহারকারী</p>
              <p className="text-xs text-blue-300 capitalize">{userRole}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-white text-blue-900 font-semibold shadow-md" 
                      : "text-blue-100 hover:bg-blue-800 hover:text-white"
                  )}
                >
                  <Icon size={20} className={cn(isActive ? "text-blue-600" : "text-blue-300 group-hover:text-white")} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-blue-800">
            <button 
              onClick={() => setUserRole(null)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-colors"
            >
              <LogOut size={20} />
              <span>লগ আউট</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Overlay */}
        <div 
          className={cn(
            "fixed inset-0 bg-black/50 -z-10 lg:hidden transition-opacity",
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsSidebarOpen(false)}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto pt-16 lg:pt-0 bg-slate-50">
        <div className="max-w-5xl mx-auto p-4 lg:p-8">
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {NAV_ITEMS.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-slate-500 text-sm mt-1">আজকের আপডেট এবং নোটিফিকেশন</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="অনুসন্ধান করুন..." 
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 relative"
                >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">নোটিফিকেশন</h3>
                        <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={16} />
                        </button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`}>
                            <p className="text-sm text-slate-800 mb-1">{notification.text}</p>
                            <p className="text-xs text-slate-500">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center border-t border-slate-100">
                        <button className="text-sm text-blue-600 font-medium hover:underline">সব দেখুন</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Content Render */}
          {activeTab === 'feed' && <Feed userRole={userRole} />}
          {activeTab === 'class' && <SecurePDFViewer />}
          {activeTab === 'messages' && <Messages />}
          {activeTab === 'progress' && <ProgressDashboard />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'admin' && <ModeratorDashboard currentUserRole={userRole} />}
          
          {/* Fallback for other tabs */}
          {!['feed', 'class', 'messages', 'progress', 'profile', 'admin'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center text-slate-400">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                {React.createElement(NAV_ITEMS.find(i => i.id === activeTab)?.icon || ShieldCheck, { size: 40 })}
              </div>
              <h3 className="text-lg font-medium text-slate-600">এই পাতাটি নির্মীয়মাণ</h3>
              <p>শীঘ্রই আসছে...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

