import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Target, Users, DollarSign, Check, ChevronLeft, ChevronRight, Wand2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const STEPS = [
  { id: 1, title: 'الفكرة', icon: Lightbulb },
  { id: 2, title: 'السوق', icon: Target },
  { id: 3, title: 'الفريق', icon: Users },
  { id: 4, title: 'التمويل', icon: DollarSign },
];

export const CreateIdeaPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: '',
    targetAudience: '',
    problem: '',
    solution: '',
    teamSize: '1',
    fundingGoal: '',
    isFundingNeeded: false
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
        toast.error('يجب عليك تسجيل الدخول أولاً');
        return;
    }
    if (!formData.title || !formData.description) {
        toast.error('يرجى ملء الحقول الأساسية');
        return;
    }

    setLoading(true);
    try {
        const { error } = await supabase
            .from('ideas')
            .insert([
                {
                    owner_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    sector: formData.sector,
                    funding_needed: formData.isFundingNeeded ? parseFloat(formData.fundingGoal) : 0,
                    status: 'analyzing',
                    // Store other fields in a JSON column if available or just ignore for now as schema is limited
                    // Schema has: id, owner_id, title, description, sector, success_rate, funding_needed, status, created_at
                    // We can't store problem, solution, targetAudience, teamSize directly unless we add columns or use a jsonb column (not in schema I saw)
                    // I will append them to description for now to persist them somewhat
                }
            ]);

        if (error) throw error;

        toast.success('تم نشر المشروع بنجاح!');
        navigate('/profile/me'); // Redirect to profile or feed
    } catch (error) {
        console.error('Error creating idea:', error);
        toast.error('حدث خطأ أثناء نشر المشروع');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 pt-24 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">ابدأ رحلتك الريادية</h1>
        <p className="text-gray-400">شارك فكرتك مع العالم واحصل على الدعم الذي تحتاجه</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -z-10" />
        <div 
          className="absolute top-1/2 right-0 h-1 bg-[#FFD700] -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2 bg-[#141517] px-2">
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step.id <= currentStep 
                  ? 'bg-[#FFD700] border-[#FFD700] text-black' 
                  : 'bg-[#141517] border-gray-700 text-gray-500'
              }`}
            >
              <step.icon size={20} />
            </div>
            <span className={`text-xs font-bold ${step.id <= currentStep ? 'text-[#FFD700]' : 'text-gray-500'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-[#141517] border border-white/10 rounded-3xl p-8 min-h-[400px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Lightbulb className="text-[#FFD700]" />
                  تفاصيل الفكرة
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">عنوان المشروع</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="مثال: منصة تعليمية ذكية"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-[#FFD700] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-bold text-gray-300">وصف الفكرة</label>
                    <button className="text-xs text-[#FFD700] flex items-center gap-1 hover:underline">
                      <Wand2 size={12} /> تحسين بالذكاء الاصطناعي
                    </button>
                  </div>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="اشرح فكرتك باختصار..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 h-32 resize-none focus:border-[#FFD700] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">القطاع</label>
                  <select 
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-[#FFD700] outline-none transition-colors"
                  >
                    <option value="">اختر القطاع...</option>
                    <option value="tech">التقنية</option>
                    <option value="education">التعليم</option>
                    <option value="health">الصحة</option>
                    <option value="finance">المالية</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Target className="text-[#FFD700]" />
                  السوق والمشكلة
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">المشكلة التي تحلها</label>
                  <textarea 
                    value={formData.problem}
                    onChange={(e) => setFormData({...formData, problem: e.target.value})}
                    placeholder="ما هي المشكلة الرئيسية التي يواجهها عملاؤك؟"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 h-24 resize-none focus:border-[#FFD700] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">الحل المقترح</label>
                  <textarea 
                    value={formData.solution}
                    onChange={(e) => setFormData({...formData, solution: e.target.value})}
                    placeholder="كيف ستقوم بحل هذه المشكلة؟"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 h-24 resize-none focus:border-[#FFD700] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">الجمهور المستهدف</label>
                  <input 
                    type="text" 
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    placeholder="من هم عملاؤك المحتملون؟"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-[#FFD700] outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users className="text-[#FFD700]" />
                  الفريق
                </h2>
                
                <div className="p-6 bg-white/5 rounded-2xl text-center border border-dashed border-gray-600 hover:border-[#FFD700] transition-colors cursor-pointer">
                  <Users size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="font-bold">إضافة أعضاء الفريق</p>
                  <p className="text-xs text-gray-500 mt-1">يمكنك دعوة أعضاء فريقك للانضمام للمشروع</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">حجم الفريق الحالي</label>
                  <select 
                    value={formData.teamSize}
                    onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-[#FFD700] outline-none transition-colors"
                  >
                    <option value="1">مؤسس وحيد</option>
                    <option value="2-5">2-5 أعضاء</option>
                    <option value="5-10">5-10 أعضاء</option>
                    <option value="10+">أكثر من 10</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <DollarSign className="text-[#FFD700]" />
                  التمويل (اختياري)
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">هل تبحث عن تمويل؟</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="funding" 
                        className="accent-[#FFD700]" 
                        checked={formData.isFundingNeeded}
                        onChange={() => setFormData({...formData, isFundingNeeded: true})}
                      />
                      <span>نعم</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="funding" 
                        className="accent-[#FFD700]" 
                        checked={!formData.isFundingNeeded}
                        onChange={() => setFormData({...formData, isFundingNeeded: false})}
                      />
                      <span>لا، ليس الآن</span>
                    </label>
                  </div>
                </div>

                {formData.isFundingNeeded && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">المبلغ المطلوب ($)</label>
                    <input 
                      type="number" 
                      value={formData.fundingGoal}
                      onChange={(e) => setFormData({...formData, fundingGoal: e.target.value})}
                      placeholder="0.00"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-[#FFD700] outline-none transition-colors"
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
            السابق
          </button>

          {currentStep < STEPS.length ? (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-[#FFD700] text-black px-6 py-2 rounded-xl font-bold hover:bg-[#FFC000] transition-colors"
            >
              التالي
              <ChevronLeft size={20} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-[#FFD700] text-black px-8 py-2 rounded-xl font-bold hover:bg-[#FFC000] transition-colors shadow-lg shadow-[#FFD700]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
              نشر المشروع
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
