import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Briefcase, CheckCircle, ChevronRight, Play, FileText, Users, Target, Rocket, Lightbulb, Download, ExternalLink } from 'lucide-react';
import { NeuralPitchDeck } from '../components/futuristic/NeuralPitchDeck';
import { AutonomousCoFounder } from '../components/futuristic/AutonomousCoFounder';

export const ProjectBuildingPage = () => {
  const { t, dir } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);

  const stepsData = [
    { 
      id: 1, 
      title: 'الفكرة والتحقق', 
      icon: <Lightbulb size={24} />, 
      desc: 'دراسة جدوى الفكرة وتحليل السوق',
      videoTitle: 'كيفية التحقق من صحة فكرتك',
      videoDesc: 'تعلم كيف تتأكد من أن فكرتك تحل مشكلة حقيقية وأن هناك سوقاً لها قبل البدء في بنائها.',
      tasks: [
        'تحديد المشكلة بوضوح وصياغتها في جملة واحدة',
        'تحديد الشريحة المستهدفة (العميل المثالي)',
        'دراسة المنافسين وتحليل نقاط القوة والضعف',
        'إجراء مقابلات مع 10 عملاء محتملين على الأقل'
      ],
      templates: [
        { name: 'نموذج العمل التجاري (Business Model Canvas)', type: 'pdf' },
        { name: 'نموذج تحليل المنافسين', type: 'excel' },
        { name: 'استبيان التحقق من الفكرة', type: 'doc' }
      ]
    },
    { 
      id: 2, 
      title: 'تكوين الفريق', 
      icon: <Users size={24} />, 
      desc: 'البحث عن شركاء مؤسسين ومواهب',
      videoTitle: 'كيف تختار المؤسس الشريك المناسب',
      videoDesc: 'أهم المعايير لاختيار شركائك وكيفية توزيع الحصص والمسؤوليات بشكل عادل.',
      tasks: [
        'تحديد المهارات الناقصة في الفريق الحالي',
        'البحث عن شريك تقني/تجاري يكمل مهاراتك',
        'تحديد نسب الملكية (Equity) بناءً على المساهمة',
        'توزيع المهام والمسؤوليات بشكل واضح'
      ],
      templates: [
        { name: 'اتفاقية المؤسسين (Founders Agreement)', type: 'doc' },
        { name: 'نموذج تقييم المهارات', type: 'excel' },
        { name: 'عقد عدم إفشاء (NDA)', type: 'pdf' }
      ]
    },
    { 
      id: 3, 
      title: 'النموذج الأولي (MVP)', 
      icon: <Target size={24} />, 
      desc: 'بناء النسخة الأولى من المنتج',
      videoTitle: 'بناء النموذج الأولي بأقل التكاليف',
      videoDesc: 'كيفية إطلاق منتجك بأسرع وقت وبأقل تكلفة لاختبار السوق وجمع الملاحظات.',
      tasks: [
        'تحديد الميزات الأساسية (Core Features) فقط',
        'تصميم واجهة المستخدم وتجربة المستخدم (UI/UX)',
        'تطوير النسخة الأولى (No-Code أو برمجة مخصصة)',
        'اختبار النموذج مع مستخدمين حقيقيين وجمع الآراء'
      ],
      templates: [
        { name: 'مستند المتطلبات التقنية (PRD)', type: 'doc' },
        { name: 'خطة إطلاق النموذج الأولي', type: 'excel' },
        { name: 'نموذج جمع الملاحظات (Feedback Form)', type: 'doc' }
      ]
    },
    { 
      id: 4, 
      title: 'التسجيل القانوني', 
      icon: <FileText size={24} />, 
      desc: 'تأسيس الشركة والأوراق القانونية',
      videoTitle: 'الخطوات القانونية لتأسيس شركتك الناشئة',
      videoDesc: 'دليل مبسط لفهم الكيانات القانونية وكيفية تسجيل شركتك بشكل رسمي.',
      tasks: [
        'اختيار الكيان القانوني المناسب (ذ.م.م، مساهمة، الخ)',
        'تسجيل الاسم التجاري والعلامة التجارية',
        'استخراج التراخيص اللازمة لمزاولة النشاط',
        'فتح حساب بنكي خاص بالشركة'
      ],
      templates: [
        { name: 'عقد التأسيس (Articles of Incorporation)', type: 'pdf' },
        { name: 'نموذج قرار مجلس الإدارة', type: 'doc' },
        { name: 'اتفاقية توظيف قياسية', type: 'doc' }
      ]
    },
    { 
      id: 5, 
      title: 'التمويل والإطلاق', 
      icon: <Rocket size={24} />, 
      desc: 'البحث عن مستثمرين وإطلاق المشروع',
      videoTitle: 'كيفية جذب المستثمرين وإطلاق مشروعك',
      videoDesc: 'استراتيجيات الإطلاق الناجح وكيفية إقناع المستثمرين بتمويل شركتك الناشئة.',
      tasks: [
        'إعداد العرض التقديمي للمستثمرين (Pitch Deck)',
        'تحديد التقييم الأولي للشركة واحتياجات التمويل',
        'التواصل مع المستثمرين الملائكيين وصناديق الاستثمار',
        'تخطيط وتنفيذ حملة الإطلاق التسويقية'
      ],
      templates: [
        { name: 'قالب العرض التقديمي (Pitch Deck Template)', type: 'ppt' },
        { name: 'النموذج المالي (Financial Model)', type: 'excel' },
        { name: 'خطة التسويق للإطلاق', type: 'doc' }
      ]
    },
  ];

  const currentStepData = stepsData.find(s => s.id === activeStep) || stepsData[0];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto" dir={dir}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">بناء المشروع</h1>
        <p className="text-gray-400">دليلك الشامل لتحويل فكرتك إلى شركة ناشئة ناجحة خطوة بخطوة.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Steps */}
        <div className="lg:col-span-1 space-y-2">
          {stepsData.map((step) => (
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
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{currentStepData.title}</h2>
                <p className="text-gray-400 mt-1">{currentStepData.desc}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Video Section */}
              <div className="bg-[#141517] p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Play size={20} className="text-[#FFD700]" />
                  الفيديو التوجيهي: {currentStepData.videoTitle}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{currentStepData.videoDesc}</p>
                <div className="aspect-video bg-black/50 rounded-lg border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=Step+${activeStep}&background=141517&color=FFD700`} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" referrerPolicy="no-referrer" />
                  <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center text-black relative z-10 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                    <Play size={32} className="ml-1" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Tasks Section */}
                <div className="bg-[#141517] p-6 rounded-xl border border-white/5">
                  <h3 className="font-bold mb-4 text-[#FFD700] flex items-center gap-2">
                    <CheckCircle size={18} />
                    المهام التوجيهية
                  </h3>
                  <ul className="space-y-4">
                    {currentStepData.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300 group">
                        <div className="mt-0.5 w-5 h-5 rounded border border-white/20 flex items-center justify-center group-hover:border-[#FFD700] transition-colors shrink-0 cursor-pointer">
                          <CheckCircle size={14} className="text-transparent group-hover:text-[#FFD700]/50" />
                        </div>
                        <span className="leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Templates Section */}
                <div className="bg-[#141517] p-6 rounded-xl border border-white/5">
                  <h3 className="font-bold mb-4 text-[#FFD700] flex items-center gap-2">
                    <FileText size={18} />
                    النماذج والأدوات
                  </h3>
                  <div className="space-y-3">
                    {currentStepData.templates.map((template, i) => (
                      <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-start group">
                        <span className="flex items-center gap-3">
                          <div className="p-2 rounded bg-white/5 text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                            <FileText size={16} />
                          </div>
                          <span className="text-gray-300 group-hover:text-white transition-colors">{template.name}</span>
                        </span>
                        <Download size={16} className="text-gray-500 group-hover:text-[#FFD700] transition-colors" />
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm">
                      <ExternalLink size={16} />
                      استشارة رائد (RAED AI) في هذه المرحلة
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                <button 
                  onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
                  disabled={activeStep === 1}
                  className="text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronRight size={20} className="ltr:rotate-180" />
                  السابق
                </button>
                <button 
                  onClick={() => setActiveStep(prev => Math.min(prev + 1, stepsData.length))}
                  disabled={activeStep === stepsData.length}
                  className="bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#FFD700]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {activeStep === stepsData.length ? 'إنهاء وبدء المشروع' : 'المرحلة التالية'}
                  <ChevronRight size={20} className="rtl:rotate-180" />
                </button>
              </div>

              {/* Futuristic Feature for Step 4 (Pitch Deck) */}
              {activeStep === 4 && (
                <NeuralPitchDeck />
              )}

              {/* Futuristic Feature for Step 5 (Execution) */}
              {activeStep === 5 && (
                <AutonomousCoFounder />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
