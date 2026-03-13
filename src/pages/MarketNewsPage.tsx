import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, AlertTriangle, Newspaper, LineChart, Globe, Activity, Clock, Bell, Loader2 } from 'lucide-react';
import { fetchRealMarketNews } from '../services/raed';

export const MarketNewsPage = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'predictions'>('news');
  const [marketFilter, setMarketFilter] = useState<'egypt' | 'arab' | 'global'>('egypt');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchRealMarketNews(marketFilter);
      if (data) {
        setNews(data.news || []);
        setPredictions(data.predictions || []);
      } else {
        // Fallback if API fails
        setNews([]);
        setPredictions([]);
      }
      setLoading(false);
    };
    loadData();
  }, [marketFilter]);

  const sectors = [
    { id: 'all', name: 'الكل' },
    { id: 'fintech', name: 'تقنية مالية' },
    { id: 'ai', name: 'ذكاء اصطناعي' },
    { id: 'health', name: 'صحة رقمية' },
    { id: 'logistics', name: 'لوجستيات' },
    { id: 'ecommerce', name: 'تجارة إلكترونية' }
  ];

  const filteredNews = sectorFilter === 'all' ? news : news.filter(item => item.sector === sectorFilter);
  const filteredPredictions = sectorFilter === 'all' ? predictions : predictions.filter(item => item.tag === sectorFilter);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Activity className="text-[#FFD700]" />
            أخبار السوق
          </h1>
          <p className="text-gray-400">أحدث الأخبار والتنبؤات الاقتصادية الموثوقة لرواد الأعمال.</p>
        </div>
        
        <div className="flex flex-col gap-3 items-end">
          <div className="flex bg-[#141517] p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setMarketFilter('egypt')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${marketFilter === 'egypt' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              السوق المصري
            </button>
            <button 
              onClick={() => setMarketFilter('arab')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1 ${marketFilter === 'arab' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              السوق العربي <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-500 font-medium">قيد التطوير</span>
            </button>
            <button 
              onClick={() => setMarketFilter('global')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1 ${marketFilter === 'global' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              السوق العالمي <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-500 font-medium">قيد التطوير</span>
            </button>
          </div>
          <button className="flex items-center gap-2 text-xs text-[#FFD700] hover:underline">
            <Bell size={14} />
            تفعيل تنبيهات الأخبار العاجلة لقطاعاتي
          </button>
        </div>
      </div>

      {/* Sector Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
        {sectors.map(s => (
          <button
            key={s.id}
            onClick={() => setSectorFilter(s.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              sectorFilter === s.id 
                ? 'bg-[#FFD700] border-[#FFD700] text-black' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin mb-4" />
          <p className="text-gray-400">جاري جلب أحدث الأخبار والتحليلات من السوق...</p>
        </div>
      ) : (
        <>
          <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
        <button 
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'news' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <Newspaper size={18} />
          الأخبار العاجلة
        </button>
        <button 
          onClick={() => setActiveTab('predictions')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'predictions' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <LineChart size={18} />
          تحليلات وتوقعات الخبراء
        </button>
      </div>

      {activeTab === 'news' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured News - Only show if no sector filter or matches sector */}
          {(sectorFilter === 'all' || sectorFilter === 'ai') && (
            <div className="md:col-span-2 lg:col-span-2 linear-card rounded-2xl border border-white/10 overflow-hidden group cursor-pointer">
              <div className="aspect-video relative overflow-hidden">
                <img src={`https://picsum.photos/seed/news/1200/600`} alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">تغطية خاصة</span>
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors">مستقبل الذكاء الاصطناعي في ريادة الأعمال العربية: رؤية 2030</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1"><Clock size={14} /> منذ ساعة</span>
                    <span className="flex items-center gap-1"><Globe size={14} /> ذكاء اصطناعي</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* News List */}
          <div className={`${sectorFilter !== 'all' && sectorFilter !== 'ai' ? 'md:col-span-3 lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}`}>
            {filteredNews.length > 0 ? filteredNews.map((item) => (
              <div key={item.id} className="bg-[#141517] p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-[#FFD700] border border-[#FFD700]/20 bg-[#FFD700]/10 px-2 py-0.5 rounded">{item.category}</span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <h3 className="font-bold text-sm mb-2 group-hover:text-white text-gray-200 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-500">المصدر: {item.source}</p>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-gray-500">لا توجد أخبار حالياً لهذا القطاع</div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'predictions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-8 flex items-start gap-3">
            <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-yellow-500 mb-1">تنويه هام</h4>
              <p className="text-sm text-yellow-500/80 leading-relaxed">
                هذه التنبؤات مبنية على تحليلات وآراء خبراء حقيقيين في السوق، وهي تمثل وجهات نظرهم المهنية. الأسواق متقلبة، ويُنصح دائماً بالاستشارة المالية المتخصصة.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredPredictions.length > 0 ? filteredPredictions.map((pred) => (
              <div key={pred.id} className="linear-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 ${pred.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <span className="text-xs text-gray-400 mb-1 block">القطاع</span>
                    <h3 className="text-xl font-bold">{pred.sector}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${pred.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {pred.trend === 'up' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  </div>
                </div>

                <div className="bg-[#141517] p-4 rounded-xl border border-white/5 mb-4 relative z-10">
                  <p className="text-sm text-gray-300 leading-relaxed italic">"{pred.analysis}"</p>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 text-[#FFD700] flex items-center justify-center text-[10px] font-bold">
                      {pred.expert.split(' ')[1][0]}
                    </div>
                    <span className="text-xs text-[#FFD700] font-bold">{pred.expert}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs relative z-10">
                  <span className="text-gray-400">مستوى الثقة في التوقع:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${pred.confidence >= 80 ? 'bg-green-500' : pred.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${pred.confidence}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold">{pred.confidence}%</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-gray-500">لا توجد تحليلات متاحة لهذا القطاع حالياً</div>
            )}
          </div>
        </motion.div>
      )}
      </>
      )}
    </div>
  );
};
