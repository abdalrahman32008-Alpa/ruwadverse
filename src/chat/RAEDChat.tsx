import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

// Initialize Gemini API
// Note: In a real production app, you should proxy this through your backend to hide the API key
// For this demo/preview, we use it directly if available in env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  timestamp: Date;
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (subscriptionTier === 'free' && messages.filter(m => m.role === 'user').length >= 5) {
      const limitMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '🔒 لقد وصلت للحد الأقصى من الرسائل المجانية (5 رسائل). يرجى الترقية للعضوية المميزة لمتابعة المحادثة بلا حدود.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, limitMsg]);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      if (!ai) {
        throw new Error("Gemini API Key is missing");
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg.content,
      });
      
      const text = response.text || "عذراً، لم أتمكن من توليد رد.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);

      // Save to Supabase (optional, for history)
      // await supabase.from('chat_history').insert([...]);

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
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                RAED AI
                <Sparkles size={12} className="text-[#FFD700]" />
              </h3>
              {(!isMinimized || embedded) && <p className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> متصل وجاهز للمساعدة</p>}
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
