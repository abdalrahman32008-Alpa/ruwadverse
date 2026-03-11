import React from 'react';
import { motion } from 'motion/react';
import { MapPin, TrendingUp, DollarSign, Globe, Shield, Activity, Briefcase, ExternalLink, CheckCircle } from 'lucide-react';

// --- مكون ملف المستثمر ---
// يعرض هذا المكون الملف الشخصي للمستثمر، بما في ذلك محفظته الاستثمارية ومعايير الاستثمار
export const InvestorProfile = () => {
  // بيانات المحفظة الاستثمارية
  const portfolio = [
    { name: 'FinTech Solutions', sector: 'FinTech', date: '2022', status: 'Active', roi: '+15%' },
    { name: 'HealthAI', sector: 'HealthTech', date: '2021', status: 'Exit', roi: '3.5x' },
    { name: 'EduLearn', sector: 'EdTech', date: '2023', status: 'Active', roi: '+8%' },
  ];

  const criteria = {
    sectors: ['FinTech', 'SaaS', 'AI', 'HealthTech'],
    stage: ['Pre-Seed', 'Seed'],
    countries: ['Saudi Arabia', 'UAE', 'Egypt'],
    ticketSize: '$10K - $50K'
  };

  const activityLog = [
    { action: 'أبدى اهتماماً بفكرة في قطاع التعليم', time: 'منذ ساعتين' },
    { action: 'استثمر في جولة Seed لشركة لوجستيات', time: 'منذ يومين' },
    { action: 'حدث معايير الاستثمار الخاصة به', time: 'منذ أسبوع' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pb-20 pt-20">
      {/* Header Section */}
      <div className="relative mb-12">
        <div className="h-48 w-full bg-gradient-to-r from-[#064e3b] to-[#0B0C0E] border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="relative">
              <img 
                src="https://ui-avatars.com/api/?name=Investor&background=141517&color=FFD700" 
                alt="Investor" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-[#0B0C0E] shadow-2xl object-cover"
              />
              <div className="absolute -bottom-3 -right-3 bg-[#FFD700] text-black p-1.5 rounded-full border-4 border-[#0B0C0E]" title="Verified Investor">
                <Shield size={20} fill="currentColor" className="text-white" stroke="black" />
              </div>
            </div>
            
            <div className="mb-2 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                    خالد العمري
                    <span className="px-2 py-0.5 bg-[#FFD700]/10 text-[#FFD700] text-xs rounded-full border border-[#FFD700]/20 font-normal">Verified Investor</span>
                  </h1>
                  <p className="text-gray-400 text-lg">مستثمر ملائكي | مهتم بالتقنية المالية والذكاء الاصطناعي</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="block text-2xl font-bold text-white">12</span>
                    <span className="text-xs text-gray-500">استثمارات</span>
                  </div>
                  <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="block text-2xl font-bold text-[#FFD700]">$2M+</span>
                    <span className="text-xs text-gray-500">حجم المحفظة</span>
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
          
          {/* Investment Criteria */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#FFD700] rounded-full"></span>
              معايير الاستثمار
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2"><Briefcase size={14} /> القطاعات المفضلة</h3>
                <div className="flex flex-wrap gap-2">
                  {criteria.sectors.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/5 rounded-md text-sm text-gray-300 border border-white/10">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2"><TrendingUp size={14} /> المرحلة</h3>
                <div className="flex flex-wrap gap-2">
                  {criteria.stage.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/5 rounded-md text-sm text-gray-300 border border-white/10">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2"><Globe size={14} /> الدول المستهدفة</h3>
                <div className="flex flex-wrap gap-2">
                  {criteria.countries.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/5 rounded-md text-sm text-gray-300 border border-white/10">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2"><DollarSign size={14} /> حجم الاستثمار (Ticket Size)</h3>
                <span className="text-[#FFD700] font-bold font-mono text-lg">{criteria.ticketSize}</span>
              </div>
            </div>
          </motion.div>

          {/* Portfolio */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#FFD700] rounded-full"></span>
              محفظة الاستثمارات
            </h2>
            <div className="grid gap-4">
              {portfolio.map((item, idx) => (
                <div key={idx} className="bg-black/20 border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-[#FFD700]/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-xl font-bold text-gray-500 group-hover:text-[#FFD700] group-hover:bg-[#FFD700]/10 transition-colors">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{item.name}</h3>
                      <span className="text-xs text-gray-500">{item.sector} • {item.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${item.status === 'Exit' ? 'text-green-400' : 'text-blue-400'}`}>{item.status}</div>
                    <div className="text-xs text-[#FFD700] font-mono">{item.roi} ROI</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Investor Score */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6 text-center"
          >
            <h3 className="text-lg font-bold text-white mb-2">Investor Score</h3>
            <div className="relative w-40 h-40 mx-auto my-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#FFD700] border-t-transparent animate-spin-slow" style={{ animationDuration: '3s' }}></div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white">94</span>
                <span className="text-xs text-[#FFD700] uppercase tracking-wider">Trusted</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-400 text-right">
              <div className="flex justify-between">
                <span>التحقق من الهوية</span>
                <CheckCircle size={16} className="text-green-500" />
              </div>
              <div className="flex justify-between">
                <span>عدد الاستثمارات</span>
                <span className="text-white">12+</span>
              </div>
              <div className="flex justify-between">
                <span>تقييمات الشركاء</span>
                <span className="text-[#FFD700]">4.9/5</span>
              </div>
            </div>
          </motion.div>

          {/* Activity Log */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141517] border border-white/5 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={18} className="text-[#FFD700]" />
              سجل النشاط
            </h3>
            <div className="space-y-6 relative before:absolute before:right-2 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {activityLog.map((log, idx) => (
                <div key={idx} className="relative pr-6">
                  <div className="absolute right-0 top-1.5 w-4 h-px bg-[#FFD700]"></div>
                  <p className="text-sm text-gray-300 mb-1">{log.action}</p>
                  <span className="text-xs text-gray-500">{log.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
