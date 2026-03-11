import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MapPin, DollarSign, TrendingUp, Users, ArrowUpRight, SlidersHorizontal, X } from 'lucide-react';
import { CardSkeleton } from './Skeleton';

import { supabase } from '../lib/supabase';
import { sendNotification } from '../lib/notifications';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// --- مكون سوق الأفكار ---
// يتيح للمستخدمين تصفح الأفكار والمشاريع الناشئة مع إمكانية الفلترة والبحث
export const Marketplace = () => {
  const { user } = useAuth();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeSector, setActiveSector] = useState('All');
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<any[]>([]);
  
  // Infinite scroll states
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 6;
  const observerTarget = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [fundingFilter, setFundingFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState('كل الدول');

  const fetchIdeas = async (pageNumber: number, sector: string, search: string, funding: string | null, location: string) => {
    try {
      if (pageNumber === 0) setLoading(true);
      else setLoadingMore(true);

      let query = supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageNumber * ITEMS_PER_PAGE, (pageNumber + 1) * ITEMS_PER_PAGE - 1);

      if (sector !== 'All') {
        query = query.eq('sector', sector);
      }

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      if (location !== 'كل الدول') {
        query = query.eq('location', location);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        let filteredData = data;
        if (funding) {
          if (funding === 'low') filteredData = data.filter(i => parseInt(i.funding_needed || '0') < 10000);
          if (funding === 'mid') filteredData = data.filter(i => parseInt(i.funding_needed || '0') >= 10000 && parseInt(i.funding_needed || '0') <= 50000);
        }

        if (data.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (pageNumber === 0) {
          setIdeas(filteredData);
        } else {
          setIdeas(prev => [...prev, ...filteredData]);
        }
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchIdeas(0, activeSector, searchQuery, fundingFilter, locationFilter);
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [activeSector, searchQuery, fundingFilter, locationFilter]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchIdeas(nextPage, activeSector, searchQuery, fundingFilter, locationFilter);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && !loadingMore && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, loading, loadingMore, hasMore, ideas.length]);

  const sectors = ['All', 'Education', 'FinTech', 'HealthTech', 'E-commerce', 'PropTech'];

  const filteredIdeas = ideas; // Filtering is handled by Supabase query now

  const handleInterest = async (idea: any) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    if (user.id === idea.user_id) {
      toast.error('لا يمكنك إبداء الاهتمام بفكرتك الخاصة');
      return;
    }

    const success = await sendNotification(
      idea.user_id,
      'اهتمام جديد بفكرتك!',
      `أبدى مستخدم اهتماماً بمشروعك: ${idea.title}. يمكنك التواصل معه الآن.`,
      'interest'
    );

    if (success) {
      toast.success('تم إرسال اهتمامك لصاحب الفكرة');
    } else {
      toast.error('فشل إرسال الاهتمام');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 relative overflow-hidden">
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

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <h3 className="text-sm font-bold text-white mb-3">التمويل المطلوب</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white">
                      <input 
                        type="radio" 
                        name="funding"
                        checked={fundingFilter === 'low'}
                        onChange={() => setFundingFilter('low')}
                        className="rounded border-gray-600 bg-black/20 text-[#FFD700] focus:ring-[#FFD700]" 
                      />
                      <span>أقل من $10K</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white">
                      <input 
                        type="radio" 
                        name="funding"
                        checked={fundingFilter === 'mid'}
                        onChange={() => setFundingFilter('mid')}
                        className="rounded border-gray-600 bg-black/20 text-[#FFD700] focus:ring-[#FFD700]" 
                      />
                      <span>$10K - $50K</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">الدولة</h3>
                  <select 
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#FFD700]/50"
                  >
                    <option>كل الدول</option>
                    <option>السعودية</option>
                    <option>الإمارات</option>
                    <option>مصر</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => {
                      setFundingFilter(null);
                      setLocationFilter('كل الدول');
                      setSearchQuery('');
                      setActiveSector('All');
                    }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors border border-white/5"
                  >
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
          ) : ideas.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-[#141517] rounded-3xl border border-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={40} className="text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">لا توجد أفكار بعد</h3>
              <p className="text-gray-400">لم يتم إضافة أي أفكار في هذا القطاع حتى الآن.</p>
            </div>
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
                        <span className="text-xs text-gray-500">{idea.location || 'السعودية'}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-bold bg-green-500/10 text-green-400`}>
                      جديد
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {idea.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-xs text-gray-300">
                      {idea.sector || 'عام'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">التمويل المطلوب</span>
                      <span className="text-[#FFD700] font-mono font-bold">{idea.funding_needed ? `$${idea.funding_needed}` : 'غير محدد'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">المتقدمين</span>
                      <span className="text-white font-mono font-bold flex items-center gap-1">
                        <Users size={12} /> 0
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleInterest(idea)}
                    className="w-full py-2.5 bg-[#FFD700] text-black rounded-xl font-bold hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>أنا مهتم</span>
                    <ArrowUpRight size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        
        {/* Infinite Scroll Observer Target */}
        {!loading && hasMore && (
          <div ref={observerTarget} className="w-full py-12 flex justify-center">
            {loadingMore && (
              <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        )}
        
        {!hasMore && ideas.length > 0 && (
          <div className="w-full py-12 flex justify-center text-gray-500 text-sm">
            لا توجد المزيد من الأفكار
          </div>
        )}
      </div>
    </div>
  );
};
