import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, HelpCircle, Shield, Bot } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const FloatingSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Simulate sending
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      setIsOpen(false);
    }, 3000);
  };

  return (
    <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-[100]`} dir={dir}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 w-[350px] bg-[#141517] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            style={{ [dir === 'rtl' ? 'left' : 'right']: 0 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-6 text-black">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{t('supportTitle')}</h3>
                  <p className="text-xs font-medium opacity-80">{t('raedHomeDesc')}</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/10 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2 bg-black/10 px-3 py-2 rounded-xl backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold">{t('online')}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{t('success')}</h4>
                  <p className="text-sm text-gray-400">تم استلام رسالتك، سنرد عليك في أقرب وقت ممكن.</p>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#FFD700]/10 text-[#FFD700] rounded-full flex items-center justify-center shrink-0">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl rounded-tr-none text-sm text-gray-300">
                        مرحباً بك! كيف يمكنني مساعدتك اليوم في رحلتك الريادية؟
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب استفسارك هنا..."
                      className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-[#FFD700] focus:outline-none transition-colors resize-none"
                      rows={3}
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC000] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FFD700]/10"
                    >
                      <Send size={18} />
                      {t('send')}
                    </button>
                  </form>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <button className="text-xs text-gray-500 hover:text-[#FFD700] transition-colors flex items-center gap-1">
                      <HelpCircle size={14} />
                      {t('faq')}
                    </button>
                    <span className="text-[10px] text-gray-600">Powered by RAED AI</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-black rounded-full shadow-2xl flex items-center justify-center relative group overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        {isOpen ? <X size={24} className="relative z-10" /> : <MessageSquare size={24} className="relative z-10" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#0B0C0E] rounded-full animate-bounce" />
        )}
      </motion.button>
    </div>
  );
};
