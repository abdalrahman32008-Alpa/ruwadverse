import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Share2, Users, Gift, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ReferralPage = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.id ? user.id.slice(0, 8) : 'LOADING';
  const referralLink = `${window.location.origin}/join?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    const text = `انضم إلى رواد فيرس وابدأ رحلتك الريادية! استخدم الرابط الخاص بي: ${referralLink}`;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FFD700]">برنامج الإحالة</h1>
          <p className="text-xl text-gray-400">
            ادعُ أصدقاءك وانضموا معاً لبناء المستقبل. احصل على شهر مجاني لكل صديق يسجل!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#141517] p-8 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-bl-full -mr-8 -mt-8"></div>
            <h3 className="text-2xl font-bold text-white mb-4">رابط الإحالة الخاص بك</h3>
            <div className="flex items-center gap-2 bg-black/20 p-3 rounded-xl border border-white/10 mb-6">
              <input 
                type="text" 
                readOnly 
                value={referralLink} 
                className="bg-transparent flex-1 text-gray-300 text-sm focus:outline-none"
              />
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-white/10 rounded-lg text-[#FFD700] transition-colors"
                title="نسخ الرابط"
              >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => handleShare('whatsapp')}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={18} /> WhatsApp
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={18} /> Twitter
              </button>
            </div>
          </div>

          <div className="bg-[#141517] p-8 rounded-2xl border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-6">إحصائياتك</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FFD700]/20 text-[#FFD700] rounded-lg"><Users size={20} /></div>
                  <span className="text-gray-300">الأصدقاء المسجلين</span>
                </div>
                <span className="text-2xl font-bold text-white">12</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Gift size={20} /></div>
                  <span className="text-gray-300">الأشهر المجانية المكتسبة</span>
                </div>
                <span className="text-2xl font-bold text-white">3</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">كيف يعمل؟</h3>
          <div className="flex flex-col md:flex-row justify-center gap-8 text-gray-400 text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white">1</div>
              <span>شارك الرابط مع أصدقائك</span>
            </div>
            <div className="hidden md:block w-16 h-px bg-white/10 self-center"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white">2</div>
              <span>يسجل صديقك ويؤكد حسابه</span>
            </div>
            <div className="hidden md:block w-16 h-px bg-white/10 self-center"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white">3</div>
              <span>تحصلون كليكما على شهر مجاني!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
