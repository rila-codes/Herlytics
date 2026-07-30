import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, CloudRain, Snowflake, Heart, ShieldCheck, Award, Info, RefreshCw, Layers } from 'lucide-react';
import { type BloomState, GARDEN_STAGES } from '../services/BloomPointsManager';
import { getStreakInfo } from '../utils/streakManager';

interface BloomGardenProps {
  bloomState: BloomState;
  onThemeChange: (theme: 'Spring' | 'Summer' | 'Monsoon' | 'Winter') => void;
}

const THEME_STYLES = {
  Spring: {
    bg: 'from-pink-100 via-rose-50 to-purple-100 border-pink-200',
    accent: 'text-pink-600',
    flowerIcon: '🌸',
    title: 'Spring Cherry Blossoms'
  },
  Summer: {
    bg: 'from-amber-100 via-yellow-50 to-orange-100 border-amber-200',
    accent: 'text-amber-600',
    flowerIcon: '🌻',
    title: 'Summer Sunflower Haven'
  },
  Monsoon: {
    bg: 'from-teal-100 via-cyan-50 to-emerald-100 border-teal-200',
    accent: 'text-teal-600',
    flowerIcon: '🪷',
    title: 'Monsoon Lotus Pond'
  },
  Winter: {
    bg: 'from-sky-100 via-indigo-50 to-blue-100 border-sky-200',
    accent: 'text-sky-600',
    flowerIcon: '❄️',
    title: 'Winter Snow Garden'
  }
};

