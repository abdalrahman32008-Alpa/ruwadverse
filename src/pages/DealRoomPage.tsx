import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, CheckCircle2, Lock, FileSignature, Upload, Download, Users } from 'lucide-react';

export const DealRoomPage = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'terms' | 'signatures'>('documents');

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-[#141517] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">غرفة الصفقات (Deal Room)</h1>
                <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Lock size={12} /> مشفرة بالكامل
                </span>
              </div>
              <p className="text-gray-400">مساحة آمنة لمشاركة المستندات، مناقشة الشروط، وتوقيع العقود.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=1" alt="Founder" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden -ml-4 border-2 border-[#141517]">
                  <img src="https://i.pravatar.cc/150?u=2" alt="Investor" />
                </div>
                <span className="text-sm text-gray-300 mr-2">مؤسس ومستثمر</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('documents')}
            className={`pb-4 px-4 font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'documents' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} /> المستندات السرية
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('terms')}
            className={`pb-4 px-4 font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'terms' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} /> الشروط والأحكام (Term Sheet)
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('signatures')}
            className={`pb-4 px-4 font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'signatures' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <FileSignature size={18} /> التوقيع الإلكتروني
            </div>
          </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'documents' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141517] rounded-3xl border border-white/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">المستندات المرفوعة</h2>
                  <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 border border-white/10">
                    <Upload size={16} /> رفع مستند
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center py-12 text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>لا توجد مستندات مرفوعة بعد.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'terms' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141517] rounded-3xl border border-white/10 p-6">
                 <h2 className="text-xl font-bold mb-6">مناقشة الشروط (Term Sheet)</h2>
                 <div className="space-y-6">
                    <div className="text-center py-12 text-gray-500">
                      <Users size={48} className="mx-auto mb-4 opacity-50" />
                      <p>لم يتم تحديد شروط الصفقة بعد.</p>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'signatures' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141517] rounded-3xl border border-white/10 p-6 text-center">
                <div className="w-20 h-20 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileSignature size={40} className="text-[#FFD700]" />
                </div>
                <h2 className="text-xl font-bold mb-4">التوقيع الإلكتروني الذكي</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    بمجرد الاتفاق على الشروط، سيتم إنشاء عقد ذكي (Smart Contract) لضمان حقوق الطرفين.
                </p>
                <button className="bg-[#FFD700] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#FFC000] transition-colors">
                    إنشاء العقد النهائي
                </button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#141517] rounded-3xl border border-white/10 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Shield className="text-green-500" size={18} />
                حالة الأمان
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 size={16} className="text-green-500" /> NDA موقع من الطرفين
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 size={16} className="text-green-500" /> تشفير End-to-End
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 size={16} className="text-green-500" /> هويات موثقة (KYC)
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#141517] to-[#1a1b1e] rounded-3xl border border-[#FFD700]/20 p-6">
              <h3 className="font-bold mb-2 text-[#FFD700]">مستشار RAED القانوني</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                يقوم RAED بتحليل المستندات المرفوعة للتأكد من خلوها من الثغرات القانونية ومطابقتها لمعايير السوق.
              </p>
              <button className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-sm transition-colors border border-white/10">
                طلب مراجعة العقد
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
