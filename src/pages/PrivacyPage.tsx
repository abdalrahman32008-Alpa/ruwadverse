import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, Server, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const PrivacyPage = () => {
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
          <Shield className="text-[#FFD700] w-10 h-10" />
          <h1 className="text-4xl font-bold text-[#FFD700]">{t('privacyTitle')}</h1>
        </div>
        <p className="text-gray-400 mb-12">{t('lastUpdated')}: {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>

        <div className="space-y-12">
          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-blue-400" />
              <h2 className="text-2xl font-bold text-white">{t('privacyIntroTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('privacyIntroDesc')}
            </p>
          </section>

          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Server className="text-green-400" />
              <h2 className="text-2xl font-bold text-white">{t('privacyDataTitle')}</h2>
            </div>
            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed">
              <li>{t('privacyDataAccount')}</li>
              <li>{t('privacyDataProfessional')}</li>
              <li>{t('privacyDataSensitive')}</li>
              <li>{t('privacyDataInteraction')}</li>
            </ul>
          </section>

          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-purple-400" />
              <h2 className="text-2xl font-bold text-white">{t('privacyAiTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t('privacyAiIntro')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed">
              <li>{t('privacyAiNoTrain')}</li>
              <li>{t('privacyAiEncryption')}</li>
              <li>{t('privacyAiIsolation')}</li>
            </ul>
          </section>

          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-orange-400" />
              <h2 className="text-2xl font-bold text-white">{t('privacyNdaTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('privacyNdaDesc')}
            </p>
          </section>

          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">{t('privacySharingTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('privacySharingDesc')}
            </p>
          </section>

          <section className="bg-[#141517]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">{t('privacyRightsTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('privacyRightsDesc')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
