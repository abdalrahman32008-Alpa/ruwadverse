import React from 'react';
import { useParams } from 'react-router-dom';
import { Lightbulb, Users, DollarSign, ArrowLeft } from 'lucide-react';

export const IdeaDetailPage = () => {
  const { id } = useParams();
  
  // In a real app, fetch idea details by id
  return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto">
      <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
        <ArrowLeft size={16} /> العودة للسوق
      </button>
      
      <div className="linear-card p-8 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-4xl font-bold text-white">منصة تعليمية ذكية</h1>
          <span className="px-4 py-2 rounded-full bg-[#FFD700]/10 text-[#FFD700] font-bold">فكرة تقنية</span>
        </div>
        <p className="text-gray-400 text-lg mb-8">وصف تفصيلي للفكرة يوضح المشكلة والحل المقترح والجمهور المستهدف...</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-2xl flex items-center gap-4">
            <Users className="text-[#FFD700]" />
            <div>
              <p className="text-gray-500 text-xs">الفريق المطلوب</p>
              <p className="text-white font-bold">مطور، مصمم، مسوق</p>
            </div>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl flex items-center gap-4">
            <DollarSign className="text-[#FFD700]" />
            <div>
              <p className="text-gray-500 text-xs">الاستثمار المطلوب</p>
              <p className="text-white font-bold">50,000$</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
