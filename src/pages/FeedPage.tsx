import React from 'react';
import { motion } from 'motion/react';
import { Plus, Filter, Sparkles } from 'lucide-react';

export const FeedPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المجتمع</h1>
        <button className="flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 rounded-xl font-bold">
          <Plus size={20} /> نشر فكرة
        </button>
      </div>
      
      {/* Stories Bar */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-16 h-16 rounded-full border-2 border-[#FFD700] p-0.5 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-gray-800" />
          </div>
        ))}
      </div>

      {/* Feed Content */}
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-[#141517] border border-white/10"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-800" />
              <div>
                <h3 className="font-bold">مستخدم {i}</h3>
                <p className="text-sm text-gray-400">منذ ساعتين</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">هذه فكرة مشروع واعدة في مجال التقنية المالية...</p>
            <div className="flex gap-4">
              <button className="text-sm text-gray-400 hover:text-[#FFD700]">إعجاب</button>
              <button className="text-sm text-gray-400 hover:text-[#FFD700]">تعليق</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
