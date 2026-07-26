import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, BrainCircuit, HeartPulse, Sparkles, ChevronRight, Activity, CalendarRange, Utensils, Search, HelpCircle } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Landing: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-b from-brand-pastel to-white min-h-screen overflow-x-hidden font-sans">
      
      {/* Landing Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="HerLytics Logo" className="h-10 w-10 object-contain rounded-full shadow-md" />
          <span className="font-bold text-xl text-brand tracking-tight">HerLytics</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="px-5 py-2.5 rounded-2xl bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-all duration-300 shadow-md">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-brand-text/80 hover:text-brand font-bold text-sm transition-all duration-300">
                Sign In
              </Link>
              <Link to="/register" className="px-5 py-2.5 rounded-2xl bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-all duration-300 shadow-md">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
        <div className="absolute top-[10%] left-[-10%] w-72 h-72 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 bg-brand-light/30 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/5 border border-brand/10 text-brand text-xs font-bold animate-pulse-subtle">
            <Sparkles size={14} className="text-brand-pinkdark" />
            <span>AI-Powered Women's Wellness Companion</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-text leading-tight tracking-tight">
            Understand your body. <br />
            <span className="bg-gradient-to-r from-brand to-brand-pinkdark bg-clip-text text-transparent">Empower your health.</span>
          </h1>

          <p className="text-lg text-brand-muted leading-relaxed max-w-lg">
            Our AI-powered assessment helps you evaluate your risk of PCOS (PCOD) based on lifestyle, symptoms, and menstrual habits. Take control with personalized nutrition, calendar tracking, and actionable wellness insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              to={user ? "/assessment" : "/register"}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand text-white font-extrabold text-base hover:bg-brand-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
            >
              <span>Start Your Assessment</span>
              <ChevronRight size={18} />
            </Link>
            <a
              href="#features"
              className="flex items-center justify-center px-8 py-4 rounded-2xl bg-white border border-brand-light text-brand-text font-bold text-base hover:bg-brand-pastel transition-all duration-300"
            >
              Explore Features
            </a>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-brand-light">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-brand-pinkdark" size={18} />
              <span className="text-xs font-semibold text-brand-muted">100% Private & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="text-brand" size={18} />
              <span className="text-xs font-semibold text-brand-muted">AI-Powered Risk Predictions</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="w-full max-w-sm rounded-[3rem] p-4 bg-white shadow-card border border-brand-light relative z-10 rotate-1 lg:rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="rounded-[2.2rem] bg-brand-pastel overflow-hidden border border-brand-light flex flex-col p-6 items-center text-center space-y-6">
              
              <div className="w-full flex justify-between items-center">
                <span className="font-bold text-brand text-sm">HerLytics</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-pink text-[10px] text-brand-pinkdark font-bold">100% Private</span>
              </div>

              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-md relative mt-4">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-brand-pink animate-spin" style={{ animationDuration: '20s' }} />
                <HeartPulse size={48} className="text-brand-pinkdark animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-xl text-brand-text">PCOS Risk Assessment</h3>
                <p className="text-xs text-brand-muted max-w-[240px]">
                  Answer 25 lifestyle and symptom questions to get your personalized risk insights.
                </p>
              </div>

              <Link
                to={user ? "/assessment" : "/register"}
                className="w-full py-3.5 rounded-2xl bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-all duration-300"
              >
                Begin Assessment
              </Link>
            </div>
          </div>
          
          {/* Back decorative floating card */}
          <div className="absolute top-[40%] left-[5%] p-4 bg-white/90 rounded-2xl shadow-soft border border-brand-light z-20 animate-pulse-subtle flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-pink/30 text-brand-pinkdark">
              <BrainCircuit size={20} />
            </div>
            <div>
              <span className="block text-[10px] text-brand-muted font-medium">AI Confidence</span>
              <span className="font-bold text-sm text-brand-text">98.3% Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-brand-light">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-brand-text tracking-tight sm:text-4xl">
            Everything you need in one platform
          </h2>
          <p className="text-brand-muted">
            Designed to bridge the gap between wellness tracking and personalized lifestyle solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="bg-white p-6 rounded-3xl border border-brand-light shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/5 text-brand flex items-center justify-center">
              <BrainCircuit size={24} />
            </div>
            <h3 className="font-extrabold text-lg text-brand-text">AI Risk Prediction</h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              Find out your PCOS risk level through our Machine Learning model. Includes confidence levels and key contributing factors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-brand-light shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/5 text-brand flex items-center justify-center">
              <CalendarRange size={24} />
            </div>
            <h3 className="font-extrabold text-lg text-brand-text">Menstrual Tracker</h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              Log cycles, periods, and moods. Automatically compute predicted next cycles, ovulation periods, and fertile windows.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-brand-light shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/5 text-brand flex items-center justify-center">
              <Utensils size={24} />
            </div>
            <h3 className="font-extrabold text-lg text-brand-text">Diet & Recipe Planner</h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              Get customized meal plans based on your PCOS assessment. Browse dietary categories and save anti-inflammatory recipes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-brand-light shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/5 text-brand flex items-center justify-center">
              <Search size={24} />
            </div>
            <h3 className="font-extrabold text-lg text-brand-text">Healthy Food Finder</h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              Craving junk food? Search for healthy alternatives with full nutritional comparisons and order recommendations.
            </p>
          </div>

        </div>
      </section>

      {/* Medical Disclaimer Section */}
      <section className="bg-brand-light/30 border-y border-brand-light py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-brand-text/90">
          <div className="p-3 bg-white rounded-2xl text-brand shadow-sm">
            <HelpCircle size={28} />
          </div>
          <div className="space-y-2">
            <h4 className="font-extrabold text-lg text-brand-text">Important Medical Disclaimer</h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              HerLytics is not a diagnostic or treatment platform. It provides predictive insights based on user-supplied information and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Users with concerning symptoms or elevated risk should consult a qualified healthcare professional.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between items-center border-t border-brand-light text-sm text-brand-muted gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="HerLytics Logo" className="h-6 w-6 object-contain rounded-full" />
          <span className="font-bold text-brand-text">HerLytics</span>
        </div>
        <div>
          <span>© {new Date().getFullYear()} HerLytics. Predict. Prevent. Empower.</span>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
