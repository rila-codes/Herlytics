import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Bell, Shield, Palette, Globe, HardDrive, Sparkles, Check, 
  Moon, Droplets, Heart, Lock, Key, LogOut, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { getStoredBloomState, saveBloomState } from '../services/BloomPointsManager';

const Settings: React.FC = () => {
  const { user, logout, updateProfileName } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || 'Rila');
  const [lastName, setLastName] = useState(user?.lastName || 'Sharma');
  const [language, setLanguage] = useState('English');
  const [savedMsg, setSavedMsg] = useState('');

  // Notification Toggles
  const [waterReminder, setWaterReminder] = useState(true);
  const [sleepReminder, setSleepReminder] = useState(true);
  const [cycleReminder, setCycleReminder] = useState(true);
  const [lunaCheckin, setLunaCheckin] = useState(true);

  // Bloom State
  const [bloomState, setBloomState] = useState(getStoredBloomState());

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileName(firstName, lastName);
    setSavedMsg('Settings & Profile updated successfully! ✨');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleThemeChange = (theme: 'Spring' | 'Summer' | 'Monsoon' | 'Winter') => {
    const updated = { ...bloomState, activeSeasonalTheme: theme };
    saveBloomState(updated);
    setBloomState(updated);
    setSavedMsg(`Seasonal theme changed to ${theme}! 🌸`);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleClearCache = () => {
    localStorage.removeItem('demo_bloom_state');
    localStorage.removeItem('demo_water_glasses');
    localStorage.removeItem('demo_sleep_hours');
    setSavedMsg('Local cache cleared cleanly! 🧹');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 pb-24 animate-fade-in">
      
      {/* HEADER */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-purple-100/80 px-3 py-1 rounded-full">
          Preferences & Controls
        </span>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 pt-1">
          Account Settings & Privacy
        </h2>
      </div>

      {savedMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold rounded-2xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: NAVIGATION TAB CARDS */}
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-2">
            <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider px-2">Account Overview</h3>
            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand text-white font-black flex items-center justify-center text-sm shadow-sm">
                {firstName.charAt(0)}
              </div>
              <div>
                <span className="font-extrabold text-xs text-gray-900 block">{firstName} {lastName}</span>
                <span className="text-[10px] text-gray-500 font-semibold block">Wellness Free Plan</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-1">
            <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider px-2 pb-1">Quick Links</h3>
            {[
              { id: 'profile-section', title: 'Profile Details', desc: 'Name, email, language' },
              { id: 'notifications-section', title: 'Notifications', desc: 'Reminders & Luna AI toasts' },
              { id: 'garden-section', title: 'Garden Themes', desc: 'Spring, Summer, Monsoon' },
              { id: 'privacy-section', title: 'Privacy & Data', desc: 'Medical security & export' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  const el = document.getElementById(item.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50 hover:text-brand flex items-center justify-between text-xs transition-all group cursor-pointer"
              >
                <div>
                  <span className="font-extrabold text-gray-800 group-hover:text-brand block">{item.title}</span>
                  <span className="text-[10px] text-gray-400 font-medium block">{item.desc}</span>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT MAIN SETTINGS FORM (2 COLUMNS) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* SECTION 1: PERSONAL DETAILS */}
          <form id="profile-section" onSubmit={handleSaveProfile} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs space-y-4 scroll-mt-6">
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <User size={16} className="text-brand" />
              <span>Personal Information</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Email (Account ID)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'ananya.sharma@example.com'}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                  <option>Tamil</option>
                  <option>Telugu</option>
                  <option>Bengali</option>
                  <option>Marathi</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-brand-dark"
            >
              Save Profile Changes
            </button>
          </form>

          {/* SECTION 2: HEALTH NOTIFICATIONS */}
          <div id="notifications-section" className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs space-y-4 scroll-mt-6">
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Bell size={16} className="text-brand-pinkdark" />
              <span>Smart Health Notifications</span>
            </h3>

            <div className="space-y-3">
              {[
                { title: 'Hydration Reminders 💧', desc: 'Gentle hourly toasts to reach 8 water glasses', state: waterReminder, setState: setWaterReminder },
                { title: 'Sleep Hygiene Alerts 😴', desc: 'Bedtime notifications for optimal 7.5h sleep', state: sleepReminder, setState: setSleepReminder },
                { title: 'Cycle Prediction Alerts 🩸', desc: 'Proactive warnings 3 days before expected period', state: cycleReminder, setState: setCycleReminder },
                { title: 'Luna AI Morning Check-in 🤖', desc: 'Morning pop-up checking how you feel today', state: lunaCheckin, setState: setLunaCheckin }
              ].map((n, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-200/60 text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">{n.title}</span>
                    <span className="text-[10px] text-gray-500 font-medium">{n.desc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => n.setState(!n.state)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                      n.state ? 'bg-brand text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {n.state ? 'Enabled ✓' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: GARDEN THEMES */}
          <div id="garden-section" className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs space-y-4 scroll-mt-6">
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Palette size={16} className="text-amber-500" />
              <span>Wellness Garden Seasonal Theme</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Spring', 'Summer', 'Monsoon', 'Winter'] as const).map((th) => (
                <button
                  key={th}
                  onClick={() => handleThemeChange(th)}
                  className={`p-3 rounded-2xl border text-center font-extrabold text-xs transition-all ${
                    bloomState.activeSeasonalTheme === th
                      ? 'bg-purple-50 border-brand text-brand shadow-sm ring-2 ring-purple-100'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {th === 'Spring' && '🌸 Spring'}
                  {th === 'Summer' && '🌻 Summer'}
                  {th === 'Monsoon' && '🪷 Monsoon'}
                  {th === 'Winter' && '❄️ Winter'}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 4: PRIVACY & DATA */}
          <div id="privacy-section" className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs space-y-3 scroll-mt-6">
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Shield size={16} className="text-emerald-600" />
              <span>Medical Privacy & Data Safety</span>
            </h3>

            <p className="text-xs text-gray-500 leading-relaxed">
              HerLytics strictly encrypts all menstrual, symptom, and lifestyle assessment responses. Your health data is never sold to third-party advertisers.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClearCache}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs rounded-xl transition-all"
              >
                Clear Local Offline Cache 🧹
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;
