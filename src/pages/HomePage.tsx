import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, Users, Lightbulb, ArrowUpRight, Activity, Target, Sparkles, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    { label: 'مشاهدات الملف الشخصي', value: '1,245', trend: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'التفاعلات مع أفكارك', value: '84', trend: '+5%', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'طلبات الشراكة', value: '12', trend: '+2', icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const recommendedProjects = [
    { id: '1', title: 'منصة تعليمية بالذكاء الاصطناعي', match: '95%', role: 'مطور واجهات' },
    { id: '2', title: 'تطبيق توصيل مستدام', match: '88%', role: 'شريك تقني' },
    { id: '3', title: 'سوق للمنتجات المحلية', match: '82%', role: 'مستثمر' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-24 pb-24 px-4 md:pl-64">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141517] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              مرحباً بعودتك، <span className="text-[#FFD700]">{user?.email?.split('@')[0] || 'رائد الأعمال'}</span> 👋
            </h1>
            <p className="text-gray-400">إليك ملخص نشاطك وأحدث الفرص المتاحة لك اليوم.</p>
          </div>
          <button 
            onClick={() => navigate('/ideas/new')}
            className="relative z-10 flex items-center gap-2 bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors shadow-lg shadow-[#FFD700]/20"
          >
            <PlusIcon size={20} />
            إضافة مشروع جديد
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#141517] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className="flex items-center text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">
                  {stat.trend} <ArrowUpRight size={12} className="ml-1" />
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommended Projects */}
          <div className="bg-[#141517] rounded-3xl border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="text-[#FFD700]" size={20} />
                مشاريع مقترحة لك
              </h2>
              <button onClick={() => navigate('/marketplace')} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                عرض الكل <ChevronLeft size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {recommendedProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer" onClick={() => navigate(`/idea/${project.id}`)}>
                  <div>
                    <h3 className="font-bold text-white mb-1">{project.title}</h3>
                    <p className="text-xs text-gray-400">مطلوب: <span className="text-gray-300">{project.role}</span></p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded-lg">
                      نسبة التوافق {project.match}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / RAED AI */}
          <div className="bg-gradient-to-br from-[#141517] to-[#1a1b1e] rounded-3xl border border-white/5 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-purple-500" />
            <h2 className="text-xl font-bold mb-2">تحدث مع رائد (RAED AI)</h2>
            <p className="text-gray-400 text-sm mb-6">مستشارك الذكي جاهز لمساعدتك في تطوير فكرتك أو البحث عن شركاء.</p>
            
            <div className="space-y-3 mb-6">
              <button onClick={() => navigate('/raed')} className="w-full text-right p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300 border border-white/5">
                "كيف أبدأ في كتابة خطة عمل لمشروعي؟"
              </button>
              <button onClick={() => navigate('/raed')} className="w-full text-right p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300 border border-white/5">
                "ما هي أفضل طريقة للبحث عن مستثمر ملائكي؟"
              </button>
            </div>

            <button onClick={() => navigate('/raed')} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold text-white flex items-center justify-center gap-2">
              بدء محادثة جديدة
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const PlusIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
