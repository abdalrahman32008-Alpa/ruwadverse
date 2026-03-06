import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Linkedin } from 'lucide-react';

// --- مكون تسجيل الدخول الاجتماعي ---
// يعرض أزرار تسجيل الدخول عبر Google, Apple, LinkedIn
export const SocialLogin = () => {
  const [toast, setToast] = useState<string | null>(null);

  const handleSocialClick = (platform: string) => {
    setToast(`سيتم تفعيل الدخول عبر ${platform} قريباً — سجل بالبريد الإلكتروني الآن`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 mb-8">
      {/* Google Button */}
      <button
        onClick={() => handleSocialClick('Google')}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#FFD700]/30 hover:border-[#FFD700] hover:bg-[#FFD700]/10 transition-all group bg-white/5 backdrop-blur-sm"
      >
        <img src="https://www.google.com/favicon.ico" width="18" alt="Google" className="opacity-80 group-hover:opacity-100 transition-opacity" />
        <span className="text-gray-300 group-hover:text-[#FFD700] font-medium transition-colors">تسجيل الدخول عبر Google</span>
      </button>

      {/* Apple Button */}
      <button
        onClick={() => handleSocialClick('Apple')}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#FFD700]/30 hover:border-[#FFD700] hover:bg-[#FFD700]/10 transition-all group bg-white/5 backdrop-blur-sm"
      >
        <svg className="w-5 h-5 text-gray-300 group-hover:text-[#FFD700] transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.64 3.98-1.54.66.03 2.53.26 3.6 1.83-3.13 1.88-2.61 5.75.53 7.1-.67 1.69-1.6 3.33-3.19 4.84zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        <span className="text-gray-300 group-hover:text-[#FFD700] font-medium transition-colors">تسجيل الدخول عبر Apple</span>
      </button>

      {/* LinkedIn Button */}
      <button
        onClick={() => handleSocialClick('LinkedIn')}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#FFD700]/30 hover:border-[#FFD700] hover:bg-[#FFD700]/10 transition-all group bg-white/5 backdrop-blur-sm"
      >
        <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-[#FFD700] transition-colors" />
        <span className="text-gray-300 group-hover:text-[#FFD700] font-medium transition-colors">تسجيل الدخول عبر LinkedIn</span>
      </button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#0B0C0E] text-gray-500">أو</span>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1A1D21] border border-[#FFD700]/30 text-[#FFD700] px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 backdrop-blur-xl"
          >
            <span className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
