import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Bot, User, Trash2, Heart, ShieldAlert, ChevronDown, RefreshCw, Minus } from 'lucide-react';
import { generateLunaResponse, getStoredUserContext, type ChatMessage } from '../services/LunaBrain';

interface LunaChatWidgetProps {
  initialOpen?: boolean;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

const INITIAL_WELCOME_MESSAGES = (userName: string, pcosRiskCategory: string): ChatMessage[] => [
  {
    id: 'welcome-1',
    sender: 'luna',
    text: `🌸 Hi ${userName}! I'm **Luna**, your personal AI emotional and health companion.\n\nI already have your health context (PCOS Risk: ${pcosRiskCategory}) so you never have to repeat yourself! How can I support you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quickReplies: [
      'Explain my assessment',
      'What should I eat today?',
      "I'm scared about my results",
      'Show my progress',
      'Daily motivation'
    ]
  }
];

const LunaChatWidget: React.FC<LunaChatWidgetProps> = ({ initialOpen = false, externalPrompt, onClearExternalPrompt }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = getStoredUserContext();
    const storedChat = localStorage.getItem('demo_luna_chat_history');
    if (storedChat) {
      setMessages(JSON.parse(storedChat));
    } else {
      const initial = INITIAL_WELCOME_MESSAGES(ctx.userName, ctx.pcosRiskCategory);
      setMessages(initial);
      localStorage.setItem('demo_luna_chat_history', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    if (externalPrompt) {
      setIsOpen(true);
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: now
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lunaReply = generateLunaResponse(query.trim());
      const finalMsgs = [...updated, lunaReply];
      setMessages(finalMsgs);
      setIsTyping(false);
      localStorage.setItem('demo_luna_chat_history', JSON.stringify(finalMsgs));
    }, 900);
  };

  const handleClearHistory = () => {
    const ctx = getStoredUserContext();
    const initial = INITIAL_WELCOME_MESSAGES(ctx.userName, ctx.pcosRiskCategory);
    setMessages(initial);
    localStorage.setItem('demo_luna_chat_history', JSON.stringify(initial));
  };

  return (
    <>
      {/* FLOATING LUNA BOT COMPANION BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 bg-gradient-to-r from-brand via-brand-pinkdark to-brand hover:scale-105 text-white font-extrabold text-xs px-4 py-3 rounded-full shadow-2xl transition-all duration-300 group border border-white/40"
        >
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
            <Sparkles size={18} className="text-amber-200" />
          </div>
          <span>Talk with Luna AI</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            🌸 AI
          </span>
        </button>
      )}

      {/* CHAT DRAWER MODAL - Highest Z-Index so header controls are fully visible */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 max-w-sm sm:max-w-md w-full bg-white z-[99999] shadow-2xl flex flex-col border-l border-brand-light animate-slide-left">
          
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-brand to-brand-dark text-white flex justify-between items-center shadow-md relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center border border-white/40 shadow-inner">
                <Sparkles size={20} className="text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm tracking-tight">Luna AI</h3>
                  <span className="text-[9px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                    Companion
                  </span>
                </div>
                <p className="text-[10px] text-brand-pastel/80">Emotional Support & Women's Health</p>
              </div>
            </div>

            {/* Header Controls: Clear, Minimize, and Close */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors"
                title="Clear Chat History"
              >
                <Trash2 size={16} />
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-colors flex items-center gap-1 text-xs"
                title="Minimize Luna Drawer"
              >
                <Minus size={16} />
                <span className="hidden sm:inline text-[10px]">Minimize</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-colors"
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="bg-brand-pastel/60 px-4 py-2 text-[10px] text-brand-dark flex items-center justify-between border-b border-brand-light">
            <span className="flex items-center gap-1 font-semibold">
              <Heart size={12} className="text-brand-pinkdark fill-brand-pinkdark" />
              Connected to Your Health Profile
            </span>
            <span className="font-extrabold text-brand bg-white px-2 py-0.5 rounded-full border border-brand-light">
              PCOS Risk Sync ACTIVE
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-brand-muted font-semibold px-1">
                  {msg.sender === 'luna' ? (
                    <>
                      <Sparkles size={10} className="text-brand-pinkdark" />
                      <span>Luna</span>
                    </>
                  ) : (
                    <>
                      <User size={10} className="text-brand" />
                      <span>You</span>
                    </>
                  )}
                  <span>• {msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand text-white rounded-tr-none shadow-sm font-medium'
                      : 'bg-white text-brand-text border border-brand-light rounded-tl-none shadow-soft whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Quick Reply Pills */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(reply)}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-white border border-brand-light text-brand hover:bg-brand hover:text-white transition-all duration-300 shadow-sm"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-brand text-xs font-semibold p-2">
                <div className="h-2 w-2 bg-brand rounded-full animate-ping" />
                <span>Luna is thinking softly...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Medical Disclaimer Footer */}
          <div className="bg-white p-3 border-t border-brand-light space-y-2">
            <div className="text-[9px] text-brand-muted flex items-center gap-1 justify-center italic">
              <ShieldAlert size={10} className="text-amber-500 shrink-0" />
              <span>Luna provides wellness education & support, not medical diagnosis.</span>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Luna anything (e.g. 'What should I eat today?')..."
                className="flex-1 px-4 py-2.5 bg-brand-pastel/30 border border-brand-light rounded-xl text-xs text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 bg-brand text-white rounded-xl hover:bg-brand-dark disabled:opacity-40 transition-colors shadow-sm"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};

export default LunaChatWidget;
