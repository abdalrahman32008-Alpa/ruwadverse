import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabase';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  timestamp: Date;
}

export const RAEDChat = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Load context memory from Supabase
    const loadConversation = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setConversationId(data.id);
          setMessages(data.messages || []);
        } else {
          // Create new conversation
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({ user_id: user.id, messages: [] })
            .select()
            .single();
          if (newConv) setConversationId(newConv.id);
        }
      }
    };
    loadConversation();
  }, []);

  const detectEmotion = async (text: string): Promise<string> => {
    // Mocking Arabic Emotion Detection (SVM/KNN via API)
    // In reality, call a HuggingFace API or custom backend
    const prompt = `Analyze the emotion of this Arabic text. Return ONLY ONE word from: [happy, sad, angry, anxious, neutral]. Text: "${text}"`;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text?.trim().toLowerCase() || 'neutral';
    } catch (e) {
      return 'neutral';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

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
      // 1. Detect Emotion
      const emotion = await detectEmotion(userMsg.content);
      userMsg.emotion = emotion;

      // 2. Adaptive Conversation (Tone adjustment based on emotion)
      let tonePrompt = '';
      if (emotion === 'angry' || emotion === 'anxious') {
        tonePrompt = 'The user seems stressed or upset. Respond with extreme empathy, calmness, and a highly supportive, professional tone in Arabic (Egyptian/Khaleeji dialect mix).';
      } else if (emotion === 'happy') {
        tonePrompt = 'The user is happy. Respond with enthusiasm, encouragement, and a friendly, energetic tone in Arabic.';
      } else {
        tonePrompt = 'Respond professionally and helpfully in Arabic.';
      }

      // 3. Generate Response with Context Memory
      const chatHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'RAED'}: ${m.content}`).join('\n');
      
      const prompt = `
        You are RAED, an AI Co-Founder and startup advisor on the ruwadverse platform.
        ${tonePrompt}
        
        Previous Conversation Context:
        ${chatHistory}
        
        User's latest message: ${userMsg.content}
        
        RAED's response:
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview', // Using Pro for complex reasoning
        contents: prompt,
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || 'عذراً، حدث خطأ في معالجة طلبك.',
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMsg, aiMsg];
      setMessages(updatedMessages);

      // 4. Save to Supabase Context Memory
      if (conversationId) {
        await supabase
          .from('conversations')
          .update({ messages: updatedMessages, emotion_state: emotion })
          .eq('id', conversationId);
      }

    } catch (error) {
      console.error('Error in RAED chat:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'عذراً، أواجه صعوبة في الاتصال حالياً. يرجى المحاولة لاحقاً.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className={`fixed right-6 z-50 bg-[#141517] border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isMinimized ? 'bottom-6 w-80 h-16' : 'bottom-6 w-96 h-[600px] max-h-[80vh]'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD700]/20 to-transparent p-4 flex justify-between items-center border-b border-white/5 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-black">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                RAED AI
                <Sparkles size={12} className="text-[#FFD700]" />
              </h3>
              {!isMinimized && <p className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> متصل وجاهز للمساعدة</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="hover:text-white transition-colors">
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        {!isMinimized && (
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
                    {msg.emotion && msg.emotion !== 'neutral' && (
                      <span className="block text-[10px] opacity-50 mt-1 capitalize">Detected: {msg.emotion}</span>
                    )}
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
