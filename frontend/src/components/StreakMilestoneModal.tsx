import React, { useEffect, useState } from 'react';
import { Sparkles, Award, X, Check, Heart, Trophy, Crown } from 'lucide-react';
import { type Milestone } from '../utils/streakManager';

const StreakMilestoneModal: React.FC = () => {
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMilestoneUnlocked = (e: Event) => {
      const customEvent = e as CustomEvent<Milestone>;
      if (customEvent.detail) {
        setMilestone(customEvent.detail);
        setIsOpen(true);
      }
    };

    window.addEventListener('herlytics_milestone_unlocked', handleMilestoneUnlocked);
    return () => {
      window.removeEventListener('herlytics_milestone_unlocked', handleMilestoneUnlocked);
    };
  }, []);

  if (!isOpen || !milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-2xl border border-purple-100 overflow-hidden space-y-6 animate-scale-up">
        
        {/* Decorative background glow circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
        >
          <X size={20} />
        </button>

        {/* Celebration Header Badge */}
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 via-brand to-pink-500 p-1 shadow-lg animate-pulse">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-5xl shadow-inner">
            {milestone.icon}
          </div>
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-600" />
            Milestone Reached!
          </span>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {milestone.title}
          </h2>

          <p className="text-sm text-gray-600 font-medium leading-relaxed px-2">
            {milestone.description}
          </p>
        </div>

        {/* Reward Card Box */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 p-4 rounded-2xl flex items-center justify-between text-left shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white text-purple-600 rounded-xl shadow-xs">
              {milestone.days >= 365 ? <Crown size={24} /> : <Trophy size={24} />}
            </div>
            <div>
              <span className="text-xs font-bold text-purple-900 block">{milestone.badge}</span>
              <span className="text-[11px] text-gray-500 font-medium">Added to your Profile Badges</span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-green-100 text-green-700 font-black text-xs rounded-full flex items-center gap-1">
            <Check size={12} />
            Unlocked
          </span>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-brand to-purple-700 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Awesome! Keep Growing 🌸
          </button>
        </div>

      </div>
    </div>
  );
};

export default StreakMilestoneModal;
