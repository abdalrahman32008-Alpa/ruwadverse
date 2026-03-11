import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, User, Sparkles, Command, Search, FileText, Users, ChevronDown, ChevronUp, BrainCircuit, Terminal, Shield } from 'lucide-react';
import { RAEDAgentService } from '../services/raedAgentService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  status?: 'thinking' | 'done';
}

export const RAEDAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await RAEDAgentService.chat(input, messages, user.id);
      
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: response,
        timestamp: new Date(),
        status: 'done'
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (error) {
      toast.error('حدث خطأ في الاتصال بالوكيل رائد');
    } finally {
      setIsThinking(false);
    }
  };

  const quickActions = [
    { icon: <Search size={14} />, label: 'ابحث عن شركاء', query: 'ابحث لي عن مبرمجين مهتمين بالذكاء الاصطناعي في الرياض' },
    { icon: <BrainCircuit size={14} />, label: 'حلل مشروعي', query: 'حلل لي فكرة مشروعي الحالي وقدم لي نصائح للتطوير' },
    { icon: <Sparkles size={14} />, label: 'مطابقة الشغف', query: 'حلل مدى توافق شغفي مع فكرة مشروعي الحالي' },
    { icon: <FileText size={14} />, label: 'إنشاء Pitch Deck', query: 'ساعدني في إنشاء مسودة عرض استثماري (Pitch Deck) لمشروعي' },
    { icon: <Shield size={14} />, label: 'تحقق ذكي (AI)', query: 'كيف يمكنني توثيق حسابي ومهاراتي باستخدام الذكاء الاصطناعي؟' },
    { icon: <Users size={14} />, label: 'تواصل مع مستثمر', query: 'كيف يمكنني جذب اهتمام المستثمرين في قطاع التقنية المالية؟' },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '64px' : '600px',
              width: '400px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-[#141517] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    الوكيل رائد
                    <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded-full border border-green-500/20 animate-pulse">متصل</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">شريكك الذكي في رحلة ريادة الأعمال</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
                >
                  {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles size={40} className="text-purple-400 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-2">أهلاً بك في مستقبل ريادة الأعمال</h4>
                        <p className="text-gray-500 text-sm max-w-[250px] mx-auto">أنا رائد، وكيلك الذكي. يمكنني مساعدتك في مطابقة الشغف، إنشاء العروض الاستثمارية، والتحقق الذكي من الهوية.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {quickActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInput(action.query)}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-xs text-gray-300 flex flex-col items-center gap-2 transition-all hover:border-purple-500/30"
                          >
                            <div className="text-purple-400">{action.icon}</div>
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-purple-600 text-white rounded-tr-none' 
                          : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <span className="text-[10px] opacity-50 mt-2 block">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">رائد يفكر...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                  <div className="relative flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="اسأل رائد عن أي شيء..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 pr-12 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <Command size={16} />
                      </div>
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isThinking}
                      className="w-12 h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-purple-600/20"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-4">
                    <span className="text-[10px] text-gray-600 flex items-center gap-1">
                      <Terminal size={10} /> مدعوم بـ Gemini 3.1 Pro
                    </span>
                    <span className="text-[10px] text-gray-600 flex items-center gap-1">
                      <Sparkles size={10} /> ذكاء اصطناعي سيادي
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all relative group ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-br from-purple-600 to-blue-600'
        }`}
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0d1117] rounded-full"></div>
        )}
        <div className="absolute right-full mr-4 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <span className="text-xs font-bold text-white">تحدث مع رائد</span>
        </div>
      </motion.button>
    </div>
  );
};
