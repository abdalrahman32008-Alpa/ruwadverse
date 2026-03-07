import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MapPin, DollarSign, TrendingUp, Users, ArrowUpRight, SlidersHorizontal, X } from 'lucide-react';
import { CardSkeleton } from './Skeleton';

// --- مكون سوق الأفكار ---
// يتيح للمستخدمين تصفح الأفكار والمشاريع الناشئة مع إمكانية الفلترة والبحث
export const Marketplace = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeSector, setActiveSector] = useState('All');
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<any[]>([]);

  // بيانات الأفكار (وهمية)
  const mockIdeas = [
    {
      id: 2847,
      sector: 'Education',
      title: 'فكرة #2847 — قطاع التعليم',
      desc: 'منصة تعليمية تفاعلية تستخدم الواقع المعزز لتبسيط مفاهيم العلوم والرياضيات للمرحلة الابتدائية.',
      successRate: 85,
      funding: '$50K',
      applicants: 12,
      tags: ['Developer', 'Designer'],
      country: 'Saudi Arabia'
    },
    {
      id: 2848,
      sector: 'FinTech',
      title: 'فكرة #2848 — التقنية المالية',
      desc: 'نظام مدفوعات ذكي للمتاجر الصغيرة يتيح التحليل المالي الفوري وإدارة المخزون.',
      successRate: 92,
      funding: '$100K',
      applicants: 8,
      tags: ['Backend', 'Security'],
      country: 'UAE'
    },
    {
      id: 2849,
      sector: 'HealthTech',
      title: 'فكرة #2849 — الصحة',
      desc: 'تطبيق لمتابعة الحالة الصحية للمرضى المزمنين وربطهم بالأطباء عن بعد.',
      successRate: 78,
      funding: '$25K',
      applicants: 5,
      tags: ['Mobile Dev', 'Doctor'],
      country: 'Egypt'
    },
    {
      id: 2850,
      sector: 'E-commerce',
      title: 'فكرة #2850 — التجارة',
      desc: 'سوق إلكتروني للمنتجات الحرفية اليدوية مع دعم لوجستي متكامل.',
      successRate: 65,
      funding: '$10K',
      applicants: 20,
      tags: ['Marketing', 'Sales'],
      country: 'Morocco'
    },
    {
      id: 2851,
      sector: 'PropTech',
      title: 'فكرة #2851 — العقارات',
      desc: 'منصة لإدارة العقارات وتأجيرها بشكل آلي مع عقود ذكية.',
      successRate: 88,
      funding: '$75K',
      applicants: 15,
      tags: ['Blockchain', 'Legal'],
      country: 'Saudi Arabia'
    }
  ];

  useEffect(() => {
    // Simulate fetching
    const timer = setTimeout(() => {
      setIdeas(mockIdeas);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const sectors = ['All', 'Education', 'FinTech', 'HealthTech', 'E-commerce', 'PropTech'];

  const filteredIdeas = activeSector === 'All' ? ideas : ideas.filter(idea => idea.sector === activeSector);

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">سوق الأفكار</h1>
            <p className="text-gray-400">اكتشف المشاريع الناشئة الواعدة وكن جزءاً من نجاحها.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#141517] px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[#FFD700] font-bold font-mono">{loading ? '...' : ideas.length}</span>
              <span className="text-sm text-gray-400">فكرة نشطة الآن</span>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mt-8 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setActiveSector(sector)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  activeSector === sector 
                    ? 'bg-[#FFD700] text-black font-bold' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {sector === 'All' ? 'كل القطاعات' : sector}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="بحث عن فكرة..." 
                className="w-full bg-[#141517] border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-[#FFD700]/50 transition-colors"
              />
            </div>
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className={`p-2 rounded-xl border transition-colors ${filterOpen ? 'bg-[#FFD700] border-[#FFD700] text-black' : 'bg-[#141517] border-white/10 text-gray-400 hover:text-white'}`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#141517] border border-white/5 rounded-2xl p-6 mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">نسبة النجاح</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white">
                      <input type="checkbox" className="rounded border-gray-600 bg-black/20 text-[#FFD700] focus:ring-[#FFD700]" />
                      <span>أكثر من 90%</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white">
                      <input type="checkbox" className="rounded border-gray-600 bg-black/20 text-[#FFD700] focus:ring-[#FFD700]" />
                      <span>80% - 89%</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">التمويل المطلوب</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white">
                      <input type="checkbox" className="rounded border-gray-600 bg-black/20 text-[#FFD700] focus:ring-[#FFD700]" />
                      <span>أقل من $10K</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white">
                      <input type="checkbox" className="rounded border-gray-600 bg-black/20 text-[#FFD700] focus:ring-[#FFD700]" />
                      <span>$10K - $50K</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">الدولة</h3>
                  <select className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#FFD700]/50">
                    <option>كل الدول</option>
                    <option>السعودية</option>
                    <option>الإمارات</option>
                    <option>مصر</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors border border-white/5">
                    إعادة تعيين
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))
          ) : (
            <AnimatePresence>
              {filteredIdeas.map((idea) => (
                <motion.div
                  key={idea.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#141517] border border-white/5 rounded-2xl p-6 hover:border-[#FFD700]/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#FFD700] group-hover:bg-[#FFD700]/10 transition-colors">
                        <TrendingUp size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{idea.title}</h3>
                        <span className="text-xs text-gray-500">{idea.country}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-bold ${
                      idea.successRate >= 80 ? 'bg-green-500/10 text-green-400' : 
                      idea.successRate >= 60 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {idea.successRate}% نجاح
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {idea.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {idea.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-xs text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">التمويل المطلوب</span>
                      <span className="text-[#FFD700] font-mono font-bold">{idea.funding}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">المتقدمين</span>
                      <span className="text-white font-mono font-bold flex items-center gap-1">
                        <Users size={12} /> {idea.applicants}
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-[#FFD700] text-black rounded-xl font-bold hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2">
                    <span>أنا مهتم</span>
                    <ArrowUpRight size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};
