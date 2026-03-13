import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Copy, Share2, Users, Gift, CheckCircle, Award, Sparkles, Target, Zap, ShieldCheck, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export const ReferralPage = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'referral' | 'rewards' | 'ambassador'>('referral');
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    const fetchReferralCount = async () => {
      if (!user) return;
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('onboarding_data->>referred_by', user.id.slice(0, 8).toUpperCase());
          
        if (!error && count !== null) {
          setReferralCount(count);
        }
      } catch (error) {
        console.error('Error fetching referral count:', error);
      }
    };
    
    fetchReferralCount();
  }, [user]);

  const referralCode = user?.id ? user.id.slice(0, 8).toUpperCase() : 'RUWAD26';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const rewards = [
    { id: 1, title: 'اشتراك Pro مجاني', description: 'ادعُ 3 أصدقاء للتسجيل', progress: referralCount, total: 3, icon: Gift, color: 'text-purple-400' },
    { id: 2, title: 'شارة "سفير رواد"', description: 'ادعُ 10 أصدقاء للتسجيل', progress: referralCount, total: 10, icon: Award, color: 'text-[#FFD700]' },
    { id: 3, title: 'جلسة استشارية خاصة', description: 'ادعُ 25 صديقاً للتسجيل', progress: referralCount, total: 25, icon: Sparkles, color: 'text-blue-400' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('تم نسخ الرابط بنجاح');
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FFD700]">برنامج المكافآت والسفراء</h1>
          <p className="text-xl text-gray-400">
            ادعُ أصدقاءك وانضموا معاً لبناء المستقبل. احصل على مكافآت حصرية وارتقِ لتصبح سفيراً لرواد فيرس!
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button 
            onClick={() => setActiveTab('referral')}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === 'referral' ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            رابط الإحالة
          </button>
          <button 
            onClick={() => setActiveTab('rewards')}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === 'rewards' ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            المكافآت
          </button>
          <button 
            onClick={() => setActiveTab('ambassador')}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === 'ambassador' ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            برنامج السفراء
          </button>
        </div>

        {activeTab === 'referral' && (
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
                  <span className="text-2xl font-bold text-white">{referralCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Gift size={20} /></div>
                    <span className="text-gray-300">المكافآت المكتسبة</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{Math.floor(referralCount / 3)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-[#141517] p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 ${reward.color}`}>
                  <reward.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">{reward.title}</h3>
                <p className="text-sm text-gray-400 mb-6">{reward.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">التقدم</span>
                    <span className="text-white font-bold">{reward.progress} / {reward.total}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((reward.progress / reward.total) * 100, 100)}%` }}
                      className="h-full bg-[#FFD700]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ambassador' && (
          <div className="bg-[#141517] p-8 rounded-3xl border border-[#FFD700]/20 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            
            <div className="text-center mb-10 relative z-10">
              <div className="w-20 h-20 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FFD700]/30">
                <Crown className="text-[#FFD700]" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">برنامج سفراء رواد فيرس</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                كن جزءاً من النخبة التي تقود التغيير في ريادة الأعمال بالشرق الأوسط. بصفتك سفيراً، ستمثل رواد فيرس في مجتمعك وتحصل على امتيازات حصرية.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10 relative z-10">
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-center">
                <Target className="text-blue-400 mx-auto mb-4" size={32} />
                <h4 className="font-bold text-white mb-2">التأثير والقيادة</h4>
                <p className="text-sm text-gray-400">قد مجتمعك المحلي وكن صوت رواد فيرس في الفعاليات والجامعات.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-center">
                <Zap className="text-purple-400 mx-auto mb-4" size={32} />
                <h4 className="font-bold text-white mb-2">وصول مبكر</h4>
                <p className="text-sm text-gray-400">جرب الميزات الجديدة قبل الجميع وساهم في تشكيل مستقبل المنصة.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-center">
                <ShieldCheck className="text-green-400 mx-auto mb-4" size={32} />
                <h4 className="font-bold text-white mb-2">دعم مخصص</h4>
                <p className="text-sm text-gray-400">تواصل مباشر مع فريق المؤسسين ودعم خاص لمبادراتك.</p>
              </div>
            </div>

            <div className="text-center relative z-10">
              <button className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors shadow-lg shadow-[#FFD700]/20">
                قدم طلب الانضمام للسفراء
              </button>
              <p className="text-xs text-gray-500 mt-4">* يتطلب الانضمام دعوة 10 أشخاص على الأقل واجتياز المقابلة.</p>
            </div>
          </div>
        )}

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
              <span>تحصلون كليكما على المكافآت!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
