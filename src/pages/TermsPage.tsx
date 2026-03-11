import React from 'react';
import { motion } from 'motion/react';
import { Scale, FileSignature, AlertTriangle, Cpu, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const TermsPage = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <Scale className="text-[#FFD700] w-10 h-10" />
          <h1 className="text-4xl font-bold text-[#FFD700]">{t('termsTitle')}</h1>
        </div>
        <p className="text-gray-400 mb-12">{t('lastUpdated')}: {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>

        <div className="space-y-12">
          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <FileSignature className="text-blue-400" />
              <h2 className="text-2xl font-bold text-white">{t('termsAcceptTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t('termsAcceptDesc')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed">
              <li>{t('termsAcceptBullet1')}</li>
              <li>{t('termsAcceptBullet2')}</li>
            </ul>
          </section>

          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="text-green-400" />
              <h2 className="text-2xl font-bold text-white">{t('termsAiTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t('termsAiDesc')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed">
              <li><strong>{t('termsAiDisclaimer').split(':')[0]}:</strong> {t('termsAiDisclaimer').split(':')[1]}</li>
              <li>{t('termsAiConduct')}</li>
            </ul>
          </section>

          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-purple-400" />
              <h2 className="text-2xl font-bold text-white">{t('termsIpTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t('termsIpDesc')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed">
              <li>{t('termsIpBullet1')}</li>
              <li>{t('termsIpBullet2')}</li>
            </ul>
          </section>

          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-400" />
              <h2 className="text-2xl font-bold text-white">{t('termsProhibitedTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t('termsProhibitedDesc')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed">
              <li>{t('termsProhibitedBullet1')}</li>
              <li>{t('termsProhibitedBullet2')}</li>
              <li>{t('termsProhibitedBullet3')}</li>
              <li>{t('termsProhibitedBullet4')}</li>
            </ul>
          </section>

          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">{t('termsChangesTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('termsChangesDesc')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
