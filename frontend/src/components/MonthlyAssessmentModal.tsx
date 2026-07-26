import React, { useState } from 'react';
import { Sparkles, X, Check, ArrowRight, HeartPulse, ShieldCheck, Award, TrendingDown, CheckCircle2 } from 'lucide-react';

export interface MonthlyAssessmentResult {
  id: string;
  monthName: string;
  year: number;
  initialRiskPercentage: number;
  newRiskPercentage: number;
  improvementDelta: number; // e.g. +26.5%
  cycleStatus: string;
  skinStatus: string;
  energyStatus: string;
  stressStatus: string;
  cravingsStatus: string;
  createdAt: string;
}

interface MonthlyAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssessmentCompleted: (result: MonthlyAssessmentResult) => void;
}

const MonthlyAssessmentModal: React.FC<MonthlyAssessmentModalProps> = ({ isOpen, onClose, onAssessmentCompleted }) => {
  const [step, setStep] = useState(1);

  // Form Answers
  const [cycleStatus, setCycleStatus] = useState('Regular');
  const [skinStatus, setSkinStatus] = useState('Significantly Improved');
  const [energyStatus, setEnergyStatus] = useState('High & Sustained');
  const [stressStatus, setStressStatus] = useState('Low & Well Managed');
  const [cravingsStatus, setCravingsStatus] = useState('Under Control');

  if (!isOpen) return null;

  const now = new Date();
  const monthName = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();

  const handleCalculateResults = () => {
    // Read initial risk percentage
    const storedLatest = localStorage.getItem('demo_latest_assessment');
    const parsed = storedLatest ? JSON.parse(storedLatest) : null;
    const initialRisk = parsed?.riskPercentage || 68.5;

    // Calculate improvement points
    let pointsOff = 0;
    if (cycleStatus === 'Regular') pointsOff += 10;
    if (skinStatus.includes('Improved')) pointsOff += 6;
    if (energyStatus.includes('High')) pointsOff += 5;
    if (stressStatus.includes('Low')) pointsOff += 4;
    if (cravingsStatus.includes('Control')) pointsOff += 4;

    const newRisk = Math.max(15, Math.round((initialRisk - pointsOff) * 10) / 10);
    const delta = Math.round((initialRisk - newRisk) * 10) / 10;

    const result: MonthlyAssessmentResult = {
      id: Date.now().toString(),
      monthName,
      year,
      initialRiskPercentage: initialRisk,
      newRiskPercentage: newRisk,
      improvementDelta: delta,
      cycleStatus,
      skinStatus,
      energyStatus,
      stressStatus,
      cravingsStatus,
      createdAt: new Date().toISOString()
    };

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem('demo_monthly_reassessments') || '[]');
    localStorage.setItem('demo_monthly_reassessments', JSON.stringify([result, ...existing]));

    onAssessmentCompleted(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100000] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl relative border border-white/60">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-brand-pastel hover:bg-brand-light text-brand-muted hover:text-brand transition-all duration-300"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-brand-pink/20 px-3 py-1 rounded-full">
            Monthly Progress Assessment • {monthName} {year}
          </span>
          <h2 className="text-xl font-black text-brand-text pt-1">
            Check Your Body Improvement 🌸
          </h2>
          <p className="text-xs text-brand-muted">
            5 quick questions to evaluate how your body and hormonal symptoms have improved this month.
          </p>
        </div>

        {/* STEP 1: CYCLE REGULARITY */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-brand-text">1. How was your menstrual cycle regularity this month?</h3>
            <div className="space-y-2">
              {[
                { label: 'Regular', desc: 'On time, normal duration and flow' },
                { label: 'Slightly Delayed', desc: 'A few days late, but manageable' },
                { label: 'Irregular / Missed', desc: 'Irregular cycle or skipped period' }
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setCycleStatus(opt.label)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    cycleStatus === opt.label
                      ? 'bg-brand/10 border-brand text-brand shadow-sm font-bold'
                      : 'bg-white border-brand-light/60 text-brand-text hover:border-brand/30'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black block">{opt.label}</span>
                    <span className="text-[10px] text-brand-muted font-normal block">{opt.desc}</span>
                  </div>
                  {cycleStatus === opt.label && <CheckCircle2 size={16} className="text-brand" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1 hover:bg-brand-dark"
            >
              <span>Next Question</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* STEP 2: SKIN & ACNE */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-brand-text">2. How has your acne and skin health shifted this month?</h3>
            <div className="space-y-2">
              {[
                { label: 'Significantly Improved', desc: 'Fewer breakouts, clearer skin' },
                { label: 'Mild Breakouts', desc: 'Occasional spots during PMS' },
                { label: 'Persistent Acne', desc: 'Oily skin & hormonal acne' }
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSkinStatus(opt.label)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    skinStatus === opt.label
                      ? 'bg-brand/10 border-brand text-brand shadow-sm font-bold'
                      : 'bg-white border-brand-light/60 text-brand-text hover:border-brand/30'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black block">{opt.label}</span>
                    <span className="text-[10px] text-brand-muted font-normal block">{opt.desc}</span>
                  </div>
                  {skinStatus === opt.label && <CheckCircle2 size={16} className="text-brand" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 bg-brand-pastel text-brand font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1 hover:bg-brand-dark"
              >
                <span>Next Question</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ENERGY & FATIGUE */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-brand-text">3. How were your daily energy and stamina levels?</h3>
            <div className="space-y-2">
              {[
                { label: 'High & Sustained', desc: 'Energetic throughout the day' },
                { label: 'Moderate Energy', desc: 'Mid-afternoon dips, but overall stable' },
                { label: 'Frequent Fatigue', desc: 'Feeling tired & sluggish often' }
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setEnergyStatus(opt.label)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    energyStatus === opt.label
                      ? 'bg-brand/10 border-brand text-brand shadow-sm font-bold'
                      : 'bg-white border-brand-light/60 text-brand-text hover:border-brand/30'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black block">{opt.label}</span>
                    <span className="text-[10px] text-brand-muted font-normal block">{opt.desc}</span>
                  </div>
                  {energyStatus === opt.label && <CheckCircle2 size={16} className="text-brand" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 bg-brand-pastel text-brand font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-3 bg-brand text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1 hover:bg-brand-dark"
              >
                <span>Next Question</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: STRESS & CRAVINGS */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-brand-text">4. How well were your stress and sugar cravings managed?</h3>
            <div className="space-y-2">
              {[
                { label: 'Low & Well Managed', desc: 'Few cravings, stable mood' },
                { label: 'Moderate Cravings', desc: 'Occasional sweet cravings' },
                { label: 'Uncontrolled Cravings', desc: 'Frequent intense sugar/carb cravings' }
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setStressStatus(opt.label);
                    setCravingsStatus(opt.label);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    stressStatus === opt.label
                      ? 'bg-brand/10 border-brand text-brand shadow-sm font-bold'
                      : 'bg-white border-brand-light/60 text-brand-text hover:border-brand/30'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black block">{opt.label}</span>
                    <span className="text-[10px] text-brand-muted font-normal block">{opt.desc}</span>
                  </div>
                  {stressStatus === opt.label && <CheckCircle2 size={16} className="text-brand" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-3 bg-brand-pastel text-brand font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleCalculateResults}
                className="w-2/3 py-3 bg-gradient-to-r from-brand via-brand-pinkdark to-brand text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1 hover:scale-105 transition-all"
              >
                <Sparkles size={16} className="text-amber-200" />
                <span>Calculate Body Improvement</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MonthlyAssessmentModal;
