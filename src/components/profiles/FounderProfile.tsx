import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, CheckCircle, TrendingUp, Users, Target, Zap, Award, Briefcase, ExternalLink, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- مكون ملف صاحب الفكرة ---
// يعرض هذا المكون الملف الشخصي للمؤسس، بما في ذلك رحلته، أفكاره النشطة، ومقياس الجاذبية
export const FounderProfile = () => {
  const founderScore = 88;
  
  // بيانات الرحلة (Timeline)
  const journey = [
    { year: '2020', title: 'بداية الرحلة', desc: 'تأسيس أول شركة ناشئة في مجال التجارة الإلكترونية.' },
    { year: '2021', title: 'أول استثمار', desc: 'الحصول على جولة Pre-Seed بقيمة 500 ألف جنيه.' },
    { year: '2022', title: 'التوسع', desc: 'دخول السوق المصري والإماراتي.' },
    { year: '2023', title: 'تخارج ناجح', desc: 'الاستحواذ على الشركة من قبل مجموعة كبرى.' },
  ];

  const activeIdeas = [
    {
      title: 'EduAI Platform',
      status: 'تحت التحليل',
      statusColor: 'text-yellow-400 bg-yellow-400/10',
      successRate: 85,
      desc: 'منصة تعليمية تعتمد على الذكاء الاصطناعي لتخصيص المناهج الدراسية.',
      tags: ['EdTech', 'AI']
    },
    {
      title: 'Green Logistics',
      status: 'معروضة للشراكة',
      statusColor: 'text-green-400 bg-green-400/10',
      successRate: 92,
      desc: 'حلول لوجستية مستدامة للميل الأخير باستخدام الدراجات الكهربائية.',
      tags: ['Logistics', 'GreenTech']
    }
  ];

  const interests = ['التقنية المالية', 'الذكاء الاصطناعي', 'التجارة الإلكترونية', 'SaaS', 'HealthTech'];

  // Gauge Chart Data
  const gaugeData = [
    { name: 'Score', value: founderScore },
    { name: 'Remaining', value: 100 - founderScore },
  ];
  const gaugeColors = ['#FFD700', '#333'];

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pb-20 pt-20">
      {/* Header Section */}
      <div className="relative mb-12">
        <div className="h-48 w-full bg-gradient-to-r from-[#1A1D21] to-[#0B0C0E] border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="relative">
              <img 
                src="https://ui-avatars.com/api/?name=Founder&background=141517&color=FFD700" 
                alt="Founder" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-[#0B0C0E] shadow-2xl object-cover"
              />
              <div className="absolute -bottom-3 -right-3 bg-[#FFD700] text-black p-1.5 rounded-full border-4 border-[#0B0C0E]" title="Verified Founder">
                <CheckCircle size={20} fill="currentColor" className="text-white" stroke="black" />
              </div>
            </div>
            
            <div className="mb-2 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                    سارة الأحمد
                    <span className="px-2 py-0.5 bg-[#FFD700]/10 text-[#FFD700] text-xs rounded-full border border-[#FFD700]/20 font-normal">Verified Founder</span>
                  </h1>
                  <p className="text-gray-400 text-lg">رائدة أعمال متسلسلة | شغوفة بالابتكار التقني</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="block text-2xl font-bold text-white">5</span>
                    <span className="text-xs text-gray-500">أفكار مقدمة</span>
                  </div>
                  <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="block text-2xl font-bold text-[#FFD700]">3</span>
                    <span className="text-xs text-gray-500">شراكات ناجحة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Journey Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#FFD700] rounded-full"></span>
              ملخص الرحلة
            </h2>
            <div className="relative border-r border-white/10 mr-4 space-y-8">
              {journey.map((item, idx) => (
                <div key={idx} className="relative pr-8 group">
                  <div className="absolute -right-1.5 top-1.5 w-3 h-3 bg-[#141517] border-2 border-[#FFD700] rounded-full group-hover:bg-[#FFD700] transition-colors"></div>
                  <span className="text-sm text-[#FFD700] font-mono mb-1 block">{item.year}</span>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Active Ideas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#FFD700] rounded-full"></span>
                الأفكار النشطة
              </h2>
              <button className="flex items-center gap-2 text-sm bg-[#FFD700]/10 text-[#FFD700] px-3 py-1.5 rounded-lg hover:bg-[#FFD700]/20 transition-colors border border-[#FFD700]/20">
                <Plus size={16} /> إضافة فكرة
              </button>
            </div>
            <div className="grid gap-4">
              {activeIdeas.map((idea, idx) => (
                <div key={idx} className="bg-black/20 border border-white/5 rounded-xl p-5 hover:border-[#FFD700]/30 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-[#FFD700] transition-colors">{idea.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${idea.statusColor} mt-1 inline-block`}>{idea.status}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">نسبة النجاح</div>
                      <div className="text-[#FFD700] font-bold font-mono">{idea.successRate}%</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{idea.desc}</p>
                  <div className="flex gap-2">
                    {idea.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded-md border border-white/5">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Founder Score */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6 text-center"
          >
            <h3 className="text-lg font-bold text-white mb-2">معيار الجاذبية (Founder Score)</h3>
            <p className="text-xs text-gray-500 mb-6">يتم حسابه بواسطة RAED AI بناءً على جودة الأفكار والسجل السابق.</p>
            
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="70%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {gaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={gaugeColors[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 top-10 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold text-white">{founderScore}</span>
                <span className="text-sm text-[#FFD700]">ممتاز</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="block text-xs text-gray-500">الاستجابة</span>
                <span className="text-sm font-bold text-white">98%</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="block text-xs text-gray-500">الجودة</span>
                <span className="text-sm font-bold text-white">A+</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="block text-xs text-gray-500">الموثوقية</span>
                <span className="text-sm font-bold text-white">High</span>
              </div>
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">مجالات الاهتمام</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((tag, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-white/5 hover:bg-[#FFD700]/10 hover:text-[#FFD700] hover:border-[#FFD700]/30 border border-white/10 rounded-lg text-sm text-gray-300 transition-all cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
