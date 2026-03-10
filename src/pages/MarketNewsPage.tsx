import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, AlertTriangle, Newspaper, LineChart, Globe, Activity, Clock } from 'lucide-react';

export const MarketNewsPage = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'predictions'>('news');
  const [marketFilter, setMarketFilter] = useState<'egypt' | 'arab' | 'global'>('egypt');

  const news = [
    { id: 1, title: 'نمو قطاع التكنولوجيا المالية في مصر بنسبة 40% خلال الربع الأخير', category: 'تكنولوجيا مالية', time: 'منذ ساعتين', source: 'الاقتصادية' },
    { id: 2, title: 'استثمارات جديدة بقيمة 50 مليون دولار في قطاع الصحة الرقمية', category: 'صحة', time: 'منذ 5 ساعات', source: 'رويترز' },
    { id: 3, title: 'تحديثات جديدة في قوانين الشركات الناشئة لتسهيل الإجراءات', category: 'قوانين', time: 'منذ يوم', source: 'المال' },
    { id: 4, title: 'إطلاق صندوق استثماري جديد لدعم مشاريع الذكاء الاصطناعي', category: 'استثمار', time: 'منذ يومين', source: 'فوربس' },
  ];

  const predictions = [
    { 
      id: 1, 
      sector: 'العقارات والتكنولوجيا (PropTech)', 
      trend: 'up', 
      expert: 'د. أحمد محمود - خبير اقتصادي',
      analysis: 'من المتوقع أن يشهد قطاع التكنولوجيا العقارية طفرة كبيرة في السوق المصري خلال العامين القادمين، مدفوعاً بالتوجه نحو المدن الذكية وتسهيل عمليات التمويل العقاري الرقمي.',
      confidence: 85
    },
    { 
      id: 2, 
      sector: 'التجارة الإلكترونية التقليدية', 
      trend: 'down', 
      expert: 'م. سارة علي - محللة أسواق',
      analysis: 'قد تواجه منصات التجارة الإلكترونية التقليدية غير المتخصصة تحديات في النمو بسبب تشبع السوق والمنافسة الشرسة من الشركات العالمية، البقاء سيكون للمنصات المتخصصة (Niche).',
      confidence: 70
    },
    { 
      id: 3, 
      sector: 'الطاقة المتجددة', 
      trend: 'up', 
      expert: 'م. خالد حسن - مستشار طاقة',
      analysis: 'فرص هائلة للشركات الناشئة التي تقدم حلولاً مبتكرة في مجال الطاقة الشمسية وإدارة استهلاك الطاقة للمصانع والشركات.',
      confidence: 90
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Activity className="text-[#FFD700]" />
            نبض السوق
          </h1>
          <p className="text-gray-400">أحدث الأخبار والتنبؤات الاقتصادية للأسواق.</p>
        </div>
        
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
            السوق العربي <span className="text-[10px] bg-white/20 px-1.5 rounded text-white">قريباً</span>
          </button>
          <button 
            onClick={() => setMarketFilter('global')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1 ${marketFilter === 'global' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            السوق العالمي <span className="text-[10px] bg-white/20 px-1.5 rounded text-white">قريباً</span>
          </button>
        </div>
      </div>

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
          تنبؤات وتحليلات الخبراء
        </button>
      </div>

      {activeTab === 'news' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured News */}
          <div className="md:col-span-2 lg:col-span-2 linear-card rounded-2xl border border-white/10 overflow-hidden group cursor-pointer">
            <div className="aspect-video relative overflow-hidden">
              <img src="https://picsum.photos/seed/marketnews/800/400" alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">تغطية خاصة</span>
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors">تحولات كبرى في بيئة ريادة الأعمال المصرية خلال 2026</h2>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1"><Clock size={14} /> منذ ساعة</span>
                  <span className="flex items-center gap-1"><Globe size={14} /> ريادة الأعمال</span>
                </div>
              </div>
            </div>
          </div>

          {/* News List */}
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="bg-[#141517] p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-[#FFD700] border border-[#FFD700]/20 bg-[#FFD700]/10 px-2 py-0.5 rounded">{item.category}</span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <h3 className="font-bold text-sm mb-2 group-hover:text-white text-gray-200 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-500">المصدر: {item.source}</p>
              </div>
            ))}
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
                هذه التنبؤات مبنية على تحليلات وآراء خبراء في السوق، وهي تمثل وجهات نظرهم الخاصة بناءً على المعطيات الحالية. الأسواق متقلبة بطبيعتها، وليس بالضرورة أن تكون هذه التنبؤات صحيحة دائماً. يُنصح بإجراء بحثك الخاص قبل اتخاذ أي قرارات استثمارية أو تجارية.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {predictions.map((pred) => (
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
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">👤</div>
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
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
