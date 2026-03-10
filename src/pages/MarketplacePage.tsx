import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, X, DollarSign, TrendingUp, Users, Calendar, ArrowUpRight, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSEO } from '../hooks/useSEO';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  sector: string;
  stage: string;
  funding_goal: number;
  raised_amount: number;
  raed_score: number;
  equity: number;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
}

const SECTORS = ['الكل', 'التقنية التعليمية', 'التقنية المالية', 'الخدمات اللوجستية', 'التقنية الصحية', 'التجارة الإلكترونية'];

export const MarketplacePage = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 6;
  const observer = useRef<IntersectionObserver | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('الكل');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isMatchmakerActive, setIsMatchmakerActive] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const { user } = useAuth();

  useSEO('سوق الأفكار', 'اكتشف أفضل الفرص الاستثمارية والشركات الناشئة في العالم العربي.');

  const fetchItems = async (pageNumber: number, isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let query = supabase
        .from('ideas')
        .select(`
          *,
          owner:user_id (full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .range(pageNumber * ITEMS_PER_PAGE, (pageNumber + 1) * ITEMS_PER_PAGE - 1);

      if (selectedSector !== 'الكل') {
        query = query.eq('sector', selectedSector);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        if (data.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        const { data: investments } = await supabase.from('investments').select('idea_id, amount');
        const mappedItems: MarketplaceItem[] = data.map((idea: any) => {
          const ideaInvestments = investments?.filter((inv: any) => inv.idea_id === idea.id) || [];
          const raised = ideaInvestments.reduce((sum: number, inv: any) => sum + (Number(inv.amount) || 0), 0);
          
          const raedScore = idea.raed_score || 0;
          const matchPercentage = isMatchmakerActive ? (idea.raed_score ? Math.min(idea.raed_score + 10, 99) : 0) : 0;

          return {
            id: idea.id,
            title: idea.title,
            description: idea.description,
            sector: idea.sector || 'عام',
            stage: idea.status || 'فكرة',
            funding_goal: Number(idea.funding_needed) || 0,
            raised_amount: raised,
            raed_score: raedScore,
            equity: Number(idea.equity_offered) || 0,
            author: {
              name: idea.owner?.full_name || 'مجهول',
              avatar: idea.owner?.avatar_url || ''
            },
            tags: [idea.sector || 'شركة ناشئة'],
            matchPercentage
          };
        });

        if (isNewSearch) {
          setItems(mappedItems);
        } else {
          setItems(prev => [...prev, ...mappedItems]);
        }
      }
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchItems(0, true);
  }, [selectedSector, searchQuery, isMatchmakerActive]);

  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchItems(nextPage, false);
          return nextPage;
        });
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, selectedSector, searchQuery, isMatchmakerActive]);

  const handleMatchmakerToggle = () => {
    setIsMatchmakerActive(!isMatchmakerActive);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative min-h-screen">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-[-200px] w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />

      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24 h-fit">
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Filter size={18} className="text-[#FFD700]" />
            الفلاتر
          </h3>
          <div className="space-y-2">
            {SECTORS.map(sector => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`w-full text-right px-4 py-2 rounded-xl text-sm transition-all ${
                  selectedSector === sector 
                    ? 'bg-[#FFD700] text-black font-bold shadow-lg shadow-[#FFD700]/10' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-[#FFD700]/20 rounded-2xl">
          <div className="flex items-center gap-2 text-[#FFD700] mb-2">
            <Sparkles size={18} />
            <span className="font-bold">RAED Matchmaker</span>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            دع الذكاء الاصطناعي يجد لك المشاريع التي تناسب اهتماماتك ومحفظتك الاستثمارية.
          </p>
          <button 
            onClick={handleMatchmakerToggle}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
              isMatchmakerActive 
                ? 'bg-[#FFD700] text-black' 
                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            {isMatchmakerActive ? 'إيقاف المساعد' : 'تفعيل المساعد'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">سوق الأفكار</h1>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن مشاريع..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141517] border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-[#FFD700] transition-colors"
              />
            </div>
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#141517] border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Categories (Horizontal Scroll) */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {SECTORS.map(sector => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSector === sector 
                  ? 'bg-[#FFD700] text-black' 
                  : 'bg-[#141517] text-gray-400 hover:bg-white/5'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-card h-64" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-[#141517] rounded-3xl border border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-bold mb-1">لا توجد نتائج</h3>
            <p className="text-sm text-gray-400">لم نتمكن من العثور على مشاريع تطابق بحثك.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, index) => {
              const isLastItem = index === items.length - 1;
              return (
                <motion.div 
                  ref={isLastItem ? lastItemRef : null}
                  key={item.id}
                  layoutId={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group p-5 rounded-2xl bg-[#141517] border transition-all cursor-pointer hover:shadow-xl ${
                    isMatchmakerActive && (item as any).matchPercentage > 80 
                      ? 'border-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.1)]' 
                      : 'border-white/10 hover:border-[#FFD700]/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-gray-400 uppercase tracking-wider">
                        {item.sector}
                      </div>
                      <div className="bg-[#FFD700]/10 px-2 py-0.5 rounded text-[10px] text-[#FFD700] font-bold">
                        {item.stage}
                      </div>
                    </div>
                    {isMatchmakerActive && (
                      <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold">
                        <Sparkles size={12} />
                        {(item as any).matchPercentage}%
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-1 group-hover:text-[#FFD700] transition-colors line-clamp-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-500">التمويل المطلوب</span>
                      <span className="font-bold">{item.funding_goal.toLocaleString()} ج.م</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#FFD700] h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min((item.raised_amount / item.funding_goal) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <img src={item.author.avatar} alt={item.author.name} className="w-5 h-5 rounded-full border border-white/10" />
                      <span className="text-[10px] text-gray-400">{item.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#FFD700] text-[10px] font-bold">
                      <TrendingUp size={12} />
                      {item.raed_score}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {loadingMore && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-[#FFD700]" size={24} />
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-80 bg-[#0B0C0E] z-[70] lg:hidden p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">الفلاتر</h2>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">القطاع</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SECTORS.map(sector => (
                      <button
                        key={sector}
                        onClick={() => { setSelectedSector(sector); setIsFilterDrawerOpen(false); }}
                        className={`px-4 py-2 rounded-xl text-xs transition-all ${
                          selectedSector === sector 
                            ? 'bg-[#FFD700] text-black font-bold' 
                            : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-2xl">
                  <div className="flex items-center gap-2 text-[#FFD700] mb-2">
                    <Sparkles size={18} />
                    <span className="font-bold">RAED Matchmaker</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">تفعيل المساعد الذكي لاقتراح مشاريع مخصصة لك.</p>
                  <button 
                    onClick={() => { handleMatchmakerToggle(); setIsFilterDrawerOpen(false); }}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                      isMatchmakerActive ? 'bg-[#FFD700] text-black' : 'bg-white/10 text-white'
                    }`}
                  >
                    {isMatchmakerActive ? 'إيقاف المساعد' : 'تفعيل المساعد'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              layoutId={selectedItem.id}
              className="bg-[#1C1D20] w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-48 bg-gradient-to-br from-gray-800 to-black">
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
                  className="absolute top-4 left-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 right-6">
                  <h2 className="text-3xl font-bold mb-2">{selectedItem.title}</h2>
                  <div className="flex gap-2">
                    {selectedItem.tags.map(tag => (
                      <span key={tag} className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <div className="flex gap-8 border-b border-white/10 pb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FFD700]">{selectedItem.raed_score}</div>
                    <div className="text-xs text-gray-400">تحليل RAED</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedItem.equity}%</div>
                    <div className="text-xs text-gray-400">حصة معروضة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedItem.stage}</div>
                    <div className="text-xs text-gray-400">المرحلة</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">عن المشروع</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <DollarSign className="text-[#FFD700]" size={20} />
                    جولة التمويل
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">الهدف</span>
                      <span className="font-bold">{selectedItem.funding_goal.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">تم جمع</span>
                      <span className="font-bold text-[#FFD700]">{selectedItem.raised_amount.toLocaleString()} ج.م</span>
                    </div>
                    <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#FFD700] h-full rounded-full" 
                        style={{ width: `${(selectedItem.raised_amount / selectedItem.funding_goal) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-[#FFD700] text-black py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-all shadow-lg shadow-[#FFD700]/10">
                    استثمر الآن
                  </button>
                  <button className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-colors border border-white/10">
                    تواصل مع المؤسس
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
