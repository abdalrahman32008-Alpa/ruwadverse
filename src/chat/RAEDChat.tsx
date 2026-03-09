import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2, Loader2, ChevronDown, Lock, Zap, Cpu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import * as Sentry from "@sentry/react";
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

// Initialize Gemini API
// Note: In a real production app, you should proxy this through your backend to hide the API key
// For this demo/preview, we use it directly if available in env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;
const ai = genAI ? Sentry.instrumentGoogleGenAIClient(genAI, {
  recordInputs: true,
  recordOutputs: true,
}) : null;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  timestamp: Date;
  model?: string;
}

const MODELS = [
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', icon: Sparkles, premium: true },
  { id: 'gemini-3.1-flash-preview', name: 'Gemini 3.1 Flash', icon: Zap, premium: true },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', icon: Cpu, premium: false, limit: 5 },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', icon: Bot, premium: false, limit: Infinity },
];

interface RAEDChatProps {
  embedded?: boolean;
}

export const RAEDChat = ({ embedded = false }: RAEDChatProps) => {
  const { t } = useLanguage();
  const { subscriptionTier } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(embedded);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[3]); // Default to Gemini 3 Flash
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [proUsageCount, setProUsageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load usage count from localStorage
    const today = new Date().toDateString();
    const stored = localStorage.getItem('raed_pro_usage');
    if (stored) {
      const { date, count } = JSON.parse(stored);
      if (date === today) {
        setProUsageCount(count);
      } else {
        localStorage.setItem('raed_pro_usage', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      localStorage.setItem('raed_pro_usage', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const incrementUsage = () => {
    if (selectedModel.id === 'gemini-3-pro-preview') {
      const today = new Date().toDateString();
      const newCount = proUsageCount + 1;
      setProUsageCount(newCount);
      localStorage.setItem('raed_pro_usage', JSON.stringify({ date: today, count: newCount }));
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Check subscription and model limits
    if (subscriptionTier === 'free') {
      if (selectedModel.premium) {
        toast.error('هذا النموذج متاح فقط للمشتركين في الباقة المميزة');
        return;
      }
      
      if (selectedModel.id === 'gemini-3-pro-preview' && proUsageCount >= 5) {
        const limitMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '🔒 لقد وصلت للحد الأقصى من رسائل Gemini 3 Pro المجانية (5 رسائل يومياً). يمكنك الاستمرار باستخدام Gemini 3 Flash أو الترقية للباقة المميزة.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, limitMsg]);
        return;
      }
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      model: selectedModel.id
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      if (!ai) {
        throw new Error("Gemini API Key is missing");
      }

      const response = await ai.models.generateContent({
        model: selectedModel.id as any,
        contents: userMsg.content,
      });
      
      const text = response.text || "عذراً، لم أتمكن من توليد رد.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        model: selectedModel.id
      };

      setMessages(prev => [...prev, aiMsg]);
      incrementUsage();

    } catch (error) {
      console.error('Error in RAED chat:', error);
      toast.error('عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي.');
      
      // Add a system message indicating error instead of mock response
      const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'عذراً، لا يمكنني الرد حالياً. يرجى المحاولة لاحقاً.',
          timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen && !embedded) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#FFD700] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        <Bot size={28} className="text-black group-hover:animate-pulse" />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0B0C0E] animate-bounce" />
      </button>
    );
  }

  const containerClasses = embedded 
    ? "w-full h-full flex flex-col bg-[#141517]" 
    : `fixed right-6 z-50 bg-[#141517] border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        isMinimized ? 'bottom-6 w-80 h-16' : 'bottom-6 w-96 h-[600px] max-h-[80vh]'
      }`;

  return (
    <AnimatePresence>
      <motion.div
        initial={embedded ? { opacity: 0 } : { opacity: 0, y: 50, scale: 0.9 }}
        animate={embedded ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={embedded ? { opacity: 0 } : { opacity: 0, y: 50, scale: 0.9 }}
        className={containerClasses}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r from-[#FFD700]/20 to-transparent p-4 flex justify-between items-center border-b border-white/5 ${!embedded && 'cursor-pointer'}`} onClick={() => !embedded && setIsMinimized(!isMinimized)}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-black">
              <Bot size={20} />
            </div>
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowModelSelector(!showModelSelector); }}
                className="flex items-center gap-1 hover:bg-white/5 px-2 py-1 rounded-lg transition-colors"
              >
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  {selectedModel.name}
                  <ChevronDown size={12} className={`transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
                </h3>
              </button>
              
              <AnimatePresence>
                {showModelSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-[#1c1d21] border border-white/10 rounded-xl shadow-2xl z-[60] overflow-hidden"
                  >
                    {MODELS.map((model) => {
                      const isLocked = subscriptionTier === 'free' && model.premium;
                      const isSelected = selectedModel.id === model.id;
                      
                      return (
                        <button
                          key={model.id}
                          disabled={isLocked}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModel(model);
                            setShowModelSelector(false);
                          }}
                          className={`w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-right ${isSelected ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'text-gray-300'} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <model.icon size={16} className={isSelected ? 'text-[#FFD700]' : 'text-gray-400'} />
                            <div className="text-right">
                              <div className="text-xs font-bold">{model.name}</div>
                              {model.id === 'gemini-3-pro-preview' && subscriptionTier === 'free' && (
                                <div className="text-[10px] opacity-60">متبقي: {Math.max(0, 5 - proUsageCount)} رسائل</div>
                              )}
                            </div>
                          </div>
                          {isLocked && <Lock size={12} className="text-gray-500" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              {(!isMinimized || embedded) && <p className="text-[10px] text-green-400 flex items-center gap-1 px-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> متصل وجاهز للمساعدة</p>}
            </div>
          </div>
          {!embedded && (
            <div className="flex items-center gap-2 text-gray-400">
              <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="hover:text-white transition-colors">
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Chat Area */}
        {(!isMinimized || embedded) && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm mt-10">
                  <Bot size={40} className="mx-auto mb-4 opacity-20" />
                  <p>أهلاً بك! أنا رائد، شريكك المؤسس الذكي.</p>
                  <p className="text-xs mt-2">كيف يمكنني مساعدتك في مشروعك اليوم؟</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-[#FFD700]/20 text-[#FFD700]'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#FFD700] text-black rounded-tr-sm' 
                      : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-[#FFD700]" />
                    <span className="text-xs text-gray-400">رائد يكتب...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-[#0B0C0E]">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 pr-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اسأل رائد عن أي شيء..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-white py-2"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center text-black disabled:opacity-50 hover:bg-[#FFC000] transition-colors"
                >
                  <Send size={14} className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
