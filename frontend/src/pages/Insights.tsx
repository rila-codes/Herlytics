import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ShieldAlert, Heart, Calendar, Dumbbell, Sparkles, AlertOctagon, HelpCircle, Check, BookOpen, ExternalLink } from 'lucide-react';
import MonthlyReportCard from '../components/MonthlyReportCard';
import MonthlyAssessmentModal, { type MonthlyAssessmentResult } from '../components/MonthlyAssessmentModal';

import { getLatestAssessmentData } from '../utils/assessmentState';

interface Factor {
  factor: string;
  severity: string;
  impact: string;
}

interface Recommendation {
  category: string;
  title: string;
  description: string;
  icon: string;
}

interface AssessmentDetails {
  id: number;
  riskPercentage: number;
  confidenceScore: number;
  riskCategory: string;
  explanation: string;
  createdAt: string;
  answers?: { key: string; value: string }[];
  answersMap?: Record<string, any>;
}

const Insights: React.FC = () => {
  const [assessment, setAssessment] = useState<AssessmentDetails | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'actions'>('overview');

  // Monthly Re-assessment Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestReassessment, setLatestReassessment] = useState<MonthlyAssessmentResult | null>(null);

  useEffect(() => {
    const fetchLatestAssessment = async () => {
      try {
        const res = await api.get('/api/assessments');
        if (res.data && res.data.length > 0) {
          const latestId = res.data[0].id;
          const detailsRes = await api.get(`/api/assessments/${latestId}`);
          setAssessment(detailsRes.data);
          generateClientInsights(detailsRes.data);
        } else {
          checkStoredFallback();
        }
      } catch (err) {
        checkStoredFallback();
      } finally {
        setLoading(false);
      }
    };

    const checkStoredFallback = () => {
      const data = getLatestAssessmentData();
      if (data) {
        setAssessment(data as any);
        generateClientInsights(data as any);
      } else {
        setAssessment(null);
      }
    };

    fetchLatestAssessment();
  }, []);

  const generateClientInsights = (data: AssessmentDetails) => {
    const answersArray = data.answers || (data.answersMap ? Object.entries(data.answersMap).map(([key, value]) => ({ key, value: String(value) })) : []);
    const answersMap = new Map(answersArray.map((a) => [a.key, String(a.value)]));
    
    // Generate factors
    const tempFactors: Factor[] = [];
    const regularity = answersMap.get('cycle_regularity');
    if (regularity === '2') {
      tempFactors.push({ factor: 'Very irregular menstrual cycle', severity: 'High', impact: 'Positive' });
    } else if (regularity === '1') {
      tempFactors.push({ factor: 'Irregular menstrual cycle', severity: 'Medium', impact: 'Positive' });
    } else {
      tempFactors.push({ factor: 'Regular menstrual cycle', severity: 'Low', impact: 'Negative' });
    }

    const weight = parseFloat(answersMap.get('weight') || '0');
    const height = parseFloat(answersMap.get('height') || '1');
    const bmi = weight / ((height / 100) * (height / 100));
    if (bmi >= 30) {
      tempFactors.push({ factor: 'High BMI (Obese)', severity: 'High', impact: 'Positive' });
    } else if (bmi >= 25) {
      tempFactors.push({ factor: 'Elevated BMI (Overweight)', severity: 'Medium', impact: 'Positive' });
    } else {
      tempFactors.push({ factor: 'Healthy BMI range', severity: 'Low', impact: 'Negative' });
    }

    if (answersMap.get('facial_hair') === '1') {
      tempFactors.push({ factor: 'Excess facial/body hair (Hirsutism)', severity: 'High', impact: 'Positive' });
    }
    if (answersMap.get('acne') === '1') {
      tempFactors.push({ factor: 'Persistent acne or oily skin', severity: 'Medium', impact: 'Positive' });
    }
    if (answersMap.get('hair_loss') === '1') {
      tempFactors.push({ factor: 'Scalp hair thinning / hair fall', severity: 'Medium', impact: 'Positive' });
    }
    if (answersMap.get('weight_gain') === '1') {
      tempFactors.push({ factor: 'Unexplained weight gain', severity: 'High', impact: 'Positive' });
    }
    if (answersMap.get('insulin_resistance') === '1') {
      tempFactors.push({ factor: 'Signs of insulin resistance', severity: 'High', impact: 'Positive' });
    }
    if (answersMap.get('family_history') === '1') {
      tempFactors.push({ factor: 'Family history of PCOS / Diabetes', severity: 'Medium', impact: 'Positive' });
    }

    const exercise = parseInt(answersMap.get('exercise_days') || '0');
    if (exercise < 3) {
      tempFactors.push({ factor: 'Low physical exercise frequency', severity: 'Medium', impact: 'Positive' });
    } else {
      tempFactors.push({ factor: 'Active exercise routine', severity: 'Low', impact: 'Negative' });
    }

    setFactors(tempFactors);

    // Generate recommendations
    const tempRecs: Recommendation[] = [];
    if (data.riskCategory === 'High') {
      tempRecs.push({
        category: 'Medical Consultation',
        title: 'Consult a Gynecologist',
        description: 'Schedule a professional consultation. We recommend discussing hormone panels (free and total testosterone, DHEAS, LH/FSH ratio) and a pelvic ultrasound.',
        icon: 'Doctor'
      });
    } else if (data.riskCategory === 'Moderate') {
      tempRecs.push({
        category: 'Medical Consultation',
        title: 'Schedule a Wellness Check',
        description: 'Consider consulting a healthcare provider or gynecologist to discuss your irregular cycles and hormone wellness.',
        icon: 'Doctor'
      });
    }

    if (answersMap.get('sugar_consumption') === '2' || answersMap.get('insulin_resistance') === '1' || bmi >= 25) {
      tempRecs.push({
        category: 'Nutrition',
        title: 'Adopt a Low-GI Diet',
        description: 'Focus on high-fiber, low-glycemic index foods (whole grains, green vegetables, legumes) and lean protein. This helps manage insulin spikes and supports weight management.',
        icon: 'Nutrition'
      });
    } else {
      tempRecs.push({
        category: 'Nutrition',
        title: 'Balanced Whole Food Diet',
        description: 'Incorporate complex carbohydrates, anti-inflammatory fats (olive oil, avocados, nuts), and a variety of colorful vegetables to maintain hormonal harmony.',
        icon: 'Nutrition'
      });
    }

    if (exercise < 3) {
      tempRecs.push({
        category: 'Lifestyle',
        title: 'Introduce Regular Physical Activity',
        description: 'Aim for at least 150 minutes of moderate exercise per week. Combine strength training (which improves insulin sensitivity) with brisk walking or yoga.',
        icon: 'Lifestyle'
      });
    } else {
      tempRecs.push({
        category: 'Lifestyle',
        title: 'Optimize Exercise Routine',
        description: 'Keep up your physical activity. Ensure a mix of cardiovascular workouts and resistance training, allowing adequate time for rest and recovery.',
        icon: 'Lifestyle'
      });
    }

    const stress = parseInt(answersMap.get('stress_level') || '0');
    if (stress === 2) {
      tempRecs.push({
        category: 'Wellness',
        title: 'Active Stress Management',
        description: 'High stress increases cortisol, which exacerbates PCOS symptoms. Practice mindfulness, deep breathing, or yoga for 15-20 minutes daily.',
        icon: 'Wellness'
      });
    }

    const sleep = parseFloat(answersMap.get('sleep_hours') || '7');
    if (sleep < 7.0) {
      tempRecs.push({
        category: 'Habits',
        title: 'Establish Sleep Hygiene',
        description: 'Prioritize 7-8 hours of quality sleep. Set a consistent sleep schedule and reduce blue light exposure at least 1 hour before bedtime.',
        icon: 'Sleep'
      });
    }

    const water = parseInt(answersMap.get('water_intake') || '8');
    if (water < 8) {
      tempRecs.push({
        category: 'Habits',
        title: 'Increase Daily Hydration',
        description: 'Drink at least 8-10 glasses (2-2.5 liters) of water daily to support metabolic function and cellular detoxification.',
        icon: 'Water'
      });
    }

    setRecommendations(tempRecs);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <span className="text-brand font-semibold text-sm">Loading detailed insights...</span>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center animate-fade-in">
        <div className="glass rounded-[2.5rem] border border-brand-light/80 p-8 shadow-card space-y-5">
          <div className="w-16 h-16 bg-purple-100 text-brand rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
            🔒
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900">Personalized Insights Locked</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-md mx-auto">
              Complete your wellness assessment to unlock personalized PCOS risk evaluation, factor analysis, and tailored health recommendations.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/assessment" className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white font-black text-sm rounded-2xl shadow-md hover:bg-brand-dark transition-all">
              <span>Start Assessment (5–7 mins)</span>
              <Sparkles size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-6 pb-20 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-purple-100/80 px-3 py-1 rounded-full">
            Biomedical Risk Analytics
          </span>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 pt-1">
            Clinical Insights & Recommendations
          </h2>
        </div>
        <Heart className="text-brand-pinkdark fill-brand-pink" size={24} />
      </div>

      {/* Tabs Layout (Matches design mocks) */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-2xs max-w-xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
            activeTab === 'overview' ? 'bg-brand text-white shadow-sm' : 'text-brand-muted hover:text-brand'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('factors')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
            activeTab === 'factors' ? 'bg-brand text-white shadow-sm' : 'text-brand-muted hover:text-brand'
          }`}
        >
          Factors
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
            activeTab === 'actions' ? 'bg-brand text-white shadow-sm' : 'text-brand-muted hover:text-brand'
          }`}
        >
          What You Can Do
        </button>
      </div>

      {/* Monthly Assessment Modal */}
      <MonthlyAssessmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssessmentCompleted={(res) => setLatestReassessment(res)}
      />

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* MONTHLY PERFORMANCE & RE-ASSESSMENT REPORT CARD */}
          <MonthlyReportCard
            onOpenReassessmentModal={() => setIsModalOpen(true)}
            latestReassessment={latestReassessment}
          />

          <div className="glass rounded-3xl border border-white/50 shadow-soft p-6 space-y-4">
            <h3 className="font-extrabold text-brand-text">What does this mean?</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Your responses indicate a <span className="font-bold text-brand">{assessment.riskPercentage}% risk</span> of developing PCOS (PCOD) based on common symptoms and lifestyle factors.
            </p>
          </div>

          <div className="glass rounded-3xl border border-white/50 shadow-soft p-6 space-y-4">
            <h3 className="font-extrabold text-brand-text">Key Factors Contributing</h3>
            <div className="space-y-3">
              {factors.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-brand-light/30 last:border-b-0">
                  <span className="text-xs font-semibold text-brand-text/80">{item.factor}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                      item.severity === 'High'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : item.severity === 'Medium'
                        ? 'bg-orange-50 text-orange-600 border border-orange-100'
                        : 'bg-green-50 text-green-600 border border-green-100'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Congratulations card */}
          <div className="p-5 bg-gradient-to-r from-brand/5 to-brand-pink/5 border border-brand-light rounded-3xl flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-brand-pink/20 flex items-center justify-center text-brand-pinkdark shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-brand-text">Good news!</h4>
              <p className="text-[10px] text-brand-muted mt-0.5">
                You've taken the first step towards better health. Small shifts add up.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Factors Tab */}
      {activeTab === 'factors' && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass rounded-3xl border border-white/50 shadow-soft p-6 space-y-4">
            <h3 className="font-extrabold text-brand-text">Understand PCOS Factors</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              PCOS is characterized by three main pathways: menstrual irregularity, high androgens (male hormones), and insulin resistance.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-brand-pink/20 text-brand-pinkdark flex items-center justify-center shrink-0">
                  <Calendar size={14} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-brand-text">Anovulation (Irregular Periods)</h4>
                  <p className="text-[10px] text-brand-muted mt-1 leading-relaxed">
                    When ovaries do not release eggs regularly, cycles lengthen beyond 35 days, leading to low progesterone levels.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <AlertOctagon size={14} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-brand-text">Hyperandrogenism (Hormone Spikes)</h4>
                  <p className="text-[10px] text-brand-muted mt-1 leading-relaxed">
                    High testosterone levels trigger hair loss (thinning), excess body or facial hair (hirsutism), and persistent acne.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-green-50 text-green-600 border border-green-100 flex items-center justify-center shrink-0">
                  <Dumbbell size={14} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-brand-text">Insulin Resistance</h4>
                  <p className="text-[10px] text-brand-muted mt-1 leading-relaxed">
                    Cells resist insulin, forcing the pancreas to produce more. Excess insulin promotes weight gain around the abdomen and triggers ovaries to release more testosterone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What You Can Do Tab */}
      {activeTab === 'actions' && (
        <div className="space-y-4 animate-fade-in">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="glass rounded-3xl border border-white/50 shadow-soft p-5 flex gap-4 hover:shadow-card transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-brand/5 text-brand flex items-center justify-center shrink-0 mt-0.5">
                <Check size={18} className="text-brand-pinkdark" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-brand uppercase tracking-wider">{rec.category}</span>
                <h4 className="font-extrabold text-sm text-brand-text">{rec.title}</h4>
                <p className="text-xs text-brand-muted leading-relaxed">{rec.description}</p>
              </div>
            </div>
          ))}

          {/* Supportive Footer Banner */}
          <div className="p-6 bg-gradient-to-br from-brand/5 to-brand-pink/5 rounded-3xl border border-brand-light/50 text-center space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 text-brand">
              <BookOpen size={64} />
            </div>
            <h4 className="font-extrabold text-sm text-brand-text">You're not alone.</h4>
            <p className="text-xs text-brand-muted max-w-[280px] mx-auto leading-relaxed">
              We are with you, every step of your wellness journey. Let's build healthy habits.
            </p>
            <Link to="/diet-plan" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline pt-2">
              <span>View Your Diet Plan</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default Insights;
