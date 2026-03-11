import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Target, Users, DollarSign, Check, ChevronLeft, ChevronRight, Wand2, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { generateQuickBio } from '../services/raed'; // We'll reuse this or create a new one for pitch

import { useLanguage } from '../contexts/LanguageContext';

export const CreateIdeaPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);

  const STEPS = [
    { id: 1, title: t('stepIdea'), icon: Lightbulb },
    { id: 2, title: t('stepMarket'), icon: Target },
    { id: 3, title: t('stepTeam'), icon: Users },
    { id: 4, title: t('stepFunding'), icon: DollarSign },
  ];
  const [loading, setLoading] = useState(false);
  const [isCoaching, setIsCoaching] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
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

  const handlePitchCoach = async () => {
    if (!formData.description) {
      toast.error(t('fillRequiredFields'));
      return;
    }
    setIsCoaching(true);
    try {
      // Simulate RAED Pitch Coach using Gemini (mocked here for speed, ideally call a real service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      const improvedPitch = `Executive Summary:\n${formData.title || 'Innovative Project'} aims to revolutionize the ${formData.sector || 'Technology'} sector.\n\nProblem:\nThere is a clear gap in the current market where users suffer from inefficiency.\n\nSolution:\nWe offer an integrated platform based on the latest technologies to solve this problem radically.\n\nMarket Size:\nThe target market is growing at a rate of 25% annually, representing a huge investment opportunity.`;
      
      setFormData(prev => ({ ...prev, description: improvedPitch }));
      toast.success(t('pitchCoachSuccess'));
    } catch (error) {
      toast.error(t('errorOccurred'));
    } finally {
      setIsCoaching(false);
    }
  };

  const handleMarketValidation = async () => {
    if (!formData.sector) {
      toast.error(t('sectorPlaceholder'));
      return;
    }
    setIsValidating(true);
    try {
      // Simulate Google Trends / Market Validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMarketData({
        growth: '+34%',
        trend: t('marketTrendUp'), // Assuming I should add this or use a generic one
        competitors: [t('competitorA'), t('competitorB'), t('competitorC')],
        insight: t('marketInsight', { sector: formData.sector })
      });
      toast.success(t('marketAnalysisSuccess'));
    } catch (error) {
      toast.error(t('errorOccurred'));
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
        toast.error(t('loginRequired'));
        return;
    }
    if (!formData.title || !formData.description) {
        toast.error(t('fillRequiredFields'));
        return;
    }

    setLoading(true);
    try {
        const { error } = await supabase
            .from('ideas')
            .insert([
                {
                    user_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    sector: formData.sector,
                    funding_needed: formData.isFundingNeeded ? formData.fundingGoal : '0',
                }
            ]);

        if (error) throw error;

        toast.success(t('publishSuccess'));
        navigate('/profile/me'); // Redirect to profile or feed
    } catch (error) {
        console.error('Error creating idea:', error);
        toast.error(t('errorOccurred'));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 pt-24 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('createIdeaTitle')}</h1>
        <p className="text-gray-400">{t('createIdeaDesc')}</p>
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
                  {t('ideaDetailsTitle')}
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">{t('projectTitleLabel')}</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder={t('projectTitlePlaceholder')}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-[#FFD700] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-300">{t('pitchLabel')}</label>
                    <button 
                      onClick={handlePitchCoach}
                      disabled={isCoaching || !formData.description}
                      className="text-xs bg-[#FFD700]/10 text-[#FFD700] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#FFD700]/20 transition-colors disabled:opacity-50"
                    >
                      {isCoaching ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                      RAED Pitch Coach
                    </button>
                  </div>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder={t('pitchPlaceholder')}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 h-40 resize-none focus:border-[#FFD700] outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500">{t('pitchTip')}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-300">{t('sectorLabel')}</label>
                    <button 
                      onClick={handleMarketValidation}
                      disabled={isValidating || !formData.sector}
                      className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                    >
                      {isValidating ? <Loader2 size={12} className="animate-spin" /> : <TrendingUp size={12} />}
                      RAED Market Validator
                    </button>
                  </div>
                  <select 
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-[#FFD700] outline-none transition-colors"
                  >
                    <option value="">{t('sectorPlaceholder')}</option>
                    <option value="tech">{t('sectorTech')}</option>
                    <option value="education">{t('sectorEducation')}</option>
                    <option value="health">{t('sectorHealth')}</option>
                    <option value="finance">{t('sectorFinance')}</option>
                    <option value="ecommerce">{t('sectorEcommerce')}</option>
                    <option value="other">{t('sectorOther')}</option>
                  </select>
                </div>

                {/* Market Validation Results */}
                <AnimatePresence>
                  {marketData && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 overflow-hidden"
                    >
                      <h4 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <TrendingUp size={16} />
                        {t('marketValidationTitle')}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="bg-black/20 p-3 rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">{t('annualGrowth')}</p>
                          <p className="text-lg font-bold text-green-400">{marketData.growth}</p>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">{t('marketTrend')}</p>
                          <p className="text-lg font-bold text-white">{marketData.trend}</p>
                        </div>
                      </div>
                      <div className="bg-black/20 p-3 rounded-lg mb-3">
                        <p className="text-xs text-gray-400 mb-2">{t('topCompetitors')}</p>
                        <div className="flex flex-wrap gap-2">
                          {marketData.competitors.map((comp: string, i: number) => (
                            <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded border border-white/10">{comp}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 flex items-start gap-2">
                        <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        {marketData.insight}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Target className="text-[#FFD700]" />
                  {t('marketProblemTitle')}
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">{t('problemLabel')}</label>
                  <textarea 
                    value={formData.problem}
                    onChange={(e) => setFormData({...formData, problem: e.target.value})}
                    placeholder={t('problemPlaceholder')}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 h-24 resize-none focus:border-[#FFD700] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">{t('solutionLabel')}</label>
                  <textarea 
                    value={formData.solution}
                    onChange={(e) => setFormData({...formData, solution: e.target.value})}
                    placeholder={t('solutionPlaceholder')}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 h-24 resize-none focus:border-[#FFD700] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">{t('targetAudienceLabel')}</label>
                  <input 
                    type="text" 
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    placeholder={t('targetAudiencePlaceholder')}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-[#FFD700] outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users className="text-[#FFD700]" />
                  {t('teamTitle')}
                </h2>
                
                <div className="p-6 bg-white/5 rounded-2xl text-center border border-dashed border-gray-600 hover:border-[#FFD700] transition-colors cursor-pointer">
                  <Users size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="font-bold">{t('addTeamMembers')}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('addTeamMembersDesc')}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">{t('teamSizeLabel')}</label>
                  <select 
                    value={formData.teamSize}
                    onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-[#FFD700] outline-none transition-colors"
                  >
                    <option value="1">{t('soloFounder')}</option>
                    <option value="2-5">{t('team2_5')}</option>
                    <option value="5-10">{t('team5_10')}</option>
                    <option value="10+">{t('team10_plus')}</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <DollarSign className="text-[#FFD700]" />
                  {t('fundingTitle')}
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">{t('isFundingNeededLabel')}</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="funding" 
                        className="accent-[#FFD700]" 
                        checked={formData.isFundingNeeded}
                        onChange={() => setFormData({...formData, isFundingNeeded: true})}
                      />
                      <span>{t('yes')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="funding" 
                        className="accent-[#FFD700]" 
                        checked={!formData.isFundingNeeded}
                        onChange={() => setFormData({...formData, isFundingNeeded: false})}
                      />
                      <span>{t('noNotNow')}</span>
                    </label>
                  </div>
                </div>

                {formData.isFundingNeeded && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">{t('fundingAmountLabel')}</label>
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
            {t('prevBtn')}
          </button>

          {currentStep < STEPS.length ? (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-[#FFD700] text-black px-6 py-2 rounded-xl font-bold hover:bg-[#FFC000] transition-colors"
            >
              {t('nextBtn')}
              <ChevronLeft size={20} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-[#FFD700] text-black px-8 py-2 rounded-xl font-bold hover:bg-[#FFC000] transition-colors shadow-lg shadow-[#FFD700]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
              {t('publishProjectBtn')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
