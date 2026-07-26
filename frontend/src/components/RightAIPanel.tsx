import React, { useState } from 'react';
import { Send, Sparkles, Bot, HelpCircle, Heart, Utensils, Minus, Maximize2, Minimize2, X, MessageSquare } from 'lucide-react';
import { generateLunaResponse } from '../services/LunaBrain';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'luna';
  text: string;
  timestamp: string;
}

const RightAIPanel: React.FC = () => {
  const [viewState, setViewState] = useState<'normal' | 'minimized' | 'fullscreen'>('normal');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'luna',
      text: 'Hi Rila! How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lunaMsg = generateLunaResponse(userText);
      setMessages((prev) => [...prev, lunaMsg]);
      setIsTyping(false);
    }, 600);
  };

  // 1. MINIMIZED MODE: SLEEK FLOATING LAUNCHER BUTTON IN BOTTOM RIGHT
  if (viewState === 'minimized') {
    return (
      <button
        onClick={() => setViewState('normal')}
        className="fixed bottom-6 right-6 z-[99999] px-4 py-3 bg-gradient-to-r from-brand to-brand-pinkdark text-white rounded-full shadow-2xl flex items-center gap-2.5 transform hover:scale-105 transition-all duration-300 ring-4 ring-purple-100"
      >
        <span className="text-lg animate-bounce">🌸</span>
        <span className="font-extrabold text-xs tracking-tight">Luna AI Companion</span>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  // 2. FULLSCREEN MODE: FULL SCREEN OVERLAY
  if (viewState === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[100000] bg-white flex flex-col justify-between p-6 md:p-10 animate-fade-in space-y-6">
        
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-pinkdark to-brand flex items-center justify-center text-white shadow-md font-black text-xl">
              🌸
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <span>Luna AI Companion (Full Screen View)</span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </h2>
              <p className="text-xs text-gray-500 font-semibold">Your Personal Healthcare & Emotional Guide</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewState('normal')}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all"
              title="Restore to Side Panel"
            >
              <Minimize2 size={16} />
              <span>Side Panel</span>
            </button>

            <button
              onClick={() => setViewState('minimized')}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-brand font-bold text-xs flex items-center gap-1.5 transition-all"
              title="Minimize Chatbot"
            >
              <Minus size={16} />
              <span>Minimize</span>
            </button>
          </div>
        </div>

        {/* Fullscreen Messages List */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-w-4xl mx-auto w-full">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed font-medium shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-brand text-white rounded-br-none'
                    : 'bg-purple-50/90 text-gray-800 rounded-bl-none border border-purple-100/80'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-gray-400 px-2">{m.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-2xl w-fit text-brand text-xs font-bold animate-pulse max-w-4xl mx-auto">
              <span>Luna is typing response...</span>
            </div>
          )}
        </div>

        {/* Fullscreen Quick Prompts & Input */}
        <div className="max-w-4xl mx-auto w-full space-y-4 pt-2">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { text: 'Explain my assessment', icon: HelpCircle },
              { text: 'What should I eat today?', icon: Utensils },
              { text: 'Help me with my symptoms', icon: Heart },
              { text: 'Motivate me', icon: Sparkles }
            ].map((item) => (
              <button
                key={item.text}
                onClick={() => handleSend(item.text)}
                className="px-4 py-2 bg-gray-50 hover:bg-purple-50 hover:text-brand border border-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <item.icon size={14} className="text-brand-pinkdark" />
                <span>{item.text}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Luna anything about your health, diet, or symptoms..."
              className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white shadow-inner transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2.5 top-2.5 p-3 bg-brand text-white rounded-xl shadow-sm disabled:opacity-40 hover:bg-brand-dark transition-all"
            >
              <Send size={16} />
            </button>
          </form>

        </div>

      </div>
    );
  }

  // 3. NORMAL SIDE-PANEL MODE (380px)
  return (
    <aside className="w-[380px] bg-white border-l border-gray-100 flex flex-col justify-between p-5 min-h-screen sticky top-0 h-screen overflow-y-auto shrink-0 shadow-xs z-30 hidden lg:flex">
      
      <div className="space-y-4 flex-1 flex flex-col">
        
        {/* PANEL HEADER WITH MINIMIZE & FULLSCREEN CONTROLS */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-brand-pinkdark to-brand flex items-center justify-center text-white shadow-sm font-black text-sm">
              🌸
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                <span>Luna AI</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[10px] text-gray-500 font-medium">Your Emotional & Health Companion</p>
            </div>
          </div>

          {/* CONTROLS: MINIMIZE & FULL SCREEN */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewState('fullscreen')}
              className="p-1.5 rounded-xl hover:bg-purple-50 text-gray-400 hover:text-brand transition-all"
              title="Full Screen Mode"
            >
              <Maximize2 size={15} />
            </button>

            <button
              onClick={() => setViewState('minimized')}
              className="p-1.5 rounded-xl hover:bg-purple-50 text-gray-400 hover:text-brand transition-all"
              title="Minimize Chatbot"
            >
              <Minus size={16} />
            </button>
          </div>
        </div>

        {/* MESSAGES SCROLL CONTAINER */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1 max-h-[calc(100vh-280px)]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-brand text-white rounded-br-none'
                    : 'bg-purple-50/80 text-gray-800 rounded-bl-none border border-purple-100/60'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-gray-400 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 bg-purple-50 rounded-2xl w-fit text-brand text-xs font-bold animate-pulse">
              <span>Luna is typing...</span>
            </div>
          )}
        </div>

        {/* QUICK PROMPT PILLS */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block px-1">
            Suggested Prompts
          </span>
          <div className="space-y-1.5">
            {[
              { text: 'Explain my assessment', icon: HelpCircle },
              { text: 'What should I eat today?', icon: Utensils },
              { text: 'Help me with my symptoms', icon: Heart },
              { text: 'Motivate me', icon: Sparkles }
            ].map((item) => (
              <button
                key={item.text}
                onClick={() => handleSend(item.text)}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-purple-50 hover:text-brand border border-gray-200/60 hover:border-purple-200 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <item.icon size={14} className="text-brand-pinkdark group-hover:scale-110 transition-transform" />
                  <span>{item.text}</span>
                </div>
                <span className="text-gray-400 group-hover:text-brand">→</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* INPUT BOX */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="relative pt-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Luna anything about your health..."
          className="w-full pl-4 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white shadow-inner transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 top-4.5 p-2 bg-brand text-white rounded-xl shadow-sm disabled:opacity-40 hover:bg-brand-dark transition-all"
        >
          <Send size={14} />
        </button>
      </form>

    </aside>
  );
};

export default RightAIPanel;
