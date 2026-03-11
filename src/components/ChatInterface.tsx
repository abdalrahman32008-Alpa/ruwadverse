import React, { useState, useEffect, useRef } from 'react';
import { Send, ThumbsUp, ThumbsDown, MessageSquare, X, Sparkles, Mic, BarChart2, Zap, Settings } from 'lucide-react';
import { AdvancedRaedAgent } from '../services/raedAgent';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'react-hot-toast';

type UserType = 'idea' | 'skill' | 'investor' | null;

interface Message {
  role: 'user' | 'model';
  text: string;
  id: string;
  feedback?: 'up' | 'down';
  feedbackText?: string;
}

export const ChatInterface = ({ userType, initialMessage }: { userType?: UserType, initialMessage?: string }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState({
    passion: 85,
    clarity: 70,
    viability: 65
  });
  const [feedbackOpenId, setFeedbackOpenId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const agentRef = useRef<AdvancedRaedAgent | null>(null);
  const hasInitialized = useRef(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isThinking]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      agentRef.current = new AdvancedRaedAgent(userType || 'مستخدم');
      
      const greeting = t('raedWelcome').replace('{userType}', 
        userType === 'idea' ? t('userTypeIdea') : 
        userType === 'skill' ? t('userTypeSkill') : 
        userType === 'investor' ? t('userTypeInvestor') :
        'رائد الأعمال'
      );
      
      const initialMsgs: Message[] = [
        { 
          role: 'model', 
          text: greeting,
          id: 'init'
        }
      ];

      setMessages(initialMsgs);

      if (initialMessage) {
        // Auto-send the initial message
        setTimeout(() => {
          handleSend(initialMessage);
        }, 500);
      }
    }
  }, [userType, t, initialMessage]);

  const handleSend = async (textToSend?: string) => {
    const userMsg = textToSend || input;
    if (!userMsg.trim()) return;
    
    if (!textToSend) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, id: Date.now().toString() }]);
    setIsThinking(true);

    // Simulate "Overthinking" delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      setActiveTool(null);
      const response = await agentRef.current?.sendMessage(userMsg, (toolName) => {
        if (toolName === 'evaluateIdea') setActiveTool('جاري تحليل وتقييم الفكرة...');
        else if (toolName === 'updateUserPreferences') setActiveTool('جاري تحديث ملفك الشخصي بما تعلمته...');
        else setActiveTool(`جاري استخدام أداة: ${toolName}...`);
      }) || '';
      
      setActiveTool(null);
      setMessages(prev => [...prev, { role: 'model', text: response, id: (Date.now() + 1).toString() }]);
      
      // Update insights randomly for demo
      setInsights({
        passion: Math.min(100, insights.passion + Math.floor(Math.random() * 5)),
        clarity: Math.min(100, insights.clarity + Math.floor(Math.random() * 8)),
        viability: Math.min(100, insights.viability + Math.floor(Math.random() * 3))
      });
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ في الاتصال. هل يمكننا المحاولة مرة أخرى؟", id: (Date.now() + 1).toString() }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === msgId ? { ...msg, feedback: type } : msg
    ));
    if (type === 'down') {
      setFeedbackOpenId(msgId);
    }
  };

  const submitFeedbackText = (msgId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === msgId ? { ...msg, feedbackText: feedbackText } : msg
    ));
    setFeedbackOpenId(null);
    setFeedbackText('');
    // Here you would send the feedback to the backend
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('المتصفح لا يدعم التعرف على الصوت');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col h-full bg-[#141517] relative">
      <div className="bg-[#141517] p-4 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)]">
            R
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">RAED AI</h3>
            <p className="text-xs text-[#FFD700] flex items-center gap-1">
              <Sparkles size={10} />
              {t('partner')}
            </p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {t('online')}
        </div>
        <button 
          onClick={() => setShowInsights(!showInsights)}
          className={`p-2 rounded-lg transition-colors ${showInsights ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:bg-white/5'}`}
        >
          <BarChart2 size={18} />
        </button>
      </div>

      {/* Insights Panel */}
      <AnimatePresence>
        {showInsights && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0B0C0E] border-b border-white/10 p-4 grid grid-cols-3 gap-4 relative z-20 shadow-xl"
          >
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wider">
                <span>Passion</span>
                <span className="text-[#FFD700]">{insights.passion}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${insights.passion}%` }} className="h-full bg-[#FFD700]" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wider">
                <span>Clarity</span>
                <span className="text-blue-400">{insights.clarity}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${insights.clarity}%` }} className="h-full bg-blue-400" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wider">
                <span>Viability</span>
                <span className="text-green-400">{insights.viability}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${insights.viability}%` }} className="h-full bg-green-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[#FFD700] text-black rounded-tr-none' 
                : 'bg-[#141517] text-gray-200 rounded-tl-none border border-white/10'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
            
            {msg.role === 'model' && (
              <div className="mt-2 flex items-center gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleFeedback(msg.id, 'up')}
                  className={`p-1 rounded hover:bg-white/5 transition-colors ${msg.feedback === 'up' ? 'text-[#FFD700]' : 'text-gray-600'}`}
                >
                  <ThumbsUp size={14} />
                </button>
                <button 
                  onClick={() => handleFeedback(msg.id, 'down')}
                  className={`p-1 rounded hover:bg-white/5 transition-colors ${msg.feedback === 'down' ? 'text-red-400' : 'text-gray-600'}`}
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
            )}

            {/* Feedback Text Input */}
            <AnimatePresence>
              {feedbackOpenId === msg.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 w-full max-w-[85%]"
                >
                  <div className="bg-[#0B0C0E] border border-white/10 rounded-xl p-3 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">{t('feedbackWhy')}</span>
                      <button onClick={() => setFeedbackOpenId(null)} className="text-gray-500 hover:text-white"><X size={12} /></button>
                    </div>
                    <textarea 
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full bg-[#141517] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#FFD700]/30 border border-white/5 resize-none placeholder-gray-600"
                      rows={2}
                      placeholder={t('feedbackPlaceholder')}
                    />
                    <button 
                      onClick={() => submitFeedbackText(msg.id)}
                      className="mt-2 text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-1.5 rounded-lg transition-colors border border-white/5"
                    >
                      {t('sendFeedback')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {isThinking && (
          <div className="flex flex-col items-start gap-2">
            {activeTool && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[10px] text-[#FFD700] bg-[#FFD700]/10 px-3 py-1.5 rounded-full border border-[#FFD700]/20"
              >
                <Settings size={12} className="animate-spin" />
                {activeTool}
              </motion.div>
            )}
            <div className="bg-[#141517] p-4 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-xs text-gray-500 font-mono">{t('raedThinking')}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#141517] border-t border-white/5 relative z-10 flex flex-col gap-3">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2">
            {[
              "كيف أكتب خطة عمل؟",
              "كيف أجد مستثمراً؟",
              "ما هي أفضل طريقة لعرض فكرتي؟",
              "كيف أقيم شركتي الناشئة؟"
            ].map((query, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(query);
                  // Optional: auto-send
                  // setTimeout(handleSend, 100);
                }}
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
              >
                {query}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2 relative">
          <button 
            onClick={toggleListening}
            className={`p-3 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-[#FFD700]'}`}
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chatPlaceholder')}
            className="flex-1 bg-[#0B0C0E] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFD700]/30 text-white placeholder-gray-600 transition-colors"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isThinking}
            className="bg-[#FFD700] text-black p-3 rounded-xl hover:bg-[#FFC000] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(255,215,0,0.1)] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            <Send size={20} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
