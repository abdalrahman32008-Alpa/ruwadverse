import React from 'react';
import { motion } from 'motion/react';
import { Check, X, Star, Zap, Shield, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingPage = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'الأساسية',
      price: 'مجاناً',
      description: 'كل ما تحتاجه للبدء في رحلة ريادة الأعمال',
      features: [
        { name: 'إنشاء ملف شخصي احترافي', included: true },
        { name: 'نشر حتى 3 أفكار شهرياً', included: true },
        { name: 'تصفح المشاريع والمجتمع', included: true },
        { name: 'دعم فني عبر المجتمع', included: true },
        { name: 'تحليلات متقدمة للأداء', included: false },
        { name: 'شارة توثيق الحساب', included: false },
        { name: 'أولوية الظهور في البحث', included: false },
      ],
      cta: 'ابدأ الآن',
      popular: false,
    },
    {
      name: 'المميزة (Premium)',
      price: '49 ر.س',
      period: '/ شهرياً',
      description: 'أدوات احترافية لتسريع نمو مشروعك',
      features: [
        { name: 'إنشاء ملف شخصي احترافي', included: true },
        { name: 'نشر أفكار غير محدود', included: true },
        { name: 'تصفح المشاريع والمجتمع', included: true },
        { name: 'دعم فني ذو أولوية (Priority Support)', included: true },
        { name: 'تحليلات متقدمة للأداء (Advanced Analytics)', included: true },
        { name: 'شارة توثيق الحساب (Verified)', included: true },
        { name: 'أولوية الظهور في البحث', included: true },
      ],
      cta: 'اشترك الآن',
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#FFD700]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            اختر الخطة المناسبة <span className="text-[#FFD700]">لطموحك</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            استثمر في أدوات تساعدك على الوصول للمستثمرين والشركاء بشكل أسرع وأكثر احترافية.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-white/10 bg-[#141517]'} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-8 bg-[#FFD700] text-black text-sm font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <Star size={14} fill="black" /> الأكثر طلباً
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-500">{plan.period}</span>}
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className={`p-1 rounded-full ${plan.popular ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-white/10 text-white'}`}>
                        <Check size={14} />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full bg-white/5 text-gray-600">
                        <X size={14} />
                      </div>
                    )}
                    <span className={feature.included ? 'text-gray-200' : 'text-gray-600'}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/auth')}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.popular 
                    ? 'bg-[#FFD700] text-black hover:bg-[#FFC000] shadow-lg shadow-[#FFD700]/20' 
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
          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4">
              <BarChart size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">تحليلات متقدمة</h3>
            <p className="text-gray-400 text-sm">
              احصل على رؤى تفصيلية حول أداء أفكارك وتفاعل المستثمرين مع ملفك الشخصي.
            </p>
          </div>
          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">أمان وموثوقية</h3>
            <p className="text-gray-400 text-sm">
              نظام حماية متطور لبياناتك وأفكارك، مع شارة توثيق لزيادة المصداقية.
            </p>
          </div>
          <div className="bg-[#141517] p-6 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-[#FFD700]/10 rounded-xl flex items-center justify-center text-[#FFD700] mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">سرعة وأداء</h3>
            <p className="text-gray-400 text-sm">
              تجربة استخدام سلسة وسريعة مدعومة بأحدث التقنيات لضمان وصولك للفرص فوراً.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
