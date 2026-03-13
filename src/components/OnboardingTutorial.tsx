import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronRight, ChevronLeft, Rocket, Target, 
  BrainCircuit, ShieldAlert, Coins, Terminal, 
  Layers, Network, Eye
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const OnboardingTutorial = () => {
  const { dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<'founder' | 'investor' | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('ruwadverse_tutorial_seen');
    if (!hasSeenTutorial) {
      // Small delay to let the dashboard load first
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('ruwadverse_tutorial_seen', 'true');
  };

  const founderSteps = [
    {
      title: 'خارطة طريق ريادة الأعمال',
      description: 'نظام متكامل من 7 مراحل يقودك من مجرد فكرة إلى مشروع عالمي قابل للتوسع. كل مرحلة لها أهدافها وأدواتها الخاصة.',
      icon: <Network size={48} className="text-[#FFD700]" />,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
      color: 'from-[#FFD700]/20 to-transparent'
    },
    {
      title: 'مساحة العمل الذكية',
      description: 'نظم مهامك بناءً على مرحلة مشروعك الحالية. RAED AI سيقوم بتحليل تقدمك واقتراح الخطوات القادمة بدقة.',
      icon: <Terminal size={48} className="text-blue-400" />,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      color: 'from-blue-500/20 to-transparent'
    },
    {
      title: 'محاكي السوق (Market Simulator)',
      description: 'توقع تكلفة الاستحواذ على العملاء (CAC) والقيمة الدائمة (LTV) ومعدل التسرب قبل إطلاق مشروعك.',
      icon: <Target size={48} className="text-green-500" />,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      color: 'from-green-500/20 to-transparent'
    }
  ];

  const investorSteps = [
    {
      title: 'مصفوفة التوافق (Synergy Matrix)',
      description: 'حلل مدى توافقك مع المؤسس عبر 5 أبعاد معقدة تشمل الرؤية، تحمل المخاطر، والثقافة العملية.',
      icon: <Network size={48} className="text-purple-400" />,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      color: 'from-purple-500/20 to-transparent'
    },
    {
      title: 'عراف المخاطر (Risk Oracle)',
      description: 'تشريح استباقي للمشروع (Pre-Mortem) لاكتشاف التهديدات القاتلة واحتمالية النجاة قبل الاستثمار.',
      icon: <Eye size={48} className="text-red-500" />,
      image: 'https://images.unsplash.com/photo-1614064641913-6b7140414c71?q=80&w=800&auto=format&fit=crop',
      color: 'from-red-500/20 to-transparent'
    },
    {
      title: 'جدول الحصص الكمّي (Quantum Cap Table)',
      description: 'محاكاة مسارات التمويل المستقبلية وتأثير التخفيف (Dilution) على حصتك باستخدام خوارزميات مونت كارلو.',
      icon: <Coins size={48} className="text-cyan-400" />,
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800&auto=format&fit=crop',
      color: 'from-cyan-500/20 to-transparent'
    }
  ];

  const currentSteps = role === 'founder' ? founderSteps : investorSteps;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0B0C0E] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          onClick={e => e.stopPropagation()}
          dir={dir}
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {!role ? (
            // Role Selection Screen
            <div className="p-8 md:p-12 w-full text-center">
              <div className="w-20 h-20 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BrainCircuit size={40} className="text-[#FFD700]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">مرحباً بك في نظام التشغيل المستقبلي</h2>
              <p className="text-gray-400 mb-12 max-w-lg mx-auto">
                لقد قمنا بتحديث المنصة بأنظمة ذكاء اصطناعي متقدمة. لتخصيص الجولة التعريفية، يرجى تحديد مسارك:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button 
                  onClick={() => setRole('founder')}
                  className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FFD700]/50 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Rocket size={48} className="text-[#FFD700] mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-2">رائد أعمال / مؤسس</h3>
                  <p className="text-sm text-gray-400">أريد بناء مشروعي وتسريع نموه</p>
                </button>
                
                <button 
                  onClick={() => setRole('investor')}
                  className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ShieldAlert size={48} className="text-purple-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-2">مستثمر / شريك</h3>
                  <p className="text-sm text-gray-400">أريد اكتشاف وتحليل الفرص الاستثمارية</p>
                </button>
              </div>
              
              <button onClick={handleClose} className="mt-8 text-sm text-gray-500 hover:text-white transition-colors">
                تخطي الجولة التعريفية
              </button>
            </div>
          ) : (
            // Tutorial Steps
            <>
              {/* Image Side */}
              <div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-t ${currentSteps[step].color} z-10`} />
                    <div className="absolute inset-0 bg-[#0B0C0E]/40 z-10" />
                    <img 
                      src={currentSteps[step].image} 
                      alt={currentSteps[step].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <div className="p-6 bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                        {currentSteps[step].icon}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between min-h-[400px]">
                <div>
                  <div className="flex gap-2 mb-8">
                    {currentSteps.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === step ? 'w-8 bg-white' : 'w-4 bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                        {currentSteps[step].title}
                      </h2>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        {currentSteps[step].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10">
                  <button 
                    onClick={handleClose}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    تخطي
                  </button>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setStep(Math.max(0, step - 1))}
                      disabled={step === 0}
                      className="p-3 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} className="ltr:rotate-180" />
                    </button>
                    <button 
                      onClick={() => {
                        if (step === currentSteps.length - 1) {
                          handleClose();
                        } else {
                          setStep(step + 1);
                        }
                      }}
                      className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      {step === currentSteps.length - 1 ? 'ابدأ الاستكشاف' : 'التالي'}
                      {step !== currentSteps.length - 1 && <ChevronLeft size={20} className="rtl:rotate-180" />}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
