import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sparkles, Droplets, Moon, Footprints, Heart, Smile, Scale, 
  ArrowRight, Lock, ShieldCheck, CheckCircle2, BookOpen, Clock, AlertCircle, FileText, Award, Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { hasCompletedAssessment, getLatestAssessmentData } from '../utils/assessmentState';
import { getStreakInfo, recordDailyActivity, type StreakInfo } from '../utils/streakManager';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.firstName || 'Friend';
  
  const [isAssessed, setIsAssessed] = useState<boolean>(() => hasCompletedAssessment());
  const [assessmentData, setAssessmentData] = useState(() => getLatestAssessmentData());
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [streak, setStreak] = useState<StreakInfo>(() => getStreakInfo());

  // Listen for assessment & streak updates in real-time
  useEffect(() => {
    const handleUpdate = () => {
      setIsAssessed(hasCompletedAssessment());
      setAssessmentData(getLatestAssessmentData());
      setStreak(getStreakInfo());
    };

    window.addEventListener('herlytics_assessment_updated', handleUpdate);
    window.addEventListener('herlytics_streak_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('herlytics_assessment_updated', handleUpdate);
      window.removeEventListener('herlytics_streak_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // --------------------------------------------------------------------------
  // STATE 1: UNASSESSED NEW USER WELCOME DASHBOARD
  // --------------------------------------------------------------------------
  if (!isAssessed) {
    return (
      <div className="space-y-8 pb-16 animate-fade-in">
        
        {/* 🌸 WARM WELCOME BANNER */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-brand text-white p-8 md:p-10 shadow-xl overflow-hidden space-y-6">
          <div className="relative z-10 space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-md">
              <Sparkles size={14} className="text-amber-300" />
              Welcome to HerLytics! 🌸
            </span>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              Hello, {displayName}! We're excited to be part of your wellness journey.
            </h1>

            <p className="text-sm md:text-base text-purple-100 font-medium leading-relaxed">
              Before we can provide personalized insights and recommendations, we'd like to understand you better through a short wellness assessment.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/assessment"
                className="px-8 py-4 bg-white text-purple-900 font-black text-sm rounded-2xl shadow-lg hover:bg-purple-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Start Assessment</span>
                <ArrowRight size={18} />
              </Link>
              
              <div className="flex items-center gap-2 text-xs font-bold text-purple-200 justify-center sm:justify-start">
                <Clock size={16} />
                <span>Takes approximately 5–7 minutes</span>
              </div>
            </div>
          </div>

          {/* Background decorative artwork */}
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2 hidden lg:flex items-center justify-center opacity-90 pointer-events-none">
            <div className="h-56 w-56 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 flex items-center justify-center text-7xl shadow-2xl">
              🧘‍♀️
            </div>
          </div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* ⚡ DYNAMIC WELLNESS STREAK WIDGET */}
        {streak.resetMessage && (
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-purple-200 text-purple-900 px-6 py-4 rounded-3xl flex items-center gap-3 text-sm animate-fade-in shadow-xs">
            <span className="text-2xl shrink-0">🌸</span>
            <div className="space-y-0.5">
              <span className="font-black text-xs uppercase tracking-wider text-purple-700 block">Fresh Start Today</span>
              <p className="font-semibold text-xs text-purple-900 leading-relaxed">{streak.resetMessage}</p>
            </div>
          </div>
        )}

        <div className="glass rounded-[2.5rem] border border-pink-200/80 p-6 md:p-8 shadow-card space-y-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-400 to-purple-600 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl shadow-inner">
                  {streak.badgeIcon}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                  Personalized Wellness Streak
                </span>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 pt-1 flex items-center gap-2">
                  {streak.streakTitle}
                </h3>
                <p className="text-xs text-gray-500 font-semibold">{streak.subtitle}</p>
              </div>
            </div>

            {streak.nextMilestone && (
              <div className="bg-purple-50/80 border border-purple-200 px-4 py-3 rounded-2xl text-left md:text-right">
                <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block">Next Reward Milestone</span>
                <span className="text-xs font-black text-purple-900 block pt-0.5">
                  {streak.nextMilestone.icon} {streak.nextMilestone.badge} ({streak.currentStreak} / {streak.nextMilestone.days} Days)
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Activity Buttons */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <span className="text-xs font-extrabold text-gray-600 block">Complete daily activities to grow your streak:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button 
                onClick={() => { recordDailyActivity('water'); setWaterGlasses(prev => prev + 1); }}
                className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl text-left flex items-center gap-2 transition-all cursor-pointer group"
              >
                <Droplets size={16} className="text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-blue-900 block leading-tight">Log Water</span>
                  <span className="text-[10px] text-blue-600 font-medium">💧 Intake</span>
                </div>
              </button>

              <Link 
                to="/tracker"
                onClick={() => recordDailyActivity('sleep')}
                className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl text-left flex items-center gap-2 transition-all group"
              >
                <Moon size={16} className="text-purple-600 shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-purple-900 block leading-tight">Log Sleep</span>
                  <span className="text-[10px] text-purple-600 font-medium">😴 Hours</span>
                </div>
              </Link>

              <Link 
                to="/tracker"
                onClick={() => recordDailyActivity('mood')}
                className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl text-left flex items-center gap-2 transition-all group"
              >
                <Smile size={16} className="text-amber-600 shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-amber-900 block leading-tight">Log Mood</span>
                  <span className="text-[10px] text-amber-600 font-medium">😊 Feelings</span>
                </div>
              </Link>

              <Link 
                to="/tracker"
                onClick={() => recordDailyActivity('exercise')}
                className="p-3 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-2xl text-left flex items-center gap-2 transition-all group"
              >
                <Footprints size={16} className="text-pink-600 shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-pink-900 block leading-tight">Log Activity</span>
                  <span className="text-[10px] text-pink-600 font-medium">🏃 Movement</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 📋 ASSESSMENT PROGRESS CARD */}
        <div className="glass rounded-[2.5rem] border border-brand-light/60 p-6 shadow-card space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-pinkdark bg-purple-100/80 px-3 py-1 rounded-full">
                Step 1 of 1
              </span>
              <h2 className="text-lg font-black text-gray-900 pt-2">Initial Wellness Assessment</h2>
              <p className="text-xs text-gray-500 font-medium">Complete this required step to activate your health analytics.</p>
            </div>
            
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
              <AlertCircle size={18} className="text-amber-600" />
              <span className="text-xs font-extrabold text-amber-800">Assessment Not Started</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-extrabold text-gray-500">
              <span>Completion Progress</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div className="bg-brand h-full rounded-full w-0 transition-all duration-500" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-bold text-brand">
            <span>🔒 All personalized health cards remain locked until completion</span>
            <Link to="/assessment" className="hover:underline flex items-center gap-1 font-black">
              <span>Begin Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 🔒 LOCKED FEATURE PREVIEW GRID */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-gray-900">Personalized Health Features</h2>
              <p className="text-xs text-gray-500 font-medium">
                Complete your wellness assessment to unlock personalized insights and recommendations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* LOCKED CARD 1: Wellness Score */}
            <div className="relative rounded-[2rem] bg-gray-50 border border-gray-200 p-6 shadow-2xs space-y-4 opacity-90 overflow-hidden group">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1.5">
                  <Heart size={16} className="text-gray-400" />
                  <span>Wellness Score</span>
                </span>
                <span className="px-2.5 py-1 bg-gray-200 text-gray-600 text-[10px] font-black rounded-full flex items-center gap-1">
                  <Lock size={12} /> Locked
                </span>
              </div>

              <div className="py-4 text-center space-y-2">
                <div className="text-4xl text-gray-300 font-black">-- / 100</div>
                <p className="text-xs text-gray-500 font-semibold max-w-xs mx-auto">
                  Complete assessment to calculate your personal score
                </p>
              </div>

              <Link to="/assessment" className="w-full py-2.5 bg-gray-200 hover:bg-brand hover:text-white text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <span>Unlock Score</span>
                <Lock size={12} />
              </Link>
            </div>

            {/* LOCKED CARD 2: AI Insights */}
            <div className="relative rounded-[2rem] bg-gray-50 border border-gray-200 p-6 shadow-2xs space-y-4 opacity-90 overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-gray-400" />
                  <span>AI Risk & Health Insights</span>
                </span>
                <span className="px-2.5 py-1 bg-gray-200 text-gray-600 text-[10px] font-black rounded-full flex items-center gap-1">
                  <Lock size={12} /> Locked
                </span>
              </div>

              <div className="py-4 text-center space-y-2">
                <div className="text-sm font-bold text-gray-400">Risk Profile: Not Evaluated</div>
                <p className="text-xs text-gray-500 font-semibold max-w-xs mx-auto">
                  Complete assessment to generate risk analytics
                </p>
              </div>

              <Link to="/assessment" className="w-full py-2.5 bg-gray-200 hover:bg-brand hover:text-white text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <span>Unlock Insights</span>
                <Lock size={12} />
              </Link>
            </div>

            {/* LOCKED CARD 3: Personalized Diet Plan */}
            <div className="relative rounded-[2rem] bg-gray-50 border border-gray-200 p-6 shadow-2xs space-y-4 opacity-90 overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1.5">
                  <BookOpen size={16} className="text-gray-400" />
                  <span>Personalized Diet Plan</span>
                </span>
                <span className="px-2.5 py-1 bg-gray-200 text-gray-600 text-[10px] font-black rounded-full flex items-center gap-1">
                  <Lock size={12} /> Locked
                </span>
              </div>

              <div className="py-4 text-center space-y-2">
                <div className="text-sm font-bold text-gray-400">Low-GI Anti-Inflammatory Menu</div>
                <p className="text-xs text-gray-500 font-semibold max-w-xs mx-auto">
                  Complete assessment to generate custom meal plans
                </p>
              </div>

              <Link to="/assessment" className="w-full py-2.5 bg-gray-200 hover:bg-brand hover:text-white text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <span>Unlock Diet Chart</span>
                <Lock size={12} />
              </Link>
            </div>

            {/* LOCKED CARD 4: Cycle Analytics */}
            <div className="relative rounded-[2rem] bg-gray-50 border border-gray-200 p-6 shadow-2xs space-y-4 opacity-90 overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1.5">
                  <span>🩸</span>
                  <span>Cycle & Hormonal Analytics</span>
                </span>
                <span className="px-2.5 py-1 bg-gray-200 text-gray-600 text-[10px] font-black rounded-full flex items-center gap-1">
                  <Lock size={12} /> Locked
                </span>
              </div>

              <div className="py-4 text-center space-y-2">
                <div className="text-sm font-bold text-gray-400">Cycle Phase: Pending Data</div>
                <p className="text-xs text-gray-500 font-semibold max-w-xs mx-auto">
                  Complete assessment to track menstrual phases
                </p>
              </div>

              <Link to="/assessment" className="w-full py-2.5 bg-gray-200 hover:bg-brand hover:text-white text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <span>Unlock Analytics</span>
                <Lock size={12} />
              </Link>
            </div>

            {/* LOCKED CARD 5: Health Reports */}
            <div className="relative rounded-[2rem] bg-gray-50 border border-gray-200 p-6 shadow-2xs space-y-4 opacity-90 overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1.5">
                  <FileText size={16} className="text-gray-400" />
                  <span>Health Reports & Trends</span>
                </span>
                <span className="px-2.5 py-1 bg-gray-200 text-gray-600 text-[10px] font-black rounded-full flex items-center gap-1">
                  <Lock size={12} /> Locked
                </span>
              </div>

              <div className="py-4 text-center space-y-2">
                <div className="text-sm font-bold text-gray-400">Monthly Progress Report</div>
                <p className="text-xs text-gray-500 font-semibold max-w-xs mx-auto">
                  Complete assessment to view trend analysis
                </p>
              </div>

              <Link to="/assessment" className="w-full py-2.5 bg-gray-200 hover:bg-brand hover:text-white text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <span>Unlock Reports</span>
                <Lock size={12} />
              </Link>
            </div>

            {/* LOCKED CARD 6: Lifestyle Recommendations */}
            <div className="relative rounded-[2rem] bg-gray-50 border border-gray-200 p-6 shadow-2xs space-y-4 opacity-90 overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1.5">
                  <Smile size={16} className="text-gray-400" />
                  <span>Lifestyle Recommendations</span>
                </span>
                <span className="px-2.5 py-1 bg-gray-200 text-gray-600 text-[10px] font-black rounded-full flex items-center gap-1">
                  <Lock size={12} /> Locked
                </span>
              </div>

              <div className="py-4 text-center space-y-2">
                <div className="text-sm font-bold text-gray-400">Targeted Wellness Goals</div>
                <p className="text-xs text-gray-500 font-semibold max-w-xs mx-auto">
                  Complete assessment for tailored recommendations
                </p>
              </div>

              <Link to="/assessment" className="w-full py-2.5 bg-gray-200 hover:bg-brand hover:text-white text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <span>Unlock Goals</span>
                <Lock size={12} />
              </Link>
            </div>

          </div>
        </div>

        {/* 🔒 PRIVACY, SECURITY & AI COMPANION ASSURANCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="glass rounded-[2rem] border border-white/60 p-6 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-brand font-black text-sm">
              <ShieldCheck size={20} className="text-emerald-600" />
              <span>Your Data Privacy & Security</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              HerLytics strictly protects your personal information. Your responses during the wellness assessment are stored securely and used solely to calculate your individual hormonal risk and nutritional guidance.
            </p>
          </div>

          <div className="glass rounded-[2rem] border border-white/60 p-6 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-brand font-black text-sm">
              <Sparkles size={20} className="text-amber-500" />
              <span>Meet Luna - Your AI Companion</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Luna is ready to answer questions about PCOS, low-GI foods, and menstrual health. Complete your initial assessment so Luna can tailor its answers specifically to your health profile.
            </p>
          </div>

        </div>

        {/* 📚 EDUCATIONAL WOMEN'S HEALTH ARTICLES */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-gray-900">Educational Health Resources</h2>
              <p className="text-xs text-gray-500 font-medium">General evidence-based guidance for women's health</p>
            </div>
            <Link to="/education" className="text-xs font-extrabold text-brand hover:underline flex items-center gap-1">
              <span>View Library</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Understanding PCOS & Hormones', time: '5 min read', icon: '🥑', tag: 'Education' },
              { title: 'Anti-Inflammatory Nutrition Basics', time: '8 min read', icon: '🥗', tag: 'Nutrition' },
              { title: 'Gentle Yoga for Pelvic Health', time: '12 min read', icon: '🧘‍♀️', tag: 'Fitness' },
              { title: 'Stress & Cortisol Control', time: '7 min read', icon: '🧠', tag: 'Mindfulness' }
            ].map((item, idx) => (
              <Link
                key={idx}
                to="/education"
                className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 shadow-2xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 group"
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
              </Link>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 2: ASSESSED USER FULL PERSONALIZED DASHBOARD
  // --------------------------------------------------------------------------
  const riskPercentage = assessmentData?.riskPercentage || 0;
  const riskCategory = assessmentData?.riskCategory || 'Low Risk';
  const wellnessScore = Math.round(100 - riskPercentage * 0.4);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* 🌸 HERO SECTION */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-pink-100/80 via-purple-50/70 to-pink-50/80 border border-pink-200/60 p-8 md:p-10 shadow-sm overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-sm font-semibold text-gray-600 leading-relaxed">
            Your authentic health profile is active. Take a look at your personalized wellness analytics.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <span className="px-3.5 py-1.5 bg-white/90 text-brand font-black text-xs rounded-full border border-purple-100 shadow-2xs">
              Risk Level: {riskCategory} ({riskPercentage}%)
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              ✓ Assessment Completed
            </span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center shrink-0">
          <div className="relative h-44 w-64 md:h-52 md:w-72 bg-gradient-to-tr from-pink-200/50 to-purple-200/40 rounded-3xl p-4 flex items-center justify-center border border-white/60 shadow-inner">
            <div className="text-center space-y-1">
              <span className="text-6xl block transform hover:scale-110 transition-transform">🧘‍♀️</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-pinkdark block pt-1">
                Mindful Balance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 TOP METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: WELLNESS SCORE */}
        <div className="rounded-[2rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-brand text-white p-6 shadow-xl space-y-3 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-purple-200 flex items-center gap-1.5">
                <Heart size={14} className="fill-purple-300 text-purple-300" />
                <span>Wellness Score</span>
              </span>
              <span className="text-[10px] font-black bg-emerald-500/80 px-2.5 py-0.5 rounded-full text-white">
                Authentic
              </span>
            </div>

            <div className="pt-3">
              <div className="text-3xl font-black tracking-tight">
                {wellnessScore} <span className="text-lg font-bold text-purple-200">/ 100</span>
              </div>
              <span className="text-xs font-bold text-emerald-300 block pt-0.5">
                Evaluated from your assessment
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: RISK PROFILE */}
        <div className="rounded-[2rem] bg-white border border-gray-100 p-6 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>AI Risk Category</span>
            </span>
            <h3 className="text-2xl font-black text-gray-900 pt-1">{riskCategory}</h3>
            <span className="text-xs font-bold text-brand block">{riskPercentage}% Risk Score</span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-500">
            <Link to="/insights" className="text-brand font-extrabold hover:underline">View Breakdown →</Link>
          </div>
        </div>

        {/* CARD 3: HYDRATION TRACKER */}
        <div className="rounded-[2rem] bg-white border border-gray-100 p-6 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1.5">
              <Droplets size={14} className="text-blue-500" />
              <span>Hydration Tracker</span>
            </span>
            <h3 className="text-sm font-black text-gray-900 pt-1">
              {waterGlasses} / 8 glasses logged
            </h3>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={() => setWaterGlasses((g) => Math.min(8, g + 1))}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs rounded-xl border border-blue-200 transition-all"
            >
              + Add Glass
            </button>
          </div>
        </div>

        {/* CARD 4: DIET RECOMMENDATION LINK */}
        <div className="rounded-[2rem] bg-gradient-to-br from-pink-50/90 via-purple-50/60 to-white border border-purple-100 p-6 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-brand flex items-center gap-1.5">
              <BookOpen size={14} className="text-brand" />
              <span>Tailored Diet Plan</span>
            </span>
            <p className="text-xs font-semibold text-gray-700 leading-relaxed pt-1">
              Low-GI meals tailored to your assessment profile.
            </p>
          </div>

          <Link
            to="/diet"
            className="w-full py-2.5 bg-brand text-white font-extrabold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 hover:bg-brand-dark transition-all duration-300"
          >
            <span>View Meal Plan</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

      {/* 📚 RECOMMENDED EDUCATIONAL CAROUSEL */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-black text-gray-900">Recommended for You</h2>
          <Link to="/education" className="text-xs font-extrabold text-brand hover:underline flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'PCOS and Anti-Inflammatory Nutrition', time: '5 min read', icon: '🥑', tag: 'Nutrition' },
            { title: '10 Foods to Balance Estrogen & Insulin', time: '8 min read', icon: '🥗', tag: 'Diet' },
            { title: 'Yoga for Hormonal Balance', time: '12 min', icon: '🧘‍♀️', tag: 'Fitness' },
            { title: 'High Protein Low-GI Recipes', time: '10 min', icon: '🍲', tag: 'Recipes' }
          ].map((item, idx) => (
            <Link
              key={idx}
              to="/education"
              className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 shadow-2xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 group"
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
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
