import React from 'react';
import { Search, Filter } from 'lucide-react';

export const MarketplacePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">سوق الأفكار</h1>
        <button className="flex items-center gap-2 bg-[#141517] border border-white/10 px-4 py-2 rounded-xl">
          <Filter size={20} /> فلاتر
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-[#141517] border border-white/10 hover:border-[#FFD700]/50 transition-colors">
            <h3 className="text-xl font-bold mb-2">فكرة مشروع {i}</h3>
            <p className="text-gray-400 text-sm mb-4">تحليل RAED: 85/100</p>
            <div className="flex justify-between items-center">
              <span className="text-[#FFD700] font-bold">تمويل: 50k</span>
              <button className="bg-[#FFD700] text-black px-4 py-2 rounded-xl text-sm font-bold">عرض التفاصيل</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
