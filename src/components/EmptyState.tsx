import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10"
      >
        <Icon size={48} className="text-gray-400" />
      </motion.div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 mb-8 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
