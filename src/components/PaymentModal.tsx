import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'free' | 'pro';
}

export const PaymentModal = ({ isOpen, onClose, plan }: PaymentModalProps) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | null>(null);

  const handlePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const reset = () => {
    setStep('method');
    setSelectedMethod(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#141517] w-full max-w-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {step === 'success' ? t('paymentSuccess') || 'Payment Successful' : t('checkout') || 'Checkout'}
              </h3>
              <button onClick={reset} className="text-gray-400 hover:text-white" aria-label="Close modal">
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-6">
              {step === 'method' && (
                <div className="space-y-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">{plan === 'pro' ? t('proPlan') : t('freePlan')}</span>
                      <span className="text-xl font-bold text-white">{plan === 'pro' ? '99 SAR' : '0 SAR'}</span>
                    </div>
                    <p className="text-xs text-gray-500">{t('billedMonthly') || 'Billed monthly'}</p>
                  </div>

                  <div className="space-y-3" role="group" aria-label={t('selectPaymentMethod') || 'Select Payment Method'}>
                    <p className="text-sm text-gray-400 font-medium">{t('selectPaymentMethod') || 'Select Payment Method'}</p>
                    
                    <button
                      onClick={() => setSelectedMethod('card')}
                      aria-pressed={selectedMethod === 'card'}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedMethod === 'card' ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                      <CreditCard className={selectedMethod === 'card' ? 'text-[#FFD700]' : 'text-gray-400'} aria-hidden="true" />
                      <div className="text-start">
                        <p className="font-bold text-sm text-white">Credit / Debit Card</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard, Mada</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedMethod('paypal')}
                      aria-pressed={selectedMethod === 'paypal'}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedMethod === 'paypal' ? 'border-[#0070BA] bg-[#0070BA]/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                      <div className="w-6 h-6 rounded bg-[#0070BA] flex items-center justify-center text-white font-bold text-xs italic" aria-hidden="true">P</div>
                      <div className="text-start">
                        <p className="font-bold text-sm text-white">PayPal</p>
                        <p className="text-xs text-gray-500">Fast & Secure</p>
                      </div>
                    </button>
                  </div>

                  <button
                    disabled={!selectedMethod}
                    onClick={handlePayment}
                    className="w-full py-4 rounded-xl bg-[#FFD700] text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFC000] transition-colors"
                  >
                    {t('payNow') || 'Pay Now'}
                  </button>
                </div>
              )}

              {step === 'processing' && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-gray-400">{t('processingPayment') || 'Processing payment...'}</p>
                </div>
              )}

              {step === 'success' && (
                <div className="py-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    <Check size={40} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">{t('paymentSuccess') || 'Payment Successful!'}</h4>
                    <p className="text-gray-400 text-sm">
                      {t('welcomePro') || 'Welcome to Ruwad Pro. Your features are now unlocked.'}
                    </p>
                  </div>
                  <button
                    onClick={reset}
                    className="w-full py-4 rounded-xl bg-[#FFD700] text-black font-bold hover:bg-[#FFC000] transition-colors"
                  >
                    {t('continueToDashboard') || 'Continue to Dashboard'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
