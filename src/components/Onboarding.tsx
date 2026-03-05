import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type UserType = 'idea' | 'skill' | 'investor' | null;

interface OnboardingProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export const Onboarding = ({ userType, onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const { t } = useLanguage();

  const questions = {
    idea: [
      {
        id: 'problem',
        text: t('q_idea_problem'),
        placeholder: t('q_idea_problem_ph'),
        type: 'text'
      },
      {
        id: 'fear',
        text: t('q_idea_fear'),
        placeholder: t('q_idea_fear_ph'),
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
  const currentQ = currentQuestions[step];

  const handleNext = () => {
    if (currentQ.type === 'text' && !inputValue.trim()) return;
    
    const answer = currentQ.type === 'text' ? inputValue : inputValue; // Logic same for now
    setAnswers(prev => ({ ...prev, [currentQ.id]: answer }));
    setInputValue('');

    if (step < currentQuestions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onComplete({ ...answers, [currentQ.id]: answer });
    }
  };

  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    if (step < currentQuestions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onComplete({ ...answers, [currentQ.id]: option });
    }
  };

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

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8 leading-relaxed text-white">
            {currentQ.text}
          </h2>

          {/* Input Area */}
          <div className="space-y-6">
            {currentQ.type === 'text' ? (
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
                {currentQ.options?.map((option, idx) => (
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
