import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, ClipboardList, Activity, BarChart3, User, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';
import RightAIPanel from '../components/RightAIPanel';
import DailyCheckinModal from '../components/DailyCheckinModal';
import SmartReminders from '../components/SmartReminders';

const NavbarLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [externalLunaPrompt, setExternalLunaPrompt] = useState<string | undefined>(undefined);

  const handleCheckinComplete = (mood: string) => {
    setExternalLunaPrompt(`I logged my mood today as "${mood}". What is your wellness tip for me today?`);
  };

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/assessment', label: 'Assessment', icon: ClipboardList },
    { path: '/tracker', label: 'Track', icon: Activity },
    { path: '/insights', label: 'Insights', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-gray-800 flex flex-col md:flex-row relative">
      
      {/* GLOBAL LUNA AI COMPONENT SUITE */}
      <DailyCheckinModal onCheckinComplete={handleCheckinComplete} />
      <SmartReminders onOpenLunaChatWithPrompt={(prompt) => setExternalLunaPrompt(prompt)} />

      {/* LEFT SIDEBAR (280px) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MAIN CENTER FLEXIBLE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <HeaderBar />

        {/* PAGE OUTLET (MAX CONTENT WIDTH 1800PX) */}
        <main className="flex-1 p-4 md:p-8 max-w-[1800px] w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>

      {/* RIGHT AI ASSISTANT PANEL (380px) */}
      <RightAIPanel />

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around py-3 z-50 shadow-lg">
        {navItems.map((item) => {
          const Active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                Active ? 'text-brand scale-105 font-bold' : 'text-gray-400 hover:text-brand'
              }`}
            >
              <div className={`p-1 rounded-full ${Active ? 'bg-purple-50 text-brand' : ''}`}>
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default NavbarLayout;
