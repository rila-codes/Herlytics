import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  User, LogOut, Check, AlertCircle, History, Award, BookOpen, Heart, 
  Sparkles, ShieldCheck, Calendar as CalendarIcon, Droplets, Moon, 
  Footprints, Smile, Utensils, Activity, Users, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import BloomGarden from '../components/BloomGarden';
import MonthlyReportCard from '../components/MonthlyReportCard';
import MonthlyAssessmentModal, { type MonthlyAssessmentResult } from '../components/MonthlyAssessmentModal';
import { 
  getStoredBloomState, saveBloomState, toggleHabitToday, 
  type BloomState, BLOOM_LEVELS, BADGES 
} from '../services/BloomPointsManager';

interface AssessmentHistoryItem {
  id: number;
  riskPercentage: number;
  confidenceScore: number;
  riskCategory: string;
  explanation: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const { user, logout, updateProfileName } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || 'Ananya');
  const [lastName, setLastName] = useState(user?.lastName || 'Sharma');
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Bloom Garden State
  const [bloomState, setBloomState] = useState<BloomState>(getStoredBloomState());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestReassessment, setLatestReassessment] = useState<MonthlyAssessmentResult | null>(null);

  useEffect(() => {
    // Clear old demo cached state if it contains legacy multi-week numbers
    const storedState = localStorage.getItem('demo_bloom_state');
    if (storedState) {
      const parsed = JSON.parse(storedState);
      if (parsed.streakDays > 7) {
        localStorage.removeItem('demo_bloom_state');
        setBloomState(getStoredBloomState());
      }
    }

    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/assessments');
        if (res.data && res.data.length > 0) {
          setHistory(res.data);
        } else {
          loadStoredHistory();
        }
      } catch (err) {
        loadStoredHistory();
      }
    };

    const loadStoredHistory = () => {
      const storedHistory = JSON.parse(localStorage.getItem('demo_assessment_history') || '[]');
      const storedLatest = localStorage.getItem('demo_latest_assessment');
      if (storedHistory.length > 0) {
        setHistory(storedHistory);
      } else if (storedLatest) {
        setHistory([JSON.parse(storedLatest)]);
      }
    };

    fetchHistory();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      await api.put('/api/profile', { firstName, lastName });
      updateProfileName(firstName, lastName);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        updateProfileName(firstName, lastName);
        setSuccess('Profile updated successfully!');
      } else {
        setError(err.response?.data?.message || 'Failed to update profile name.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = (key: string) => {
    const updated = toggleHabitToday(key);
    setBloomState(updated);
  };

  const handleThemeChange = (theme: 'Spring' | 'Summer' | 'Monsoon' | 'Winter') => {
    const updated = { ...bloomState, activeSeasonalTheme: theme };
    saveBloomState(updated);
    setBloomState(updated);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Calculate current month real metrics
  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long' });
  const currentYear = now.getFullYear();
  const currentDayNum = now.getDate();

  // Calculate real month water days progress (Day 1 baseline = 1 day)
  const waterHabit = bloomState.habits.find(h => h.key === 'water');
  const realWaterDays = waterHabit?.completedToday ? 1 : 0;
  const waterProgressPercent = Math.round((realWaterDays / 20) * 100);

  // Dynamic Real Calendar Generator for Current Month
  const getMonthCalendarDays = () => {
    const totalDays = new Date(currentYear, now.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = (new Date(currentYear, now.getMonth(), 1).getDay() + 6) % 7; // Monday = 0

    const daysArr = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArr.push({ day: 0, flower: '', isBlank: true, isToday: false });
    }

    const completedCount = bloomState.habits.filter(h => h.completedToday).length;

    for (let d = 1; d <= totalDays; d++) {
      const isToday = d === currentDayNum;
      let flower = '🌱';

      if (isToday) {
        if (completedCount >= 5) flower = '🌸';
        else if (completedCount >= 3) flower = '🌿';
        else flower = '🌱';
      } else if (d < currentDayNum) {
        flower = '🌱';
      } else {
        flower = '🌱';
      }

      daysArr.push({ day: d, flower, isBlank: false, isToday });
    }

    return daysArr;
  };

  const dynamicCalendarDays = getMonthCalendarDays();

  return (
    <div className="w-full max-w-full space-y-6 pb-20 animate-fade-in">
      
      {/* TITLE & BLOOM LEVEL BADGE */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-purple-100/80 px-3 py-1 rounded-full">
            Wellness Sanctuary
          </span>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 pt-1">
            {firstName}'s Sanctuary & Bloom Garden
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-brand/10 border border-brand-light text-brand rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-sm">
            <Sparkles size={14} className="text-amber-500" />
            <span>Level: {bloomState.bloomLevel} ({bloomState.totalBloomPoints} pts)</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-xl font-bold text-xs text-red-600 transition-colors shadow-sm"
          >
            <LogOut size={12} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* 🌸 SIGNATURE EXPERINCE: BLOOM GARDEN OF PROGRESS */}
      <BloomGarden bloomState={bloomState} onThemeChange={handleThemeChange} />

      {/* DAILY HABIT STREAKS GRID */}
      <div className="glass rounded-[2.5rem] border border-white/50 shadow-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-sm text-brand-text">Daily Habit Streaks (+1 Bloom Point)</h3>
            <p className="text-[11px] text-brand-muted">Complete daily habits to help your virtual garden bloom!</p>
          </div>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {bloomState.habits.filter(h => h.completedToday).length}/{bloomState.habits.length} Done Today
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {bloomState.habits.map((h) => (
            <div
              key={h.key}
              onClick={() => handleToggleHabit(h.key)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 space-y-1 relative group ${
                h.completedToday
                  ? 'bg-emerald-50/70 border-emerald-200 shadow-sm'
                  : 'bg-white/80 border-brand-light/60 hover:border-brand/40'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xl">{h.icon}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  h.completedToday ? 'bg-emerald-600 text-white' : 'bg-brand-pastel text-brand-muted'
                }`}>
                  {h.streakDays}d Streak
                </span>
              </div>
              <span className="font-extrabold text-xs text-brand-text block">{h.name}</span>
              <span className="text-[9px] text-brand-muted font-bold block">
                {h.completedToday ? '✓ +1 Point Earned' : '+ Tap to Complete'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MONTHLY THEME CHALLENGE */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[2rem] p-6 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-blue-100">
            Monthly Challenge • {currentMonthName} {currentYear}
          </span>
          <span className="text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
            💧 Hydration Month
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-base">Hormonal Hydration & Electrolyte Balance</h3>
          <p className="text-xs text-blue-100 leading-relaxed">
            Drink 8 glasses of water for 20 days this month to clear excess estrogen and earn the exclusive <strong>Hydration Guardian Badge 🪷</strong>.
          </p>
        </div>

        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] font-extrabold text-blue-100">
            <span>Progress: {realWaterDays} / 20 Days Achieved</span>
            <span>{waterProgressPercent}% Complete</span>
          </div>
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, waterProgressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* FLOWER WELLNESS CALENDAR */}
      <div className="glass rounded-[2.5rem] border border-white/50 shadow-soft p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-sm text-brand-text flex items-center gap-1.5">
              <CalendarIcon size={16} className="text-brand" />
              <span>Wellness Flower Calendar ({currentMonthName} {currentYear})</span>
            </h3>
            <p className="text-[11px] text-brand-muted">Each day is represented by a blooming flower</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-brand-muted font-bold">
            <span>🌸 Great</span>
            <span>🌿 Good</span>
            <span>🌱 Tracked</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <span key={i} className="text-[10px] font-black text-brand-muted uppercase pb-1">{day}</span>
          ))}
          {dynamicCalendarDays.map((cd, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-2xl border text-center space-y-0.5 transition-all ${
                cd.isBlank
                  ? 'bg-transparent border-transparent opacity-0 pointer-events-none'
                  : cd.isToday
                  ? 'bg-brand/10 border-brand text-brand font-black shadow-sm ring-2 ring-brand/30'
                  : 'bg-white/80 border-brand-light/60'
              }`}
            >
              {!cd.isBlank && (
                <>
                  <span className="text-lg block leading-none">{cd.flower}</span>
                  <span className={`text-[9px] font-extrabold block ${cd.isToday ? 'text-brand' : 'text-brand-muted'}`}>
                    {cd.isToday ? 'Today' : cd.day}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS SHOWCASE */}
      <div className="glass rounded-[2.5rem] border border-white/50 shadow-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-sm text-brand-text flex items-center gap-1.5">
              <Award size={16} className="text-brand-pinkdark" />
              <span>Achievements & Badges</span>
            </h3>
            <p className="text-[11px] text-brand-muted">Earn collectible badges for healthy consistency</p>
          </div>
          <span className="text-xs font-bold text-brand bg-brand-light px-2.5 py-0.5 rounded-full">
            {bloomState.unlockedBadges.length} / {BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map((b) => {
            const isUnlocked = bloomState.unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-200 shadow-sm'
                    : 'bg-gray-50/50 border-gray-200 opacity-50 grayscale'
                }`}
              >
                <span className="text-3xl block">{b.icon}</span>
                <span className="font-extrabold text-xs text-brand-text block">{b.title}</span>
                <span className="text-[9px] text-brand-muted leading-tight block">{b.desc}</span>
                <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full mt-1 ${
                  isUnlocked ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {isUnlocked ? 'Unlocked 🏆' : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SUPPORTIVE FRIEND CORNER */}
      <div className="glass rounded-[2.5rem] border border-white/50 shadow-soft p-5 space-y-3 bg-brand-pastel/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-brand" />
            <div>
              <h3 className="font-extrabold text-sm text-brand-text">Walk & Bloom Together</h3>
              <p className="text-[10px] text-brand-muted">Supportive, non-competitive friend cheers</p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-brand text-white font-extrabold text-xs rounded-xl shadow-sm">
            + Add Friend
          </button>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-brand-light flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-brand-pink/30 text-brand-pinkdark font-black rounded-full flex items-center justify-center">
              P
            </div>
            <div>
              <span className="font-bold text-brand-text block">Priya S.</span>
              <span className="text-[10px] text-brand-muted">Met water goal today 💧 • 14d Bloom Streak</span>
            </div>
          </div>
          <button className="px-2.5 py-1 bg-pink-50 border border-pink-200 text-pink-700 rounded-xl font-bold text-[10px] hover:bg-pink-100">
            Cheer 🌸
          </button>
        </div>
      </div>

      {/* MONTHLY RE-ASSESSMENT MODAL */}
      <MonthlyAssessmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssessmentCompleted={(res) => setLatestReassessment(res)}
      />

      {/* MONTHLY PERFORMANCE & BODY IMPROVEMENT REPORT CARD */}
      <MonthlyReportCard
        onOpenReassessmentModal={() => setIsModalOpen(true)}
        latestReassessment={latestReassessment}
      />

      {/* PROFILE FORM CARD */}
      <form onSubmit={handleUpdate} className="glass rounded-[2.5rem] border border-white/50 shadow-soft p-6 space-y-4">
        <h3 className="font-extrabold text-sm text-brand-text">Personal Details</h3>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-xs flex gap-1.5 items-center">
            <Check size={14} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex gap-1.5 items-center">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 bg-white/70 border border-brand-light rounded-xl text-xs font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand/20"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 bg-white/70 border border-brand-light rounded-xl text-xs font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand/20"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-muted mb-1">Email (cannot be changed)</label>
          <input
            type="email"
            value={user?.email || 'ananya.sharma@example.com'}
            disabled
            className="w-full px-3 py-2 bg-slate-50 border border-brand-light rounded-xl text-xs font-medium text-brand-muted cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-brand-dark transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </form>

      {/* ASSESSMENT HISTORY LIST */}
      <div className="glass rounded-[2.5rem] border border-white/50 shadow-soft p-6 space-y-4">
        <h3 className="font-extrabold text-sm text-brand-text flex items-center gap-2">
          <History size={16} className="text-brand" />
          <span>Assessment History</span>
        </h3>

        {history.length === 0 ? (
          <p className="text-xs text-brand-muted text-center py-4">No assessments logged yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="p-4 bg-white/80 border border-brand-light/60 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand">
                    Logged: {formatDate(item.createdAt)}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    item.riskCategory?.toLowerCase().includes('high')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : item.riskCategory?.toLowerCase().includes('moderate')
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {item.riskCategory || 'Moderate Risk'} ({item.riskPercentage}%)
                  </span>
                </div>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {item.explanation}
                </p>
                <div className="pt-1 flex justify-end">
                  <Link
                    to={`/result/${item.id}`}
                    className="text-[11px] font-extrabold text-brand hover:underline flex items-center gap-1"
                  >
                    <span>View Result Details</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
