import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const SectorIntelligence = () => {
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching sector intelligence data
    // In a real app, this would be an aggregation query on the ideas and profiles tables
    const fetchSectorData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSectorData([
        { id: 'tech', name: 'التقنية والبرمجيات', ideasCount: 47, investorsCount: 12, avgFunding: '50K', trend: '+15%' },
        { id: 'health', name: 'التكنولوجيا الصحية', ideasCount: 23, investorsCount: 8, avgFunding: '120K', trend: '+22%' },
        { id: 'education', name: 'تكنولوجيا التعليم', ideasCount: 34, investorsCount: 5, avgFunding: '30K', trend: '+8%' },
        { id: 'finance', name: 'التقنية المالية', ideasCount: 19, investorsCount: 15, avgFunding: '200K', trend: '+35%' },
      ]);
      setLoading(false);
    };

    fetchSectorData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#141517] rounded-3xl border border-white/5 p-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141517] rounded-3xl border border-white/5 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <Activity className="text-blue-500" size={20} />
          ذكاء القطاعات (Sector Intelligence)
        </h2>
      </div>

      <div className="space-y-4 relative z-10">
        {sectorData.map((sector, index) => (
          <motion.div 
            key={sector.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/20 border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-colors group"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{sector.name}</h3>
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                <TrendingUp size={12} /> {sector.trend}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-[10px] text-gray-500 mb-1 flex items-center justify-center gap-1"><Target size={10} /> أفكار</p>
                <p className="font-bold text-sm text-gray-300">{sector.ideasCount}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-[10px] text-gray-500 mb-1 flex items-center justify-center gap-1"><Users size={10} /> مستثمرون</p>
                <p className="font-bold text-sm text-gray-300">{sector.investorsCount}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-[10px] text-gray-500 mb-1 flex items-center justify-center gap-1"><DollarSign size={10} /> متوسط التمويل</p>
                <p className="font-bold text-sm text-[#FFD700]">{sector.avgFunding} ج.م</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
