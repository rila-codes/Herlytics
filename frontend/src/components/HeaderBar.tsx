import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getStreakInfo, type StreakInfo } from '../utils/streakManager';

const HeaderBar: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.firstName || 'Friend';
  const [streak, setStreak] = useState<StreakInfo>(() => getStreakInfo());

  useEffect(() => {
    const handleStreakUpdate = () => {
      setStreak(getStreakInfo());
    };

    window.addEventListener('herlytics_streak_updated', handleStreakUpdate);
    window.addEventListener('storage', handleStreakUpdate);
    return () => {
      window.removeEventListener('herlytics_streak_updated', handleStreakUpdate);
      window.removeEventListener('storage', handleStreakUpdate);
    };
  }, [user]);

  return (
    <header className="h-18 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      
      {/* SEARCH INPUT */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search for recipes, articles, tools..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200/80 rounded-2xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all"
        />
      </div>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-4">
        
        {/* DYNAMIC STREAK PILL */}
        <Link 
          to="/profile"
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-pink-50 hover:bg-pink-100 border border-pink-200/80 rounded-2xl shadow-2xs transition-all cursor-pointer group"
          title={streak.subtitle}
        >
          <span className="text-sm group-hover:scale-110 transition-transform">{streak.badgeIcon}</span>
          <div>
            <span className="font-black text-xs text-pink-700 block leading-tight">{streak.streakTitle}</span>
            <span className="text-[9px] font-bold text-pink-500 block leading-tight truncate max-w-[120px]">{streak.subtitle}</span>
          </div>
        </Link>

        {/* NOTIFICATION BELL */}
        <button className="h-9 w-9 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-brand hover:bg-purple-50 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-pinkdark ring-2 ring-white" />
        </button>

        {/* USER PROFILE MENUS */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-2xl hover:bg-gray-50 transition-all"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand to-brand-pinkdark p-0.5 shadow-sm">
            <div className="h-full w-full rounded-full bg-purple-100 text-brand font-black flex items-center justify-center text-sm">
              {displayName.charAt(0)}
            </div>
          </div>
          <div className="hidden md:block text-left">
            <span className="font-extrabold text-xs text-gray-800 block leading-tight">{displayName}</span>
            <span className="text-[9px] font-extrabold text-gray-500 block leading-tight">Wellness Member</span>
          </div>
          <ChevronDown size={14} className="text-gray-400 hidden md:block" />
        </Link>

      </div>

    </header>
  );
};

export default HeaderBar;
