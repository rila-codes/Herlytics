import React, { useState, useEffect } from 'react';
import { Droplet, Moon, Footprints, X, Sparkles, ChevronRight } from 'lucide-react';
import { getStoredUserContext } from '../services/LunaBrain';

interface Reminder {
  id: string;
  icon: any;
  title: string;
  message: string;
  color: string;
  badge: string;
}

interface SmartRemindersProps {
  onOpenLunaChatWithPrompt?: (prompt: string) => void;
}

const SmartReminders: React.FC<SmartRemindersProps> = ({ onOpenLunaChatWithPrompt }) => {
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    const ctx = getStoredUserContext();
    const remindersList: Reminder[] = [];

    // Water Reminder
    if (ctx.waterGlasses < ctx.waterGoalGlasses) {
      remindersList.push({
        id: 'water',
        icon: Droplet,
        title: 'Hydration Nudge 💧',
        message: `You're ${ctx.waterGoalGlasses - ctx.waterGlasses} glasses away from today's water goal. Keep it up!`,
        color: 'bg-blue-50 border-blue-200 text-blue-900',
        badge: 'Water Goal'
      });
    }

    // Sleep Reminder
    if (ctx.sleepHours < ctx.sleepGoalHours) {
      remindersList.push({
        id: 'sleep',
        icon: Moon,
        title: 'Sleep Routine Tip 😴',
        message: `It looks like you've been sleeping less than your goal (${ctx.sleepHours}h vs ${ctx.sleepGoalHours}h). Want tips for better rest?`,
        color: 'bg-purple-50 border-purple-200 text-purple-900',
        badge: 'Sleep Hygiene'
      });
    }

    // Activity Reminder
    if (ctx.exerciseDays < 3) {
      remindersList.push({
        id: 'walk',
        icon: Footprints,
        title: 'Light Activity Boost 🏃',
        message: 'A short 15-minute walk today will help regulate cortisol and lower blood sugar.',
        color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        badge: 'Cortisol Control'
      });
    }

    if (remindersList.length > 0) {
      // Pick one random reminder to display softly
      const selected = remindersList[Math.floor(Math.random() * remindersList.length)];
      
      const timer = setTimeout(() => {
        setActiveReminder(selected);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!activeReminder) return null;

  const IconComponent = activeReminder.icon;

  return (
    <div className="fixed top-20 right-4 max-w-xs w-full z-40 animate-slide-up">
      <div className={`p-4 rounded-2xl border shadow-card backdrop-blur-md relative space-y-2 ${activeReminder.color}`}>
        
        <button
          onClick={() => setActiveReminder(null)}
          className="absolute top-3 right-3 p-1 rounded-full text-gray-500 hover:text-black transition-colors"
        >
          <X size={14} />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/80 rounded-xl shadow-sm">
            <IconComponent size={16} className="text-brand" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider block opacity-75">{activeReminder.badge}</span>
            <h4 className="font-extrabold text-xs">{activeReminder.title}</h4>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed opacity-90">
          {activeReminder.message}
        </p>

        <div className="pt-1 flex justify-end">
          <button
            onClick={() => {
              const prompt = activeReminder.id === 'sleep' ? 'Help me improve my sleep routine' : activeReminder.id === 'water' ? 'How much water should I drink?' : 'Suggest light exercises';
              setActiveReminder(null);
              if (onOpenLunaChatWithPrompt) {
                onOpenLunaChatWithPrompt(prompt);
              }
            }}
            className="text-[10px] font-extrabold text-brand flex items-center gap-1 hover:underline"
          >
            <span>Ask Luna AI</span>
            <ChevronRight size={12} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default SmartReminders;
