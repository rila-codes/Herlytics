import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingDown, Award, Calendar, Heart, ShieldCheck, CheckCircle2, ChevronRight, RefreshCw, BarChart2 } from 'lucide-react';
import { type MonthlyAssessmentResult } from './MonthlyAssessmentModal';

interface MonthlyReportCardProps {
  onOpenReassessmentModal: () => void;
  latestReassessment?: MonthlyAssessmentResult | null;
}

const MonthlyReportCard: React.FC<MonthlyReportCardProps> = ({ onOpenReassessmentModal, latestReassessment }) => {
  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long' });
  const currentYear = now.getFullYear();

  // Load from localStorage if not passed as prop
  const [reassessment, setReassessment] = useState<MonthlyAssessmentResult | null>(latestReassessment || null);

  useEffect(() => {
    if (!latestReassessment) {
      const stored = localStorage.getItem('demo_monthly_reassessments');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setReassessment(parsed[0]);
        }
      }
    } else {
      setReassessment(latestReassessment);
    }
  }, [latestReassessment]);

  return (
    <div className="glass rounded-[2.5rem] border border-white/50 shadow-card p-6 md:p-8 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/40">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-brand-light/50 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-brand-pink/20 px-3 py-1 rounded-full">
            Month-End Performance Report
          </span>
          <h3 className="text-lg font-black text-brand-text pt-1">
            {currentMonthName} {currentYear} Health Review
          </h3>
        </div>

        <button
          onClick={onOpenReassessmentModal}
          className="px-3.5 py-2 bg-brand text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-brand-dark transition-all duration-300"
        >
          <Sparkles size={14} className="text-amber-200" />
          <span>{reassessment ? 'Retake Re-Assessment' : 'Take Monthly Re-Assessment'}</span>
        </button>
      </div>

      {/* BODY IMPROVEMENT DELTA SCORE BANNER */}
      {reassessment ? (
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-[2rem] shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-emerald-100">
              Verified Body Improvement 🎉
            </span>
            <span className="text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              +{reassessment.improvementDelta}% Health Score Boost
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="bg-white/10 p-3 rounded-2xl border border-white/20 space-y-0.5">
              <span className="text-[10px] text-emerald-100 font-bold block">Month 1 Baseline Risk</span>
              <span className="text-lg font-black text-white">{reassessment.initialRiskPercentage}% Risk</span>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl border border-white/30 space-y-0.5">
              <span className="text-[10px] text-amber-200 font-extrabold block">Current Month Risk</span>
              <span className="text-xl font-black text-amber-300">{reassessment.newRiskPercentage}% Risk</span>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2 text-xs text-emerald-100 font-semibold">
            <CheckCircle2 size={16} className="text-amber-300 shrink-0" />
            <span>Symptoms Status: {reassessment.cycleStatus} cycle, {reassessment.skinStatus.toLowerCase()} skin.</span>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-brand-pastel/60 border border-brand-light rounded-[2rem] space-y-3 text-center">
          <Heart size={28} className="mx-auto text-brand-pinkdark" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-brand-text">Check Your Monthly Body Improvements</h4>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Take the quick 5-question monthly micro-assessment to compare today's symptoms against your baseline and see your risk reduction score!
            </p>
          </div>
          <button
            onClick={onOpenReassessmentModal}
            className="px-5 py-2.5 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md inline-flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-amber-200" />
            <span>Check My Body Improvement Score</span>
          </button>
        </div>
      )}

      {/* MONTH-END HABITS SUMMARY GRID */}
      {reassessment ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1">
            <span className="text-[10px] font-black text-blue-600 uppercase block">Hydration Rate</span>
            <span className="text-base font-black text-blue-900 block">Logged Daily</span>
            <span className="text-[9px] text-blue-700 font-bold block">Water Target Active</span>
          </div>

          <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-1">
            <span className="text-[10px] font-black text-purple-600 uppercase block">Re-Assessment</span>
            <span className="text-base font-black text-purple-900 block">Completed</span>
            <span className="text-[9px] text-purple-700 font-bold block">Monthly Review Verified</span>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
            <span className="text-[10px] font-black text-emerald-600 uppercase block">Risk Change</span>
            <span className="text-base font-black text-emerald-900 block">-{reassessment.improvementDelta}%</span>
            <span className="text-[9px] text-emerald-700 font-bold block">Improvement Tracked</span>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
            <span className="text-[10px] font-black text-amber-600 uppercase block">Status</span>
            <span className="text-base font-black text-amber-900 block">Active</span>
            <span className="text-[9px] text-amber-700 font-bold block">Hormonal Support</span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-purple-800 font-semibold flex items-center justify-between">
          <span>Complete your monthly re-assessment above to calculate your improvement delta.</span>
        </div>
      )}

    </div>
  );
};

export default MonthlyReportCard;
