import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Briefcase, CheckCircle, ChevronRight, Play, FileText, Users, Target, Rocket, Lightbulb } from 'lucide-react';

export const ProjectBuildingPage = () => {
  const { t, dir } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, title: 'الفكرة والتحقق', icon: <Lightbulb size={24} />, desc: 'دراسة جدوى الفكرة وتحليل السوق' },
    { id: 2, title: 'تكوين الفريق', icon: <Users size={24} />, desc: 'البحث عن شركاء مؤسسين ومواهب' },
    { id: 3, title: 'النموذج الأولي (MVP)', icon: <Target size={24} />, desc: 'بناء النسخة الأولى من المنتج' },
    { id: 4, title: 'التسجيل القانوني', icon: <FileText size={24} />, desc: 'تأسيس الشركة والأوراق القانونية' },
    { id: 5, title: 'التمويل والإطلاق', icon: <Rocket size={24} />, desc: 'البحث عن مستثمرين وإطلاق المشروع' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">بناء المشروع</h1>
        <p className="text-gray-400">دليلك الشامل لتحويل فكرتك إلى شركة ناشئة ناجحة خطوة بخطوة.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Steps */}
        <div className="lg:col-span-1 space-y-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`w-full text-start p-4 rounded-xl border transition-all flex items-center gap-3 ${
                activeStep === step.id
                  ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]'
                  : 'bg-[#141517] border-white/5 text-gray-400 hover:bg-white/5'
              }`}
            >
              <div className={`p-2 rounded-lg ${activeStep === step.id ? 'bg-[#FFD700]/20' : 'bg-white/5'}`}>
                {step.icon}
              </div>
              <div>
                <h3 className={`font-bold ${activeStep === step.id ? 'text-white' : ''}`}>{step.title}</h3>
                <p className="text-xs opacity-70 mt-1">{step.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="linear-card p-8 rounded-2xl border border-white/10 min-h-[500px]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-[#FFD700]/10 text-[#FFD700] rounded-xl border border-[#FFD700]/20">
                {steps.find(s => s.id === activeStep)?.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{steps.find(s => s.id === activeStep)?.title}</h2>
                <p className="text-gray-400 mt-1">{steps.find(s => s.id === activeStep)?.desc}</p>
              </div>
            </div>

            {/* Placeholder content for steps */}
            <div className="space-y-6">
              <div className="bg-[#141517] p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Play size={20} className="text-[#FFD700]" />
                  فيديو تعريفي للمرحلة
                </h3>
                <div className="aspect-video bg-black/50 rounded-lg border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                  <img src={`https://picsum.photos/seed/startup${activeStep}/800/450`} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" referrerPolicy="no-referrer" />
                  <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center text-black relative z-10 group-hover:scale-110 transition-transform">
                    <Play size={32} className="ml-1" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#141517] p-6 rounded-xl border border-white/5">
                  <h3 className="font-bold mb-4 text-[#FFD700]">المهام المطلوبة</h3>
                  <ul className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle size={16} className="text-gray-500 mt-0.5 shrink-0" />
                        <span>مهمة تجريبية رقم {i} يجب إنجازها في هذه المرحلة لضمان التقدم الصحيح.</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#141517] p-6 rounded-xl border border-white/5">
                  <h3 className="font-bold mb-4 text-[#FFD700]">أدوات مساعدة</h3>
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-start">
                        <span className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-400" />
                          نموذج عمل تجريبي {i}
                        </span>
                        <ChevronRight size={16} className="text-gray-500 rtl:rotate-180" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-8 pt-6 border-t border-white/10">
                <button 
                  onClick={() => setActiveStep(prev => Math.min(prev + 1, steps.length))}
                  disabled={activeStep === steps.length}
                  className="bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#FFD700]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  المرحلة التالية
                  <ChevronRight size={20} className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
