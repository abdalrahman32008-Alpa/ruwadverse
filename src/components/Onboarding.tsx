import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, ChevronRight, Sparkles, User, Briefcase, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type UserType = 'idea' | 'skill' | 'investor' | null;

interface OnboardingProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export const Onboarding = ({ userType, onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(-1); // -1: Welcome, 0-2: Questions, 3: Completion
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [raedScore, setRaedScore] = useState<number | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const { t } = useLanguage();

  const questions = {
    idea: [
      {
        id: 'quick_pitch',
        text: 'أخبرني عن فكرتك في جملة واحدة',
        placeholder: 'مثال: تطبيق يسهل طلب الطعام الصحي للموظفين...',
        type: 'text',
        isFirstValue: true
      },
      {
        id: 'problem',
        text: t('q_idea_problem'),
        placeholder: t('q_idea_problem_ph'),
        type: 'text'
      },
      {
        id: 'needs',
        text: t('q_idea_needs'),
        options: [t('opt_tech_partner'), t('opt_marketing_partner'), t('opt_finance_partner'), t('opt_investor_only')],
        type: 'select'
      }
    ],
    skill: [
      {
        id: 'superpower',
        text: t('q_skill_superpower'),
        placeholder: t('q_skill_superpower_ph'),
        type: 'text'
      },
      {
        id: 'passion',
        text: t('q_skill_passion'),
        options: [t('opt_fintech'), t('opt_edtech'), t('opt_healthtech'), t('opt_ecommerce')],
        type: 'select'
      },
      {
        id: 'preference',
        text: t('q_skill_preference'),
        options: [t('opt_equity'), t('opt_salary_equity'), t('opt_side_project')],
        type: 'select'
      }
    ],
    investor: [
      {
        id: 'sector',
        text: t('q_investor_sector'),
        options: [t('opt_saas'), t('opt_proptech'), t('opt_ai'), t('opt_all_sectors')],
        type: 'select'
      },
      {
        id: 'stage',
        text: t('q_investor_stage'),
        options: [t('opt_pre_seed'), t('opt_seed'), t('opt_series_a')],
        type: 'select'
      },
      {
        id: 'value',
        text: t('q_investor_value'),
        placeholder: t('q_investor_value_ph'),
        type: 'text'
      }
    ]
  };

  const currentQuestions = userType ? questions[userType] : [];
  const currentQ = step >= 0 && step < currentQuestions.length ? currentQuestions[step] : null;

  const handleNext = async () => {
    if (step === -1) {
      setStep(0);
      return;
    }

    if (currentQ?.type === 'text' && !inputValue.trim()) return;
    
    const answer = currentQ?.type === 'text' ? inputValue : inputValue;
    if (currentQ) {
      setAnswers(prev => ({ ...prev, [currentQ.id]: answer }));
      
      // First Value in < 60s
      if ((currentQ as any).isFirstValue && answer) {
        setIsScoring(true);
        // Simulate RAED fast scoring
        await new Promise(resolve => setTimeout(resolve, 1500));
        const score = Math.floor(Math.random() * 30) + 60; // Random score between 60-90
        setRaedScore(score);
        setIsScoring(false);
      }
    }
    setInputValue('');

    if (step < currentQuestions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setStep(prev => prev + 1); // Go to completion screen
    }
  };

  const handleOptionSelect = (option: string) => {
    if (currentQ) {
      setAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    }
    if (step < currentQuestions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setStep(prev => prev + 1); // Go to completion screen
    }
  };

  const handleFinalComplete = () => {
    onComplete({ ...answers, raed_score: raedScore });
  };

  const handleSkipRemaining = () => {
    onComplete({ ...answers, raed_score: raedScore, skipped_remaining: true });
  };

  // Welcome Screen
  if (step === -1) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 bg-[#0B0C0E]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
            <Sparkles size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">مرحباً بك في رواد فيرس</h1>
          <p className="text-gray-400 mb-8 text-lg">
            دعنا نساعدك في بناء ملفك الشخصي المثالي في خطوات بسيطة.
          </p>
          <button 
            onClick={handleNext}
            className="w-full py-4 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-all text-lg shadow-lg hover:shadow-[#FFD700]/20 mb-4"
          >
            ابدأ الآن
          </button>
          <button 
            onClick={() => onComplete({ skipped: true })}
            className="w-full py-3 bg-transparent text-gray-400 font-bold rounded-xl hover:text-white transition-all text-sm border border-transparent hover:border-white/10"
          >
            تخطي للإكمال لاحقاً
          </button>
        </motion.div>
      </div>
    );
  }

  // Completion Screen
  if (step >= currentQuestions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 bg-[#0B0C0E]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#141517] border border-white/5 rounded-3xl p-8 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" stroke="#333" strokeWidth="8" fill="none" />
              <motion.circle 
                cx="48" cy="48" r="40" stroke="#FFD700" strokeWidth="8" fill="none"
                strokeDasharray="251.2"
                strokeDashoffset="251.2"
                animate={{ strokeDashoffset: 251.2 * 0.25 }} // 75% complete
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
              75%
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">ملفك جاهز تقريباً!</h2>
          <p className="text-gray-400 mb-8">
            أكملت الخطوات الأساسية. يمكنك الآن استكشاف المنصة، لكن ننصحك بإكمال الـ 25% المتبقية للحصول على ظهور أكبر.
          </p>

          <button 
            onClick={handleFinalComplete}
            className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-all mb-3"
          >
            استكشف المنصة
          </button>
          <button 
            onClick={handleSkipRemaining}
            className="w-full py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/5"
          >
            تخطي الإكمال الآن
          </button>
        </motion.div>
      </div>
    );
  }

  // Question Screens
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 bg-[#0B0C0E]">
      <div className="max-w-2xl w-full">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="linear-card p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#141517]">
            <motion.div 
              className="h-full bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.5)]"
              initial={{ width: `${(step / currentQuestions.length) * 100}%` }}
              animate={{ width: `${((step + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>

          {/* RAED Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-black font-bold text-2xl shadow-[0_0_20px_rgba(255,215,0,0.3)] relative z-10">
              R
              <div className="absolute -bottom-1 -right-1 bg-[#141517] rounded-full p-1 border border-white/10">
                <Sparkles size={12} className="text-[#FFD700]" />
              </div>
            </div>
          </div>

          {/* RAED Score Display (if available) */}
          <AnimatePresence>
            {raedScore !== null && step > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center"
              >
                <p className="text-sm text-green-400 mb-1">تقييم RAED المبدئي لفكرتك</p>
                <div className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                  {raedScore}/100
                  <TrendingUp size={24} className="text-green-500" />
                </div>
                <p className="text-xs text-gray-400 mt-2">بداية ممتازة! دعنا نكمل التفاصيل لرفع التقييم.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8 leading-relaxed text-white">
            {currentQ?.text}
          </h2>

          {/* Input Area */}
          <div className="space-y-6">
            {isScoring ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin mb-4" />
                <p className="text-[#FFD700] font-bold animate-pulse">RAED يحلل فكرتك...</p>
              </div>
            ) : currentQ?.type === 'text' ? (
              <div className="relative group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  placeholder={currentQ.placeholder}
                  className="w-full bg-[#141517] border border-white/10 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-[#FFD700]/50 transition-all text-center placeholder-gray-600 text-white shadow-inner group-hover:border-white/20"
                  autoFocus
                />
                <button
                  onClick={handleNext}
                  disabled={!inputValue.trim()}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#FFD700] text-black p-2 rounded-lg hover:bg-[#FFC000] disabled:opacity-0 transition-all shadow-lg rtl:left-auto rtl:right-2"
                  aria-label="Next"
                >
                  <ChevronRight className="rtl:rotate-180" />
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {currentQ?.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full bg-[#141517] hover:bg-[#FFD700] hover:text-black border border-white/10 hover:border-[#FFD700] rounded-xl px-6 py-4 text-lg transition-all transform hover:scale-[1.02] text-center shadow-sm hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-between items-center text-xs text-[#8A8F98] pt-6 border-t border-white/5">
            <button 
              onClick={() => onComplete({ skipped: true })}
              className="text-gray-500 hover:text-white transition-colors"
            >
              تخطي
            </button>
            <span className="font-mono">STEP {step + 1} / {currentQuestions.length}</span>
            <span className="flex items-center gap-1.5 bg-[#141517] px-3 py-1 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              RAED is listening
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
