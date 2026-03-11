import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Check, AlertCircle, Shield, Upload, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const KYCVerification = ({ onComplete }: { onComplete: () => void }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0); // 0: Start, 1: Document, 2: Liveness, 3: Result
  const [documentType, setDocumentType] = useState('national_id');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => setStep(1);

  const handleDocumentUpload = () => {
    // Simulate upload
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
    }, 2000);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setError(t('kycCameraError'));
    }
  };

  const handleLivenessCheck = () => {
    setIsVerifying(true);
    // Simulate AI check
    setTimeout(() => {
      setIsVerifying(false);
      // Stop camera
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      setStep(3);
    }, 3000);
  };

  useEffect(() => {
    if (step === 2) {
      startCamera();
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#141517] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="text-[#FFD700]" size={24} />
            {t('kycTitle')}
          </h2>
          <button onClick={onComplete} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('kycDesc')}
                </p>
                <ul className="space-y-3 mb-8 text-sm text-gray-400">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> {t('kycAgeRequirement')}</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> {t('kycIdRequirement')}</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> {t('kycCameraRequirement')}</li>
                </ul>
                <div className="bg-[#FFD700]/5 border border-[#FFD700]/10 p-4 rounded-xl mb-6 flex gap-3 items-start">
                  <Shield className="text-[#FFD700] shrink-0 mt-1" size={18} />
                  <p className="text-xs text-[#FFD700]">{t('kycPrivacyNote')}</p>
                </div>
                <button onClick={handleStart} className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-colors">
                  {t('kycStartBtn')}
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="document" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold text-white mb-4">{t('kycStep1Title')}</h3>
                
                <div className="space-y-4 mb-6">
                  <label className="block text-sm text-gray-400 mb-1">{t('kycDocTypeLabel')}</label>
                  <select 
                    value={documentType} 
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700] outline-none"
                  >
                    <option value="national_id">{t('kycNationalId')}</option>
                    <option value="passport">{t('kycPassport')}</option>
                    <option value="driving_license">{t('kycDrivingLicense')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#FFD700]/50 transition-colors cursor-pointer bg-white/5">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-300 font-medium">{t('kycFrontPhoto')}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('kycUploadNote')}</p>
                  </div>
                  {documentType === 'national_id' && (
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#FFD700]/50 transition-colors cursor-pointer bg-white/5">
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-300 font-medium">{t('kycBackPhoto')}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('kycUploadNote')}</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleDocumentUpload} 
                  disabled={isVerifying}
                  className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isVerifying ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span> : t('kycContinue')}
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="liveness" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold text-white mb-4">{t('kycStep2Title')}</h3>
                
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 border border-white/10">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-64 border-2 border-[#FFD700] rounded-full opacity-50 animate-pulse" />
                  </div>
                  {isVerifying && (
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="bg-black/50 px-3 py-1 rounded-full text-xs text-[#FFD700]">{t('kycVerifyingFace')}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white/5 p-4 rounded-xl mb-6 text-sm text-gray-300 space-y-2">
                  <p>{t('kycLivenessNote1')}</p>
                  <p>{t('kycLivenessNote2')}</p>
                  <p>{t('kycLivenessNote3')}</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button 
                  onClick={handleLivenessCheck}
                  disabled={isVerifying}
                  className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isVerifying ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span> : t('kycCaptureBtn')}
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                  <Check size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('kycSuccessTitle')}</h3>
                <p className="text-gray-400 mb-8">
                  {t('kycSuccessDesc')}
                </p>
                <button 
                  onClick={onComplete}
                  className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-colors"
                >
                  {t('kycBackToPlatform')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
