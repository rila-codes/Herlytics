import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sparkles, Droplets, Moon, Footprints, Heart, Smile, Scale, 
  ChevronRight, ArrowRight, Award, Trophy, Bookmark, HelpCircle, Check, ArrowUpRight 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';

const weeklyData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 78 },
  { day: 'Wed', score: 72 },
  { day: 'Thu', score: 80 },
  { day: 'Fri', score: 75 },
  { day: 'Sat', score: 85 },
  { day: 'Sun', score: 82 },
];

const sparklineData = [
  { val: 40 }, { val: 55 }, { val: 48 }, { val: 65 }, 
  { val: 60 }, { val: 75 }, { val: 82 }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.firstName || 'Rila';
  const [waterGlasses, setWaterGlasses] = useState(6);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* 🌸 HERO SECTION */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-pink-100/80 via-purple-50/70 to-pink-50/80 border border-pink-200/60 p-8 md:p-10 shadow-sm overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Welcome Text */}
        <div className="space-y-2 max-w-xl z-10">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Good morning, {displayName}! 👋
          </h1>
          <p className="text-sm font-semibold text-gray-600 leading-relaxed">
            You're taking beautiful steps towards a healthier, more balanced you.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <span className="px-3.5 py-1.5 bg-white/90 text-brand font-black text-xs rounded-full border border-purple-100 shadow-2xs">
              🌸 Follicular Phase • Peak Energy
            </span>
            <span className="text-xs font-bold text-gray-500">
              Day 12 of Cycle
            </span>
          </div>
        </div>

        {/* Right Botanical Artwork Visual */}
        <div className="relative z-10 flex items-center justify-center shrink-0">
          <div className="relative h-44 w-64 md:h-52 md:w-72 bg-gradient-to-tr from-pink-200/50 to-purple-200/40 rounded-3xl p-4 flex items-center justify-center border border-white/60 shadow-inner">
            <div className="text-center space-y-1">
              <span className="text-6xl block transform hover:scale-110 transition-transform">🧘‍♀️</span>
              <div className="flex gap-2 justify-center text-xl animate-bounce">
                <span>🌸</span>
                <span>🦋</span>
                <span>🪷</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-pinkdark block pt-1">
                Mindful Wellness
              </span>
            </div>
          </div>
        </div>

        {/* Background Floating Petals */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 📊 TOP METRIC CARDS GRID (4 COLUMNS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: WELLNESS SCORE */}
        <div className="rounded-[2rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-brand text-white p-6 shadow-xl space-y-3 relative overflow-hidden flex flex-col justify-between group transform hover:-translate-y-1 transition-all duration-300">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-purple-200 flex items-center gap-1.5">
                <Heart size={14} className="fill-purple-300 text-purple-300" />
                <span>Wellness Score</span>
              </span>
              <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                Live
              </span>
            </div>

            <div className="pt-3">
              <div className="text-3xl font-black tracking-tight">
                82 <span className="text-lg font-bold text-purple-200">/ 100</span>
              </div>
              <span className="text-xs font-bold text-emerald-300 block pt-0.5">
                Great job! +5% vs last week
              </span>
            </div>
          </div>

          {/* Sparkline chart SVG */}
          <div className="h-14 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CARD 2: CYCLE DAY */}
        <div className="rounded-[2rem] bg-white border border-gray-100/80 p-6 shadow-xs space-y-3 flex flex-col justify-between group hover:shadow-card transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1.5">
                <span className="text-rose-500">🩸</span>
                <span>Cycle Day</span>
              </span>
              <h3 className="text-2xl font-black text-gray-900 pt-1">Day 12</h3>
              <span className="text-xs font-bold text-rose-600 block">Follicular Phase</span>
            </div>

            {/* Circular SVG Ring */}
            <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-rose-500"
                  strokeDasharray="42, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-black text-rose-600">12d</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-500 font-semibold">
            <span>Next Period in 16 days</span>
            <Link to="/tracker" className="text-brand font-extrabold hover:underline">Details →</Link>
          </div>
        </div>

        {/* CARD 3: TODAY'S FOCUS */}
        <div className="rounded-[2rem] bg-white border border-gray-100/80 p-6 shadow-xs space-y-3 flex flex-col justify-between group hover:shadow-card transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1.5">
              <span className="text-blue-500">🎯</span>
              <span>Today's Focus</span>
            </span>
            <h3 className="text-sm font-black text-gray-900 pt-1 leading-tight">
              Drink 2 more glasses of water
            </h3>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-extrabold">
              <span className="text-blue-600">{waterGlasses} / 8 glasses</span>
              <span className="text-gray-400">75%</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full w-[75%] transition-all duration-500" />
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400">Hydration & Hormones</span>
            <button
              onClick={() => setWaterGlasses((g) => Math.min(8, g + 1))}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-[10px] rounded-xl border border-blue-200 transition-all"
            >
              + Add Glass
            </button>
          </div>
        </div>

        {/* CARD 4: AI TIP FOR YOU */}
        <div className="rounded-[2rem] bg-gradient-to-br from-pink-50/90 via-purple-50/60 to-white border border-purple-100 p-6 shadow-xs space-y-3 flex flex-col justify-between group hover:shadow-card transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-brand flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>AI Tip for You</span>
            </span>
            <p className="text-xs font-semibold text-gray-700 leading-relaxed pt-1">
              "A 15-min walk after meals can help regulate blood sugar and improve mood."
            </p>
          </div>

          <Link
            to="/profile"
            className="w-full py-2.5 bg-white hover:bg-brand hover:text-white border border-purple-200 text-brand font-extrabold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-all duration-300"
          >
            <span>Ask Luna</span>
            <Sparkles size={12} className="text-amber-400" />
          </Link>
        </div>

      </div>

      {/* 💧 YOUR DAILY OVERVIEW GRID (6 METRIC CARDS) */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-gray-900">Your Daily Overview</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Water */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-1 transform hover:scale-102 transition-all">
            <div className="flex justify-between items-center">
              <Droplets size={18} className="text-blue-500" />
              <span className="text-[10px] font-extrabold text-gray-400">Water</span>
            </div>
            <span className="text-base font-black text-gray-900 block pt-1">{waterGlasses} / 8</span>
            <span className="text-[10px] font-bold text-blue-600 block">glasses</span>
          </div>

          {/* Sleep */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-1 transform hover:scale-102 transition-all">
            <div className="flex justify-between items-center">
              <Moon size={18} className="text-purple-500" />
              <span className="text-[10px] font-extrabold text-gray-400">Sleep</span>
            </div>
            <span className="text-base font-black text-gray-900 block pt-1">7 h 12 m</span>
            <span className="text-[10px] font-bold text-purple-600 block">Good quality</span>
          </div>

          {/* Steps */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-1 transform hover:scale-102 transition-all">
            <div className="flex justify-between items-center">
              <Footprints size={18} className="text-emerald-500" />
              <span className="text-[10px] font-extrabold text-gray-400">Steps</span>
            </div>
            <span className="text-base font-black text-gray-900 block pt-1">6,432</span>
            <span className="text-[10px] font-bold text-emerald-600 block">Steps today</span>
          </div>

          {/* Exercise */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-1 transform hover:scale-102 transition-all">
            <div className="flex justify-between items-center">
              <Heart size={18} className="text-rose-500" />
              <span className="text-[10px] font-extrabold text-gray-400">Exercise</span>
            </div>
            <span className="text-base font-black text-gray-900 block pt-1">30</span>
            <span className="text-[10px] font-bold text-rose-600 block">mins active</span>
          </div>

          {/* Mood */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-1 transform hover:scale-102 transition-all">
            <div className="flex justify-between items-center">
              <Smile size={18} className="text-amber-500" />
              <span className="text-[10px] font-extrabold text-gray-400">Mood</span>
            </div>
            <span className="text-base font-black text-gray-900 block pt-1">Happy</span>
            <span className="text-[10px] font-bold text-amber-600 block">Great!</span>
          </div>

          {/* Weight */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-1 transform hover:scale-102 transition-all">
            <div className="flex justify-between items-center">
              <Scale size={18} className="text-indigo-500" />
              <span className="text-[10px] font-extrabold text-gray-400">Weight</span>
            </div>
            <span className="text-base font-black text-gray-900 block pt-1">63.2 kg</span>
            <span className="text-[10px] font-bold text-emerald-600 block">↓ 0.8 kg</span>
          </div>

        </div>
      </div>

      {/* 📈 ANALYTICS & ACHIEVEMENTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* THIS WEEK'S PROGRESS CHART (2 COLUMNS) */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-gray-900">This Week's Progress</h3>
              <p className="text-[11px] text-gray-500">Track your daily wellness score trends</p>
            </div>

            <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold text-gray-700 focus:outline-none">
              <option>Wellness Score</option>
              <option>Water Intake</option>
              <option>Sleep Hours</option>
            </select>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700 }} />
                <YAxis hide domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 800, color: '#111827' }}
                />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#weekGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACHIEVEMENTS (1 COLUMN) */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-gray-900">Achievements</h3>
            <Link to="/profile" className="text-xs font-bold text-brand hover:underline">View all</Link>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-lg shadow-sm">
                💧
              </div>
              <div>
                <span className="font-extrabold text-xs text-gray-900 block">Hydration Hero</span>
                <span className="text-[10px] text-gray-500 font-medium">Met goal for 7 consecutive days</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-lg shadow-sm">
                🧘
              </div>
              <div>
                <span className="font-extrabold text-xs text-gray-900 block">Early Bird</span>
                <span className="text-[10px] text-gray-500 font-medium">Logged morning check-in 5 days</span>
              </div>
            </div>

            <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-pink-500 text-white font-black flex items-center justify-center text-lg shadow-sm">
                ⭐
              </div>
              <div>
                <span className="font-extrabold text-xs text-gray-900 block">Consistency Star</span>
                <span className="text-[10px] text-gray-500 font-medium">14-day Bloom Streak active</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 📚 RECOMMENDED FOR YOU CAROUSEL */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-black text-gray-900">Recommended for You</h2>
          <Link to="/education" className="text-xs font-extrabold text-brand hover:underline flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'PCOS and Nutrition', time: '5 min read', icon: '🥑', tag: 'Nutrition' },
            { title: '10 Foods to Balance Hormones', time: '8 min read', icon: '🥗', tag: 'Diet' },
            { title: 'Yoga for Hormonal Balance', time: '12 min', icon: '🧘‍♀️', tag: 'Fitness' },
            { title: 'Meditation for Stress Relief', time: '7 min', icon: '🧠', tag: 'Mindfulness' },
            { title: 'High Protein Lunch Ideas', time: '10 min', icon: '🍲', tag: 'Recipes' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 shadow-2xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="h-28 rounded-xl bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 flex items-center justify-center text-4xl border border-gray-100 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-brand bg-purple-50 px-2 py-0.5 rounded-full">
                  {item.tag}
                </span>
                <h4 className="font-extrabold text-xs text-gray-900 group-hover:text-brand transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <span className="text-[10px] font-semibold text-gray-400 block pt-1">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
