import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lightbulb, Loader2 } from 'lucide-react';

export const NewIdeaPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: 'Education',
    funding_needed: '',
    equity_offered: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('ideas')
        .insert([
          {
            user_id: user.id,
            ...formData
          }
        ]);

      if (error) throw error;

      toast.success('تم إضافة المشروع بنجاح!');
      navigate('/marketplace');
    } catch (error: any) {
      console.error('Error creating idea:', error);
      toast.error(error.message || 'حدث خطأ أثناء إضافة المشروع');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-24 pb-24 px-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-12 bg-[#FFD700]/10 rounded-xl flex items-center justify-center text-[#FFD700]">
            <Lightbulb size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">إضافة مشروع جديد</h1>
            <p className="text-gray-400 mt-1">شارك فكرتك مع المستثمرين والمطورين</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#141517]/80 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">عنوان المشروع</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                placeholder="مثال: منصة تعليمية تفاعلية"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">وصف المشروع</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors resize-none"
                placeholder="اشرح فكرتك بالتفصيل..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">القطاع</label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                >
                  <option value="Education">التعليم</option>
                  <option value="FinTech">التقنية المالية</option>
                  <option value="HealthTech">الصحة</option>
                  <option value="E-commerce">التجارة الإلكترونية</option>
                  <option value="PropTech">العقارات</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">التمويل المطلوب (اختياري)</label>
                <input
                  type="text"
                  name="funding_needed"
                  value={formData.funding_needed}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                  placeholder="مثال: $50K"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الحصة المعروضة (اختياري)</label>
                <input
                  type="text"
                  name="equity_offered"
                  value={formData.equity_offered}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                  placeholder="مثال: 10%"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-xl hover:bg-[#FFC000] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'نشر المشروع'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
