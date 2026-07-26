import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, ClipboardCheck, Activity, Heart, Utensils, BookOpen, 
  Search, Bot, Users, User, Settings, ChevronDown, Sparkles, MessageSquare 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isTrackOpen, setIsTrackOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col justify-between p-5 min-h-screen sticky top-0 h-screen overflow-y-auto shrink-0 shadow-sm z-40">
      
      <div className="space-y-6">
        {/* BRAND LOGO */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-pinkdark to-brand flex items-center justify-center text-white shadow-md">
            <span className="text-xl font-black">🌸</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-brand-dark flex items-center gap-1">
              HerLytics
            </h1>
            <p className="text-[8px] font-extrabold uppercase tracking-widest text-brand-pinkdark">
              Predict. Prevent. Empower.
            </p>
          </div>
        </div>

        {/* NAVIGATION LIST */}
        <nav className="space-y-1 text-xs font-bold text-gray-600">
          
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
              isActive('/dashboard')
                ? 'bg-purple-50 text-brand font-black shadow-sm'
                : 'hover:bg-gray-50 hover:text-brand'
            }`}
          >
            <Home size={18} className={isActive('/dashboard') ? 'text-brand' : 'text-gray-400'} />
            <span>Home</span>
          </Link>

          <Link
            to="/assessment"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
              isActive('/assessment')
                ? 'bg-purple-50 text-brand font-black shadow-sm'
                : 'hover:bg-gray-50 hover:text-brand'
            }`}
          >
            <ClipboardCheck size={18} className={isActive('/assessment') ? 'text-brand' : 'text-gray-400'} />
            <span>Assessment</span>
          </Link>

          {/* COLLAPSIBLE TRACK SUBMENU */}
          <div>
            <button
              onClick={() => setIsTrackOpen(!isTrackOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-brand transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-gray-400" />
                <span>Track</span>
              </div>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isTrackOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTrackOpen && (
              <div className="ml-9 space-y-1 pt-1 border-l-2 border-purple-100 pl-3">
                <Link
                  to="/tracker?tab=cycle"
                  className={`block py-1.5 px-2 text-[11px] font-semibold rounded-xl transition-all ${
                    location.search.includes('tab=cycle') || location.pathname === '/tracker' && !location.search
                      ? 'text-brand font-extrabold bg-purple-50/50'
                      : 'text-gray-500 hover:text-brand'
                  }`}
                >
                  Cycle Tracker
                </Link>
                <Link
                  to="/tracker?tab=lifestyle"
                  className={`block py-1.5 px-2 text-[11px] font-semibold rounded-xl transition-all ${
                    location.search.includes('tab=lifestyle') ? 'text-brand font-extrabold bg-purple-50/50' : 'text-gray-500 hover:text-brand'
                  }`}
                >
                  Lifestyle Tracker
                </Link>
                <Link
                  to="/tracker?tab=symptoms"
                  className={`block py-1.5 px-2 text-[11px] font-semibold rounded-xl transition-all ${
                    location.search.includes('tab=symptoms') ? 'text-brand font-extrabold bg-purple-50/50' : 'text-gray-500 hover:text-brand'
                  }`}
                >
                  Symptoms Tracker
                </Link>
                <Link
                  to="/tracker?tab=mood"
                  className={`block py-1.5 px-2 text-[11px] font-semibold rounded-xl transition-all ${
                    location.search.includes('tab=mood') ? 'text-brand font-extrabold bg-purple-50/50' : 'text-gray-500 hover:text-brand'
                  }`}
                >
                  Mood Tracker
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/insights"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
              isActive('/insights')
                ? 'bg-purple-50 text-brand font-black shadow-sm'
                : 'hover:bg-gray-50 hover:text-brand'
            }`}
          >
            <Heart size={18} className={isActive('/insights') ? 'text-brand' : 'text-gray-400'} />
            <span>Insights</span>
          </Link>

          <Link
            to="/diet-plan"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
              isActive('/diet-plan')
                ? 'bg-purple-50 text-brand font-black shadow-sm'
                : 'hover:bg-gray-50 hover:text-brand'
            }`}
          >
            <Utensils size={18} className={isActive('/diet-plan') ? 'text-brand' : 'text-gray-400'} />
            <span>Diet Planner</span>
          </Link>

          <Link
            to="/recipes"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
              isActive('/recipes')
                ? 'bg-purple-50 text-brand font-black shadow-sm'
                : 'hover:bg-gray-50 hover:text-brand'
            }`}
          >
            <span className="text-base leading-none">🥗</span>
            <span>Recipes</span>
          </Link>

          <Link
            to="/food-finder"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
              isActive('/food-finder')
                ? 'bg-purple-50 text-brand font-black shadow-sm'
                : 'hover:bg-gray-50 hover:text-brand'
            }`}
          >
            <Search size={18} className={isActive('/food-finder') ? 'text-brand' : 'text-gray-400'} />
            <span>Food Finder</span>
          </Link>

          <Link
            to="/education"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
              isActive('/education')
                ? 'bg-purple-50 text-brand font-black shadow-sm'
                : 'hover:bg-gray-50 hover:text-brand'
            }`}
          >
            <BookOpen size={18} className={isActive('/education') ? 'text-brand' : 'text-gray-400'} />
            <span>Education</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl hover:bg-gray-50 text-gray-600 hover:text-brand transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <Bot size={18} className="text-brand" />
              <span>AI Coach</span>
            </div>
            <span className="px-2 py-0.5 bg-brand-pink/30 text-brand-pinkdark text-[9px] font-black rounded-full">
              New
            </span>
          </Link>

          <Link
            to="/profile"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
              isActive('/profile')
                ? 'bg-purple-50 text-brand font-black shadow-sm'
                : 'hover:bg-gray-50 hover:text-brand'
            }`}
          >
            <User size={18} className={isActive('/profile') ? 'text-brand' : 'text-gray-400'} />
            <span>Profile</span>
          </Link>

          <Link
            to="/settings"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
              isActive('/settings')
                ? 'bg-purple-50 text-brand font-black shadow-sm'
                : 'hover:bg-gray-50 hover:text-brand'
            }`}
          >
            <Settings size={18} className={isActive('/settings') ? 'text-brand' : 'text-gray-400'} />
            <span>Settings</span>
          </Link>

        </nav>
      </div>

      {/* BOTTOM PROMO CARDS */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        
        {/* Your Wellness Garden Card */}
        <div className="p-3.5 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 rounded-2xl border border-emerald-200/60 space-y-2 relative overflow-hidden">
          <div className="space-y-0.5">
            <span className="font-extrabold text-xs text-emerald-950 block">Your Wellness Garden</span>
            <p className="text-[10px] text-emerald-700 font-medium leading-tight">
              Keep going! Your garden is blooming beautifully 🌸
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-block px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-xl shadow-sm transition-all"
          >
            View Garden
          </Link>
        </div>

        {/* Talk to Luna AI Card */}
        <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-100/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-brand text-white flex items-center justify-center font-black text-xs">
              🤖
            </div>
            <div>
              <span className="font-bold text-gray-800 text-[11px] block">Need Help?</span>
              <span className="text-[9px] text-brand-muted block">Talk to Luna AI</span>
            </div>
          </div>
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;
