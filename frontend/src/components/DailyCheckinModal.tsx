import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, X, Smile, Meh, Frown, Moon } from 'lucide-react';
import { getStoredUserContext } from '../services/LunaBrain';

interface DailyCheckinModalProps {
  onCheckinComplete: (mood: string) => void;
}

const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({ onCheckinComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastCheckin = localStorage.getItem('demo_last_checkin_date');

    // Show modal if check-in hasn't been done today
    if (lastCheckin !== todayStr) {
      const ctx = getStoredUserContext();
      setUserName(ctx.userName);
      setIsOpen(true);
    }
  }, []);

  const moods = [
    { label: 'Happy', emoji: '😊', icon: Smile, color: 'hover:bg-amber-50 hover:border-amber-300 text-amber-600' },
    { label: 'Okay', emoji: '😐', icon: Meh, color: 'hover:bg-blue-50 hover:border-blue-300 text-blue-600' },
    { label: 'Stressed', emoji: '😞', icon: Frown, color: 'hover:bg-purple-50 hover:border-purple-300 text-purple-600' },
    { label: 'Tired', emoji: '😴', icon: Moon, color: 'hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600' }
  ];

  const handleSelectMood = (moodLabel: string, moodEmoji: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const fullMood = `${moodLabel} ${moodEmoji}`;
    
    localStorage.setItem('demo_last_checkin_date', todayStr);
    localStorage.setItem('demo_today_mood', fullMood);
    
    setIsOpen(false);
    onCheckinComplete(fullMood);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl relative border border-white/60 text-center">
        
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-brand-pastel hover:bg-brand-light text-brand-muted hover:text-brand transition-all duration-300"
        >
          <X size={18} />
        </button>

        {/* Header graphic */}
        <div className="h-16 w-16 bg-brand-pink/30 text-brand-pinkdark rounded-full flex items-center justify-center mx-auto shadow-md">
          <Sparkles size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-brand-pink/20 px-3 py-1 rounded-full">
            Daily Morning Check-in
          </span>
          <h2 className="text-xl font-black text-brand-text">🌸 Good morning, {userName}!</h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            How are you feeling today? Your mood helps Luna personalize your wellness dashboard and food recommendations.
          </p>
        </div>

        {/* Mood Options Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => handleSelectMood(m.label, m.emoji)}
              className={`p-4 bg-brand-pastel/40 border border-brand-light rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 ${m.color} hover:scale-105 shadow-sm`}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="font-extrabold text-xs text-brand-text">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="pt-2 text-[10px] text-brand-muted flex items-center justify-center gap-1">
          <Heart size={10} className="text-brand-pinkdark fill-brand-pinkdark" />
          <span>Luna AI updates your daily recommendations based on your input</span>
        </div>

      </div>
    </div>
  );
};

export default DailyCheckinModal;
