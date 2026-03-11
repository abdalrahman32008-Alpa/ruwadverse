import React from 'react';
import { motion } from 'motion/react';
import { Check, X, Star, Zap, Shield, BarChart, Cpu, Briefcase, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const PricingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currency, setCurrency] = React.useState<'EGP' | 'USD' | 'SAR'>('EGP');

  const exchangeRates = {
    EGP: 1,
    USD: 0.021,
    SAR: 0.078
  };

  const getPrice = (basePrice: number) => {
    const price = basePrice * exchangeRates[currency];
    if (currency === 'USD') return `$${price.toFixed(2)}`;
    if (currency === 'SAR') return `${price.toFixed(0)} ر.س`;
    return `${price.toFixed(0)} ج.م`;
  };

  const plans = [
    {
      name: t('freePlan'),
      price: t('freePlan').includes('Free') || t('freePlan').includes('مجاناً') ? t('freePlan').split(' ')[0] : 'Free',
      isFree: true,
      description: t('freePlanDesc'),
      features: [
        { name: t('basicProfile'), included: true },
        { name: t('addOneProject'), included: true },
        { name: t('standardNDA'), included: true },
        { name: t('browseIdeas'), included: true },
        { name: t('raedBasic'), included: false },
        { name: t('autonomousCoFounder'), included: false },
        { name: t('quantumCapTable'), included: false },
        { name: t('riskOracle'), included: false },
      ],
      cta: t('startForFree'),
      popular: false,
      color: 'white'
    },
    {
      name: t('proPlan'),
      price: 1499, // ~ $30/month
      isFree: false,
      period: ` / ${t('month')}`,
      description: t('proPlanDesc'),
      features: [
        { name: t('unlimitedProjects'), included: true },
        { name: t('unlimitedRaed'), included: true },
        { name: t('autonomousCoFounder'), included: true },
        { name: t('neuralPitchDeck'), included: true },
        { name: t('smartEquity'), included: true },
        { name: t('priorityVisibility'), included: true },
        { name: t('quantumCapTable'), included: false },
        { name: t('riskOracle'), included: false },
      ],
      cta: t('subscribeAsFounder'),
      popular: true,
      color: '#FFD700'
    },
    {
      name: t('investorProPlan'),
      price: 4999, // ~ $100/month
      isFree: false,
      period: ` / ${t('month')}`,
      description: t('investorProPlanDesc'),
      features: [
        { name: t('unlimitedLockedIdeas'), included: true },
        { name: t('riskOracle'), included: true },
        { name: t('quantumCapTable'), included: true },
        { name: t('synergyMatrix'), included: true },
        { name: t('aiRiskAnalysis'), included: true },
        { name: t('earlyAccess'), included: true },
        { name: t('advancedNDA'), included: true },
        { name: t('dealRoom'), included: true },
      ],
      cta: t('subscribeAsInvestor'),
      popular: false,
      color: '#3b82f6'
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#FFD700]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            {t('choosePlanTitle')} <span className="text-[#FFD700]">{t('choosePlanSubtitle')}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            {t('investInStartupOS')}
          </motion.p>

          {/* Currency Switcher */}
          <div className="flex justify-center mt-8">
            <div className="bg-[#141517] p-1 rounded-xl border border-white/10 flex gap-1">
              {(['EGP', 'USD', 'SAR'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    currency === curr 
                      ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/10' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`relative p-6 sm:p-8 rounded-3xl border transition-all hover:scale-[1.02] ${
                plan.popular 
                  ? 'border-[#FFD700] bg-gradient-to-b from-[#FFD700]/10 to-transparent shadow-2xl shadow-[#FFD700]/5' 
                  : plan.color === '#3b82f6' 
                    ? 'border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-transparent shadow-2xl shadow-blue-500/5'
                    : 'border-white/10 bg-[#141517]'
              } flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-8 bg-[#FFD700] text-black text-[10px] sm:text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-xl">
                  <Star size={12} fill="black" /> {t('mostPopular')}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-xs mb-6 leading-relaxed h-10">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {plan.isFree ? plan.price : getPrice(plan.price as number)}
                  </span>
                  {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className={`p-1 rounded-full ${plan.popular ? 'bg-[#FFD700]/20 text-[#FFD700]' : plan.color === '#3b82f6' ? 'bg-blue-500/20 text-blue-500' : 'bg-white/10 text-white'}`}>
                        <Check size={12} />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full bg-white/5 text-gray-600">
                        <X size={12} />
                      </div>
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-200' : 'text-gray-600'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/auth')}
                className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${
                  plan.popular 
                    ? 'bg-[#FFD700] text-black hover:bg-[#FFC000] shadow-lg shadow-[#FFD700]/20' 
                    : plan.color === '#3b82f6'
                      ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'
                      : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features Highlight Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5 hover:border-[#FFD700]/30 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-4">
              <Cpu size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('autonomousCoFounder')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('aiCoFounderDesc')}
            </p>
          </div>
          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4">
              <BarChart size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('riskOracle')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('riskOracleDesc')}
            </p>
          </div>
          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-colors">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('securityReliability')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('securityReliabilityDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
