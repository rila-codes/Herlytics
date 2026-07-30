import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowRight, RotateCcw, Download, Info, CheckCircle, 
  AlertTriangle, AlertOctagon, Heart, ChevronRight, Utensils, 
  Scale, Activity, Flame, ShieldAlert, Sparkles, UserCheck
} from 'lucide-react';

interface AssessmentDetails {
  id: number | string;
  riskPercentage: number;
  confidenceScore: number;
  riskCategory: string;
  explanation: string;
  createdAt: string;
  answers: { key: string; value: string }[];
}

import { getLatestAssessmentData } from '../utils/assessmentState';

const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      if (id === 'demo' || !id) {
        const stored = getLatestAssessmentData();
        if (stored) {
          setAssessment(stored as any);
        } else {
          setError('No assessment results found. Please complete your wellness assessment first.');
        }
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/assessments/${id}`);
        setAssessment(res.data);
      } catch (err: any) {
        if (!err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
          const stored = getLatestAssessmentData();
          if (stored) {
            setAssessment(stored as any);
          } else {
            setError('No assessment results found. Please complete your wellness assessment first.');
          }
        } else {
          setError('Failed to load assessment results. Please make sure the backend is running.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResult();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <span className="text-brand font-semibold text-sm">Analyzing your health profile & generating body status...</span>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-md mx-auto py-10 px-4 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-6 rounded-3xl space-y-4">
          <AlertOctagon className="mx-auto text-red-500" size={48} />
          <h3 className="text-xl font-bold">Error Loading Results</h3>
          <p className="text-sm">{error || 'Result not found'}</p>
          <Link to="/assessment" className="inline-block px-6 py-2.5 bg-brand text-white font-semibold rounded-2xl">
            Retake Assessment
          </Link>
        </div>
      </div>
    );
  }

  const { riskPercentage, confidenceScore, riskCategory, explanation } = assessment;

  // Compute sub-risks & body status dynamically
  const answersMap = new Map(assessment.answers.map((a) => [a.key, a.value]));
  
  const weight = parseFloat(answersMap.get('weight') || '65');
  const height = parseFloat(answersMap.get('height') || '165');
  const bmi = weight / ((height / 100) * (height / 100));
  const roundedBmi = Math.round(bmi * 10) / 10;

  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'text-red-600 bg-red-50 border-red-200';
  }

  // Hormonal Imbalance Score
  let hormonalCount = 0;
  if (answersMap.get('acne') === '1') hormonalCount++;
  if (answersMap.get('hairLoss') === '1') hormonalCount++;
  if (answersMap.get('facialHair') === '1') hormonalCount++;
  if (answersMap.get('heavyBleeding') === '1') hormonalCount++;
  const hormonalImbalanceScore = Math.min(Math.round(((hormonalCount + (riskPercentage > 50 ? 2 : 1)) / 5.0) * 100), 100);

  // Metabolic Risk Score
  let metabolicCount = 0;
  if (bmi >= 25) metabolicCount++;
  if (answersMap.get('weightGain') === '1') metabolicCount++;
  if (answersMap.get('insulinResistance') === '1') metabolicCount++;
  if (answersMap.get('sugarConsumption') === '2') metabolicCount++;
  const metabolicRiskScore = Math.min(Math.round(((metabolicCount + (riskPercentage > 50 ? 2 : 1)) / 5.0) * 100), 100);

  // Circular Gauge Math
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskPercentage / 100) * circumference;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4 space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark">Automated Analysis</span>
          <h2 className="text-xl font-extrabold text-brand-text">Assessment & Body Status</h2>
        </div>
        <button onClick={handlePrint} className="p-2.5 rounded-xl bg-white border border-brand-light text-brand-muted hover:text-brand transition-all duration-300 shadow-sm" title="Print Report">
          <Download size={18} />
        </button>
      </div>

      {/* Circular Risk Score Gauge Card */}
      <div className="glass rounded-[2.5rem] border border-white/50 shadow-card p-6 md:p-8 text-center relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-brand-pink/20 rounded-full blur-2xl pointer-events-none" />

        <p className="text-xs font-semibold text-brand-muted">Based on your clinical parameters, your risk status is:</p>
        
        {/* Risk Level Badge */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {riskCategory === 'High' || riskCategory === 'High Risk' ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-extrabold">
              <AlertOctagon size={14} />
              High PCOS Risk
            </span>
          ) : riskCategory === 'Moderate' || riskCategory === 'Moderate Risk' ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold">
              <AlertTriangle size={14} />
              Moderate PCOS Risk
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
              <CheckCircle size={14} />
              Low PCOS Risk
            </span>
          )}
        </div>

        {/* SVG Circular Gauge */}
        <div className="relative flex justify-center items-center mt-6">
          <svg className="w-52 h-52 transform -rotate-90">
            <circle
              cx="104"
              cy="104"
              r={radius}
              className="stroke-brand-light fill-transparent"
              strokeWidth="14"
            />
            <circle
              cx="104"
              cy="104"
              r={radius}
              className={`fill-transparent transition-all duration-1000 ease-out ${
                riskPercentage >= 70
                  ? 'stroke-red-500'
                  : riskPercentage >= 40
                  ? 'stroke-amber-500'
                  : 'stroke-emerald-500'
              }`}
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-extrabold text-brand-text tracking-tight">{riskPercentage}%</span>
            <span className="text-[9px] text-brand-muted font-bold tracking-widest uppercase mt-0.5">Risk Score</span>
          </div>
        </div>

        {/* Explanation Banner */}
        <p className="mt-6 text-xs text-brand-muted leading-relaxed">
          {explanation}
        </p>

        {/* Disclaimer Info */}
        <div className="mt-5 p-3.5 bg-brand/5 border border-brand-light rounded-2xl flex items-start gap-2.5 text-left">
          <Info size={16} className="text-brand shrink-0 mt-0.5" />
          <span className="text-[10px] text-brand-muted leading-relaxed">
            This AI risk model analyzes metabolic & cycle parameters. Consult a physician for official clinical diagnosis.
          </span>
        </div>
      </div>

      {/* AUTOMATED CURRENT BODY STATUS CARD */}
      <div className="glass rounded-[2rem] border border-white/50 shadow-soft p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-brand-text flex items-center gap-1.5">
            <UserCheck size={16} className="text-brand" />
            <span>Current Body Status</span>
          </h4>
          <span className="text-[10px] font-extrabold text-brand bg-brand-pink/20 px-2.5 py-0.5 rounded-full">
            Calculated Live
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* BMI Card */}
          <div className="p-3.5 bg-white/70 rounded-2xl border border-brand-light space-y-1">
            <div className="flex items-center gap-1.5 text-brand-muted font-bold text-[10px]">
              <Scale size={14} className="text-brand-pinkdark" />
              <span>Body Mass Index (BMI)</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-brand-text">{roundedBmi}</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${bmiColor}`}>
                {bmiCategory}
              </span>
            </div>
          </div>

          {/* AI Model Confidence */}
          <div className="p-3.5 bg-white/70 rounded-2xl border border-brand-light space-y-1">
            <div className="flex items-center gap-1.5 text-brand-muted font-bold text-[10px]">
              <Sparkles size={14} className="text-brand" />
              <span>Prediction Confidence</span>
            </div>
            <span className="text-lg font-black text-brand">{confidenceScore}%</span>
            <span className="block text-[9px] text-brand-muted">Based on 25 health vectors</span>
          </div>
        </div>

        {/* Sub-Risk Bar Indicators */}
        <div className="space-y-3 pt-2">
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-brand-text/80">Hormonal Imbalance Risk</span>
              <span className="text-brand-pinkdark font-extrabold">{hormonalImbalanceScore}%</span>
            </div>
            <div className="w-full bg-brand-light h-2 rounded-full overflow-hidden">
              <div className="bg-brand-pinkdark h-full rounded-full transition-all duration-500" style={{ width: `${hormonalImbalanceScore}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-brand-text/80">Metabolic & Insulin Resistance Risk</span>
              <span className="text-amber-600 font-extrabold">{metabolicRiskScore}%</span>
            </div>
            <div className="w-full bg-brand-light h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${metabolicRiskScore}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* DIRECT DIET PLANNER CTA BANNER */}
      <div className="bg-gradient-to-br from-brand to-brand-dark text-white rounded-[2rem] p-6 shadow-card space-y-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold">
            <Sparkles size={12} className="text-brand-pink" />
            <span>Automated Next Step</span>
          </div>
          <h3 className="font-extrabold text-lg leading-tight">Your 7-Day PCOS Diet Plan is Ready 🥗</h3>
          <p className="text-xs text-white/85 leading-relaxed">
            Based on your body status ({riskPercentage}% risk score, {bmiCategory}), we generated a customized 7-day food chart, recipes, and restaurant ordering options!
          </p>
        </div>

        <button
          onClick={() => navigate('/diet-plan')}
          className="w-full py-3.5 bg-white text-brand hover:bg-brand-pastel rounded-2xl font-extrabold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2"
        >
          <Utensils size={16} />
          <span>Open My Personalized Diet Planner</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <Link
          to="/insights"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-brand-light hover:bg-brand-pastel/30 rounded-2xl font-bold text-sm text-brand transition-all duration-300 shadow-sm"
        >
          <span>View Detailed Insights & Analytics</span>
          <ChevronRight size={16} />
        </Link>

        <Link
          to="/assessment"
          className="w-full flex items-center justify-center gap-2 py-3 bg-transparent rounded-2xl font-semibold text-xs text-brand-muted hover:text-brand transition-all duration-300"
        >
          <RotateCcw size={14} />
          <span>Retake Assessment</span>
        </Link>
      </div>

    </div>
  );
};

export default Result;
