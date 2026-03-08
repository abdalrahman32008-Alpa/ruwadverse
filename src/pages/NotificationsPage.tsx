import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const NotificationsPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-24 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{t('notifications')}</h1>
        <div className="bg-[#141517] rounded-2xl border border-white/5 p-6 text-center">
          <p className="text-gray-400">لا توجد إشعارات جديدة</p>
        </div>
      </div>
    </div>
  );
};
