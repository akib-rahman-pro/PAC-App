import React from 'react';
import { Home, Users, MessageCircle, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../components/ui';

export const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'হোম', path: '/student/home' },
    { icon: Users, label: 'আমার ক্লাস', path: '/student/class' },
    { icon: MessageCircle, label: 'মেসেজ', path: '/student/messages' },
    { icon: BarChart2, label: 'প্রগ্রেস', path: '/student/progress' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-20 select-none" onContextMenu={(e) => e.preventDefault()}>
      {/* Content Area */}
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl overflow-hidden relative">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                  isActive ? "text-emerald-600" : "text-stone-400 hover:text-stone-600"
                )}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 w-12 h-1 bg-emerald-600 rounded-t-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
