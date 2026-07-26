import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, Heart } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl shadow-card relative overflow-hidden border border-white/50">
        
        {/* Soft pastel backgrounds inside card */}
        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-brand-pink/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 bg-brand-light/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col items-center">
          <img src={logo} alt="HerLytics Logo" className="h-20 w-20 object-contain rounded-full shadow-md mb-4" />
          <h2 className="text-center text-3xl font-extrabold text-brand-text tracking-tight font-sans">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-brand-muted">
            Predict. Prevent. Empower. 🌸
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-brand-text/80 block mb-1">Email address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-brand-light bg-white/60 focus:bg-white rounded-2xl text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-300 text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-text/80 block mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-brand-light bg-white/60 focus:bg-white rounded-2xl text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-300 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-brand-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand hover:text-brand-dark transition-all duration-300">
              Create an account
            </Link>
          </p>
        </div>

        <div className="pt-4 border-t border-brand-light flex items-center justify-center gap-1.5 text-[11px] text-brand-muted">
          <Heart size={10} className="text-brand-pinkdark fill-brand-pinkdark animate-pulse" />
          <span>Your privacy is our priority. 100% Secure.</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
