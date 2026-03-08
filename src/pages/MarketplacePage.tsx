import React, { useState, useEffect } from 'react';
import { Search, Filter, X, DollarSign, TrendingUp, Users, Calendar, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

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

const SECTORS = ['All', 'EdTech', 'FinTech', 'Logistics', 'HealthTech', 'E-commerce'];

export const MarketplacePage = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select(`
            *,
            owner:owner_id (name, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // Fetch investments to calculate raised amount
          const { data: investments } = await supabase.from('investments').select('idea_id, amount');
          
          const mappedItems: MarketplaceItem[] = data.map((idea: any) => {
            const ideaInvestments = investments?.filter((inv: any) => inv.idea_id === idea.id) || [];
            const raised = ideaInvestments.reduce((sum: number, inv: any) => sum + (Number(inv.amount) || 0), 0);
            
            return {
              id: idea.id,
              title: idea.title,
              description: idea.description,
              sector: idea.sector || 'General', // Use sector from DB
              stage: idea.status || 'Idea', // Use status from DB
              funding_goal: Number(idea.funding_needed) || 0,
              raised_amount: raised,
              raed_score: 0, // No score system yet
              equity: 0, // No equity data yet
              author: {
                name: idea.owner?.name || 'مستخدم',
                avatar: idea.owner?.avatar_url || ''
              },
              tags: [idea.sector || 'Startup']
            };
          });
          setItems(mappedItems);
        }
      } catch (error) {
        console.error('Error fetching marketplace items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'All' || item.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6 relative">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-[-200px] w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-[-200px] w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <h1 className="text-2xl font-bold">سوق الأفكار</h1>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن مشاريع..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141517] border border-white/10 rounded-xl py-2 pr-10 pl-4 focus:outline-none focus:border-[#FFD700] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#141517] border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors">
            <Filter size={20} />
            <span className="hidden md:inline">فلاتر</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {SECTORS.map(sector => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton-card h-80" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-[#141517] rounded-3xl border border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
          <p className="text-gray-400">لم نتمكن من العثور على مشاريع تطابق بحثك.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div 
              key={item.id}
              layoutId={item.id}
              onClick={() => setSelectedItem(item)}
              className="group p-6 rounded-3xl bg-[#141517] border border-white/10 hover:border-[#FFD700]/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-[#FFD700]/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-300">
                  {item.sector}
                </div>
                <div className="flex items-center gap-1 text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded-lg">
                  <TrendingUp size={14} />
                  <span className="text-xs font-bold">{item.raed_score}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-[#FFD700] transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">التمويل المطلوب</span>
                  <span className="font-mono font-bold">${item.funding_goal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FFD700] h-full rounded-full" 
                    style={{ width: `${(item.raised_amount / item.funding_goal) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>تم جمع ${item.raised_amount.toLocaleString()}</span>
                  <span>{Math.round((item.raised_amount / item.funding_goal) * 100)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <img src={item.author.avatar} alt={item.author.name} className="w-6 h-6 rounded-full" />
                  <span className="text-xs text-gray-400">{item.author.name}</span>
                </div>
                <button className="text-[#FFD700] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  التفاصيل <ArrowUpRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
                      <span className="font-bold">${selectedItem.funding_goal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">تم جمع</span>
                      <span className="font-bold text-[#FFD700]">${selectedItem.raised_amount.toLocaleString()}</span>
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
                  <button className="flex-1 bg-[#FFD700] text-black py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors">
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
