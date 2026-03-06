import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, CheckCircle, PenTool, Calendar, Shield, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const ContractPage = () => {
  const { user } = useAuth();
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const contractData = {
    id: 'CNT-2026-001',
    parties: [
      { name: 'أحمد محمد', role: 'صاحب الفكرة', percentage: '60%' },
      { name: 'سارة علي', role: 'شريك تقني', percentage: '40%' }
    ],
    terms: [
      'مدة الشراكة: 3 سنوات قابلة للتجديد.',
      'توزيع الأرباح: يتم توزيع الأرباح ربع سنوياً بناءً على النسب المتفق عليها.',
      'آلية الخروج: يحق لأي طرف الانسحاب بعد إشعار مسبق بمدة 3 أشهر.',
      'الملكية الفكرية: جميع حقوق الملكية الفكرية تعود للشركة الناشئة.',
      'السرية: يلتزم الطرفان بالحفاظ على سرية المعلومات التجارية والتقنية.'
    ],
    date: new Date().toLocaleDateString('ar-SA')
  };

  const handleSign = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSigned(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141517] border border-white/5 rounded-2xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-bl-full -mr-8 -mt-8"></div>
          
          <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">عقد شراكة رقمي</h1>
              <span className="text-sm text-gray-400">رقم العقد: {contractData.id}</span>
            </div>
            <div className="text-left">
              <span className="block text-sm text-gray-400 mb-1">تاريخ الإنشاء</span>
              <span className="font-mono text-white">{contractData.date}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-black/20 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                <Users size={18} /> أطراف العقد
              </h3>
              <ul className="space-y-4">
                {contractData.parties.map((party, idx) => (
                  <li key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                    <div>
                      <span className="font-bold text-white block">{party.name}</span>
                      <span className="text-xs text-gray-500">{party.role}</span>
                    </div>
                    <span className="text-[#FFD700] font-mono font-bold">{party.percentage}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black/20 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                <Shield size={18} /> الشروط والأحكام
              </h3>
              <ul className="space-y-3 list-disc list-inside text-sm text-gray-300">
                {contractData.terms.map((term, idx) => (
                  <li key={idx}>{term}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-8 border-t border-white/5">
            {!signed ? (
              <button 
                onClick={handleSign}
                disabled={loading}
                className="px-8 py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span>
                ) : (
                  <>
                    <PenTool size={20} /> التوقيع الرقمي
                  </>
                )}
              </button>
            ) : (
              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">تم التوقيع بنجاح!</h3>
                <p className="text-gray-400 mb-6">تم توثيق العقد في السجلات الرقمية.</p>
                <button className="px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto border border-white/10">
                  <Download size={18} /> تحميل نسخة PDF
                </button>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
};
