import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const AuthPromptModal = ({ isOpen, onClose, message }: AuthPromptModalProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#141517] border border-white/10 rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-3xl -z-10" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FFD700]">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('loginToContinue')}</h2>
            <p className="text-gray-400">
              {message || t('requiredLogin')}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-[#FFD700] text-black py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors"
            >
              {t('login')}
            </button>
            <button
              onClick={onClose}
              className="w-full bg-white/5 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
