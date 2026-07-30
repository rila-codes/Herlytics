import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getUserScopedKey } from '../utils/assessmentState';
import { 
  Calendar, Plus, Heart, HeartPulse, Clock, Sparkles, Smile, MessageSquare, 
  AlertCircle, Droplets, Moon, Footprints, Scale, Check, CheckCircle2, Flame, ShieldAlert 
} from 'lucide-react';

interface PeriodLog {
  id: number;
  logDate: string;
  cycleLength: number;
  periodDuration: number;
  mood: string;
  symptoms: string[];
  createdAt: string;
}

interface Prediction {
  hasLogs: boolean;
  lastPeriodStart?: string;
  cycleLength?: number;
  periodDuration?: number;
  predictedNextPeriodStart?: string;
  predictedNextPeriodEnd?: string;
  predictedOvulationDate?: string;
  fertileWindowStart?: string;
  fertileWindowEnd?: string;
  daysUntilNextPeriod?: number;
}

interface SymptomLog {
  id: string;
  date: string;
  symptom: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

const Tracker: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = (searchParams.get('tab') as 'cycle' | 'lifestyle' | 'symptoms' | 'mood') || 'cycle';

  const [activeTab, setActiveTab] = useState<'cycle' | 'lifestyle' | 'symptoms' | 'mood'>(currentTabParam);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as 'cycle' | 'lifestyle' | 'symptoms' | 'mood';
    if (tabParam && ['cycle', 'lifestyle', 'symptoms', 'mood'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'cycle' | 'lifestyle' | 'symptoms' | 'mood') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Cycle State
  const [logs, setLogs] = useState<PeriodLog[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  // Cycle Form State
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [mood, setMood] = useState('Good');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // Lifestyle State
  const [waterGlasses, setWaterGlasses] = useState(6);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [exerciseMins, setExerciseMins] = useState(30);
  const [stepsCount, setStepsCount] = useState(6432);
  const [weightKg, setWeightKg] = useState(63.2);
  const [lifestyleSavedMsg, setLifestyleSavedMsg] = useState('');

  // Mood State
  const [selectedMood, setSelectedMood] = useState('Happy 😊');
  const [moodNote, setMoodNote] = useState('');
  const [moodSavedMsg, setMoodSavedMsg] = useState('');

  // Symptoms State
  const [selectedSymptomItem, setSelectedSymptomItem] = useState('Acne breakouts');
  const [symptomSeverity, setSymptomSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([
    { id: '1', date: 'Jul 25, 2026', symptom: 'Acne breakouts', severity: 'Moderate' },
    { id: '2', date: 'Jul 24, 2026', symptom: 'Mild Cramps', severity: 'Mild' },
    { id: '3', date: 'Jul 22, 2026', symptom: 'Fatigue', severity: 'Severe' }
  ]);
  const [symptomSavedMsg, setSymptomSavedMsg] = useState('');

  useEffect(() => {
    const fetchTrackerData = async () => {
      try {
        const logsRes = await api.get('/api/menstrual/logs');
        setLogs(logsRes.data || []);
      } catch (err) {
        const storedLogs = JSON.parse(localStorage.getItem('demo_menstrual_logs') || '[]');
        setLogs(storedLogs);
      }

      try {
        const predRes = await api.get('/api/menstrual/predict');
        setPrediction(predRes.data);
      } catch (err) {
        const storedLogs = JSON.parse(localStorage.getItem('demo_menstrual_logs') || '[]');
        if (storedLogs.length > 0) {
          setPrediction(calculateDemoPrediction(storedLogs[0]));
        } else {
          setPrediction(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrackerData();
  }, []);

  const calculateDemoPrediction = (latestLog: PeriodLog): Prediction => {
    const start = new Date(latestLog.logDate);
    const cycle = latestLog.cycleLength || 28;
    const duration = latestLog.periodDuration || 5;

    const nextStart = new Date(start);
    nextStart.setDate(start.getDate() + cycle);

    const nextEnd = new Date(nextStart);
    nextEnd.setDate(nextStart.getDate() + duration - 1);

    const ovulation = new Date(nextStart);
    ovulation.setDate(nextStart.getDate() - 14);

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 5);

    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(ovulation.getDate() + 1);

    const diffMs = nextStart.getTime() - new Date().getTime();
    const daysUntil = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return {
      hasLogs: true,
      lastPeriodStart: latestLog.logDate,
      cycleLength: cycle,
      periodDuration: duration,
      predictedNextPeriodStart: nextStart.toISOString().split('T')[0],
      predictedNextPeriodEnd: nextEnd.toISOString().split('T')[0],
      predictedOvulationDate: ovulation.toISOString().split('T')[0],
      fertileWindowStart: fertileStart.toISOString().split('T')[0],
      fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
      daysUntilNextPeriod: daysUntil
    };
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const newLogObj: PeriodLog = {
      id: Date.now(),
      logDate,
      cycleLength,
      periodDuration,
      mood,
      symptoms: selectedSymptoms,
      createdAt: new Date().toISOString()
    };

    const logsKey = getUserScopedKey('menstrual_logs');

    try {
      await api.post('/api/menstrual/logs', {
        logDate,
        cycleLength,
        periodDuration,
        mood,
        symptoms: selectedSymptoms
      });

      const updatedLogs = [newLogObj, ...logs];
      setLogs(updatedLogs);
      setPrediction(calculateDemoPrediction(newLogObj));
      localStorage.setItem(logsKey, JSON.stringify(updatedLogs));
      setShowAddForm(false);
    } catch (err: any) {
      const updatedLogs = [newLogObj, ...logs];
      setLogs(updatedLogs);
      setPrediction(calculateDemoPrediction(newLogObj));
      localStorage.setItem(logsKey, JSON.stringify(updatedLogs));
      setShowAddForm(false);
    }
  };

  const handleSaveLifestyle = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(getUserScopedKey('water_glasses'), waterGlasses.toString());
    localStorage.setItem(getUserScopedKey('sleep_hours'), sleepHours.toString());
    setLifestyleSavedMsg('Lifestyle metrics saved successfully! 💧');
    setTimeout(() => setLifestyleSavedMsg(''), 3000);
  };

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(getUserScopedKey('today_mood'), selectedMood);
    setMoodSavedMsg(`Mood logged as "${selectedMood}"! 😊`);
    setTimeout(() => setMoodSavedMsg(''), 3000);
  };

  const handleAddSymptomLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: SymptomLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      symptom: selectedSymptomItem,
      severity: symptomSeverity
    };

    setSymptomLogs([newLog, ...symptomLogs]);
    setSymptomSavedMsg(`Logged "${selectedSymptomItem}" (${symptomSeverity})! 🩺`);
    setTimeout(() => setSymptomSavedMsg(''), 3000);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 pb-24 animate-fade-in">
      
      {/* HEADER & TABS BAR */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-purple-100/80 px-3 py-1 rounded-full">
            HerLytics Health Tracker
          </span>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 pt-1">
            Personal Health & Symptom Suite
          </h2>
        </div>

        {/* TAB BUTTONS BAR */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-xs self-start sm:self-auto">
          {[
            { id: 'cycle', label: 'Cycle 🩸' },
            { id: 'lifestyle', label: 'Lifestyle 💧' },
            { id: 'mood', label: 'Mood 😊' },
            { id: 'symptoms', label: 'Symptoms 🩺' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-gray-500 hover:text-brand'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🩸 TAB 1: CYCLE TRACKER */}
      {activeTab === 'cycle' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xs">
            <div>
              <h3 className="text-base font-black text-gray-900">Menstrual Cycle Predictions</h3>
              <p className="text-xs text-gray-500">Track cycle phases and fertile window predictions</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-brand-dark"
            >
              <Plus size={14} />
              <span>Log Period Date</span>
            </button>
          </div>

          {/* Add Log Form */}
          {showAddForm && (
            <form onSubmit={handleLogSubmit} className="bg-white rounded-[2rem] border border-purple-100 shadow-xl p-6 space-y-4 animate-fade-in">
              <h4 className="font-extrabold text-sm text-gray-900">Log Period Start & Symptoms</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Period Start Date</label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Cycle Length (days)</label>
                  <input
                    type="number"
                    min="15"
                    max="60"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Period Duration (days)</label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={periodDuration}
                    onChange={(e) => setPeriodDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-brand-dark"
              >
                Save Period Log
              </button>
            </form>
          )}

          {/* Predictions Cards */}
          {prediction ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-[2rem] shadow-md space-y-1">
                <span className="text-[10px] font-black uppercase text-pink-100 block">Next Period Date</span>
                <span className="text-xl font-black block">{prediction.predictedNextPeriodStart ? formatDate(prediction.predictedNextPeriodStart) : 'Not Logged'}</span>
                <span className="text-xs font-bold text-pink-100 block">Expected {prediction.periodDuration || 5} days duration</span>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-[2rem] shadow-md space-y-1">
                <span className="text-[10px] font-black uppercase text-purple-100 block">Predicted Ovulation</span>
                <span className="text-xl font-black block">{prediction.predictedOvulationDate ? formatDate(prediction.predictedOvulationDate) : 'Not Logged'}</span>
                <span className="text-xs font-bold text-purple-100 block">Peak LH Surge window</span>
              </div>

              <div className="p-5 bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-[2rem] shadow-md space-y-1">
                <span className="text-[10px] font-black uppercase text-teal-100 block">Fertile Window</span>
                <span className="text-xl font-black block">6 Days Window</span>
                <span className="text-xs font-bold text-teal-100 block">High fertility chance</span>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-purple-50/60 border border-purple-100 rounded-[2rem] text-center space-y-2">
              <span className="text-2xl block">🩸</span>
              <h4 className="font-black text-sm text-gray-900">No Period Logs Recorded Yet</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Log your last period start date using the button above to calculate cycle predictions and fertile windows.
              </p>
            </div>
          )}

          {/* Period Logs History */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-xs space-y-4">
            <h4 className="font-extrabold text-sm text-gray-900">Period Log History</h4>
            {logs.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No menstrual logs saved yet.</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/60 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-black text-gray-900 block">{formatDate(log.logDate)}</span>
                      <span className="text-[10px] text-gray-500 font-bold">Cycle Length: {log.cycleLength}d • Duration: {log.periodDuration}d</span>
                    </div>
                    <span className="px-2.5 py-1 bg-pink-100 text-pink-700 font-extrabold rounded-full text-[10px]">
                      Recorded ✓
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 💧 TAB 2: LIFESTYLE TRACKER */}
      {activeTab === 'lifestyle' && (
        <form onSubmit={handleSaveLifestyle} className="space-y-6 bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-xs">
          
          {lifestyleSavedMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{lifestyleSavedMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Water Logger */}
            <div className="p-5 bg-blue-50/60 border border-blue-100 rounded-3xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                  <Droplets size={16} className="text-blue-600" />
                  <span>Daily Water Intake</span>
                </span>
                <span className="text-xs font-black text-blue-700">{waterGlasses} / 8 Glasses</span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWaterGlasses((g) => Math.max(0, g - 1))}
                  className="px-4 py-2 bg-white border border-blue-200 text-blue-700 font-black text-sm rounded-xl shadow-xs"
                >
                  - 1 Glass
                </button>
                <span className="text-2xl font-black text-blue-900">{waterGlasses * 250} ml</span>
                <button
                  type="button"
                  onClick={() => setWaterGlasses((g) => Math.min(12, g + 1))}
                  className="px-4 py-2 bg-blue-600 text-white font-black text-sm rounded-xl shadow-xs"
                >
                  + 1 Glass
                </button>
              </div>
            </div>

            {/* Sleep Logger */}
            <div className="p-5 bg-purple-50/60 border border-purple-100 rounded-3xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                  <Moon size={16} className="text-purple-600" />
                  <span>Sleep Duration</span>
                </span>
                <span className="text-xs font-black text-purple-700">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full text-purple-600 accent-purple-600 cursor-pointer pt-3"
              />
            </div>

            {/* Exercise Logger */}
            <div className="p-5 bg-emerald-50/60 border border-emerald-100 rounded-3xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                  <Heart size={16} className="text-emerald-600" />
                  <span>Active Movement (Minutes)</span>
                </span>
                <span className="text-xs font-black text-emerald-700">{exerciseMins} mins</span>
              </div>
              <input
                type="number"
                min="0"
                max="180"
                value={exerciseMins}
                onChange={(e) => setExerciseMins(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-950"
              />
            </div>

            {/* Weight Logger */}
            <div className="p-5 bg-amber-50/60 border border-amber-100 rounded-3xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Scale size={16} className="text-amber-600" />
                  <span>Weight Tracking</span>
                </span>
                <span className="text-xs font-black text-amber-700">{weightKg} kg</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-extrabold text-amber-950"
              />
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-brand-dark"
          >
            Save Lifestyle Metrics
          </button>
        </form>
      )}

      {/* 😊 TAB 3: MOOD TRACKER */}
      {activeTab === 'mood' && (
        <form onSubmit={handleSaveMood} className="space-y-6 bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-xs">
          
          {moodSavedMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{moodSavedMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-gray-900">How are you feeling today?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Happy 😊', desc: 'Energetic & positive' },
                { label: 'Okay 😐', desc: 'Balanced & calm' },
                { label: 'Stressed 😞', desc: 'Overwhelmed or anxious' },
                { label: 'Tired 😴', desc: 'Low energy & sluggish' },
                { label: 'Energetic ⚡', desc: 'High motivation' },
                { label: 'PMS Swings 🌧️', desc: 'Hormonal mood shifts' }
              ].map((m) => (
                <button
                  type="button"
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                    selectedMood === m.label
                      ? 'bg-purple-50 border-brand text-brand shadow-sm ring-2 ring-purple-100 font-extrabold'
                      : 'bg-white border-gray-200 text-gray-800 hover:border-brand/40'
                  }`}
                >
                  <span className="font-black text-sm block">{m.label}</span>
                  <span className="text-[10px] text-gray-400 font-medium block">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-extrabold text-xs text-gray-700 block">Daily Reflection & Notes</label>
            <textarea
              rows={3}
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="Write any thoughts, symptoms, or emotional reflection for today..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-brand-dark"
          >
            Save Mood Log
          </button>
        </form>
      )}

      {/* 🩺 TAB 4: SYMPTOMS TRACKER */}
      {activeTab === 'symptoms' && (
        <form onSubmit={handleAddSymptomLog} className="space-y-6 bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-xs">
          
          {symptomSavedMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{symptomSavedMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-gray-900">Select Symptoms Experienced Today</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                'Acne breakouts', 'Cramps', 'Bloating', 'Fatigue', 
                'Breast tenderness', 'Hair thinning', 'Sugar cravings', 'Backache'
              ].map((sym) => (
                <button
                  type="button"
                  key={sym}
                  onClick={() => setSelectedSymptomItem(sym)}
                  className={`p-3 rounded-2xl border text-center font-extrabold text-xs transition-all ${
                    selectedSymptomItem === sym
                      ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm ring-2 ring-rose-100'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-extrabold text-xs text-gray-700 block">Symptom Severity</label>
            <div className="flex gap-3">
              {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setSymptomSeverity(sev)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                    symptomSeverity === sev
                      ? 'bg-brand text-white border-brand shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-brand-dark"
          >
            Log Symptom
          </button>

          {/* Historical Logs */}
          <div className="pt-4 space-y-3 border-t border-gray-100">
            <h4 className="font-extrabold text-xs text-gray-900">Recent Symptom Logs</h4>
            <div className="space-y-2">
              {symptomLogs.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200/60 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-black text-gray-900 block">{log.symptom}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">{log.date}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${
                    log.severity === 'Severe'
                      ? 'bg-rose-100 text-rose-700'
                      : log.severity === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {log.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </form>
      )}

    </div>
  );
};

export default Tracker;
