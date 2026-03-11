import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const TOUR_STEPS = [
  {
    target: 'sidebar-feed',
    title: 'الرئيسية',
    content: 'هنا تجد آخر التحديثات والمنشورات من مجتمع رواد.',
    position: 'right'
  },
  {
    target: 'sidebar-marketplace',
    title: 'سوق الأفكار',
    content: 'استكشف أفكاراً واعدة أو اعرض فكرتك للمستثمرين.',
    position: 'right'
  },
  {
    target: 'sidebar-raed',
    title: 'RAED AI',
    content: 'شريكك المؤسس الذكي، جاهز لمساعدتك في أي وقت.',
    position: 'right'
  },
  {
    target: 'create-post-btn',
    title: 'أنشئ مشروعك',
    content: 'ابدأ رحلتك الريادية من هنا.',
    position: 'bottom'
  }
];

export const OnboardingTour = () => {
  const { t, dir } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_tour_completed');
    if (!completed) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      const updatePosition = () => {
        const element = document.getElementById(TOUR_STEPS[currentStep].target);
        if (element) {
          setTargetRect(element.getBoundingClientRect());
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [currentStep, isVisible]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding_tour_completed', 'true');
  };

  if (!isVisible || !targetRect) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Backdrop with hole */}
        <div className="absolute inset-0 bg-black/50 clip-path-hole" />
        
        {/* Highlight Box */}
        <motion.div
          layoutId="highlight"
          className="absolute border-2 border-[#FFD700] rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentStep}
          className="absolute pointer-events-auto bg-[#141517] border border-white/10 p-6 rounded-2xl w-80 shadow-2xl"
          style={{
            top: targetRect.bottom + 20,
            left: dir === 'rtl' ? targetRect.right - 320 : targetRect.left, // Adjust based on direction
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg text-[#FFD700]">{step.title}</h3>
            <button onClick={handleFinish} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <p className="text-gray-300 mb-6 text-sm leading-relaxed">{step.content}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentStep ? 'bg-[#FFD700]' : 'bg-white/20'}`} 
                />
              ))}
            </div>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button 
                  onClick={handlePrev}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronRight size={20} className={dir === 'rtl' ? '' : 'rotate-180'} />
                </button>
              )}
              <button 
                onClick={handleNext}
                className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#FFC000] transition-colors flex items-center gap-1"
              >
                {currentStep === TOUR_STEPS.length - 1 ? t('finish') : t('next')}
                {currentStep < TOUR_STEPS.length - 1 && <ChevronLeft size={16} className={dir === 'rtl' ? '' : 'rotate-180'} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