const BloomGarden: React.FC<BloomGardenProps> = ({ bloomState, onThemeChange }) => {
  const currentTheme = THEME_STYLES[bloomState.activeSeasonalTheme || 'Spring'];
  const [streakInfo, setStreakInfo] = useState(() => getStreakInfo());

  useEffect(() => {
    const handleUpdate = () => {
      setStreakInfo(getStreakInfo());
    };
    window.addEventListener('herlytics_streak_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('herlytics_streak_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const effectiveDays = Math.max(bloomState.streakDays || 0, streakInfo.currentStreak || 0);

  // Determine garden stage
  const currentStageObj = GARDEN_STAGES.reduce((acc, curr) => {
    if (effectiveDays >= curr.days) return curr;
    return acc;
  }, GARDEN_STAGES[0]);

  return (
    <div className={`rounded-[2.5rem] p-6 md:p-8 bg-gradient-to-br ${currentTheme.bg} border border-white/60 shadow-xl space-y-6 relative overflow-hidden transition-all duration-500`}>
      
      {/* BACKGROUND FLOATING ANIMATED BUTTERFLIES & STARS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <span className="absolute top-4 left-6 text-2xl animate-bounce duration-1000">🦋</span>
        <span className="absolute top-12 right-12 text-3xl animate-pulse">🦋</span>
        <span className="absolute bottom-8 left-1/3 text-2xl animate-bounce delay-300">✨</span>
        <span className="absolute top-1/2 right-1/4 text-2xl animate-pulse delay-500">🌟</span>
      </div>

      {/* HEADER BAR: STAGE & SEASON SELECTOR */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 relative z-10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-pinkdark bg-white/80 px-3 py-1 rounded-full border border-pink-200 shadow-sm">
            {currentStageObj.stage} • {streakInfo.currentStreak} Day Streak
          </span>
          <h3 className="text-xl font-black text-brand-text pt-1 flex items-center gap-2">
            <span>Garden of Progress</span>
            <span className="text-2xl">{currentStageObj.icon}</span>
          </h3>
        </div>

        {/* Seasonal Theme Selector */}
        <div className="flex items-center gap-1.5 bg-white/80 p-1.5 rounded-2xl border border-white shadow-sm self-start sm:self-auto">
          {(['Spring', 'Summer', 'Monsoon', 'Winter'] as const).map((th) => (
            <button
              key={th}
              onClick={() => onThemeChange(th)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all duration-300 ${
                bloomState.activeSeasonalTheme === th
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand'
              }`}
            >
              {th === 'Spring' && '🌸'}
              {th === 'Summer' && '🌻'}
              {th === 'Monsoon' && '🪷'}
              {th === 'Winter' && '❄️'}
              <span className="ml-1 hidden md:inline">{th}</span>
            </button>
          ))}
        </div>
      </div>

      {/* VIRTUAL GARDEN CANVAS VISUALIZER */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white/80 shadow-inner relative space-y-4">
        
        {/* Stage description */}
        <p className="text-xs font-semibold text-brand-text text-center italic">
          "{currentStageObj.desc}"
        </p>

        {/* Garden Plots Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 py-4 text-center">
          {/* Water Flower */}
          <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl space-y-1 transform hover:scale-105 transition-all">
            <span className="text-2xl block">🪷</span>
            <span className="text-[10px] font-black text-blue-800">Water Bed</span>
            <span className="block text-[9px] text-blue-600 font-bold">Bloomed</span>
          </div>

          {/* Sleep Stars */}
          <div className="p-3 bg-purple-50/80 border border-purple-100 rounded-2xl space-y-1 transform hover:scale-105 transition-all">
            <span className="text-2xl block">✨</span>
            <span className="text-[10px] font-black text-purple-800">Night Stars</span>
            <span className="block text-[9px] text-purple-600 font-bold">Glowing</span>
          </div>

          {/* Exercise Trees */}
          <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-2xl space-y-1 transform hover:scale-105 transition-all">
            <span className="text-2xl block">🌳</span>
            <span className="text-[10px] font-black text-emerald-800">Activity Trees</span>
            <span className="block text-[9px] text-emerald-600 font-bold">Growing</span>
          </div>

          {/* Mood Butterflies */}
          <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-2xl space-y-1 transform hover:scale-105 transition-all">
            <span className="text-2xl block">🦋</span>
            <span className="text-[10px] font-black text-amber-800">Butterflies</span>
            <span className="block text-[9px] text-amber-600 font-bold">Active</span>
          </div>

          {/* Meal Fruit Plants */}
          <div className="p-3 bg-rose-50/80 border border-rose-100 rounded-2xl space-y-1 transform hover:scale-105 transition-all">
            <span className="text-2xl block">🍎</span>
            <span className="text-[10px] font-black text-rose-800">Nutri Orchards</span>
            <span className="block text-[9px] text-rose-600 font-bold">Flourishing</span>
          </div>

          {/* Cycle Lotus */}
          <div className="p-3 bg-pink-50/80 border border-pink-100 rounded-2xl space-y-1 transform hover:scale-105 transition-all">
            <span className="text-2xl block">🌺</span>
            <span className="text-[10px] font-black text-pink-800">Hormone Lotus</span>
            <span className="block text-[9px] text-pink-600 font-bold">Protected</span>
          </div>

          {/* AI Knowledge Library Corner */}
          <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-2xl space-y-1 transform hover:scale-105 transition-all col-span-4 sm:col-span-1">
            <span className="text-2xl block">📚</span>
            <span className="text-[10px] font-black text-indigo-800">Sanctuary Library</span>
            <span className="block text-[9px] text-indigo-600 font-bold">Unlocked</span>
          </div>
        </div>

        {/* Bloom Protection Pass Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-3 rounded-2xl border border-brand-light/60 text-xs text-brand-text gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
            <div>
              <span className="font-extrabold text-brand block text-[11px]">Gentle Streak Protection Active</span>
              <span className="text-[10px] text-brand-muted">"Life happens. Your wellness journey continues."</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-full border border-emerald-200">
            1 x Bloom Pass Ready 🌸
          </span>
        </div>

      </div>

      {/* AI CELEBRATION NOTE */}
      <div className="p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white text-xs text-brand-dark space-y-1 relative z-10">
        <div className="flex items-center gap-1.5 font-bold text-brand-pinkdark">
          <Sparkles size={14} />
          <span>Luna AI Celebration Note</span>
        </div>
        <p className="text-[11px] leading-relaxed italic text-brand-muted">
          "🌸 Amazing! You've nurtured your wellness for {bloomState.streakDays} consecutive days. Your healthy habits are becoming a permanent, beautiful part of your lifestyle."
        </p>
      </div>

    </div>
  );
};

export default BloomGarden;
