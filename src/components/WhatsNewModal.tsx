import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Globe, Bot, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CURRENT_VERSION = '1.0.0';

export const WhatsNewModal = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastVersion = localStorage.getItem('whats_new_version');
    if (lastVersion !== CURRENT_VERSION) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('whats_new_version', CURRENT_VERSION);
  };

  const features = [
    {
      icon: Globe,
      title: t('community'),
      desc: 'انضم إلى مجتمع رواد الأعمال، شارك أفكارك، وتواصل مع المبدعين.'
    },
    {
      icon: Bot,
      title: 'RAED AI',
      desc: 'مساعدك الذكي الجديد، مدعوم بأحدث تقنيات الذكاء الاصطناعي.'
    },
    {
      icon: ShoppingBag,
      title: t('marketplace'),
      desc: 'سوق متكامل لعرض واستكشاف المشاريع والفرص الاستثمارية.'
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#141517] border border-white/10 rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-3xl -z-10" />
          
          <button 
            onClick={handleClose}
            className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FFD700]">
              <Sparkles size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('whatsNew')}</h2>
            <p className="text-gray-400">اكتشف آخر التحديثات في Ruwadverse</p>
          </div>

          <div className="space-y-6 mb-8">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-[#FFD700]">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-[#FFD700] text-black py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors"
          >
            {t('startExploring')}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
