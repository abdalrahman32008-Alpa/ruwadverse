import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-bold text-[#FFD700] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-6">الصفحة غير موجودة</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها قد تكون حذفت أو تم تغيير اسمها أو غير متاحة حالياً.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors"
        >
          <Home size={20} />
          {t('home')}
        </Link>
      </motion.div>
    </div>
  );
};
