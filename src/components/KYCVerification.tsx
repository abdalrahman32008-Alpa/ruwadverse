import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Check, AlertCircle, Shield, Upload, X } from 'lucide-react';

export const KYCVerification = ({ onComplete }: { onComplete: () => void }) => {
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
      setError("يرجى السماح بالوصول للكاميرا للمتابعة");
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
            التحقق من الهوية (KYC)
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
                  لضمان بيئة آمنة وموثوقة لجميع المستثمرين ورواد الأعمال، نطلب منك إكمال عملية التحقق من الهوية. هذه العملية تستغرق دقيقتين فقط.
                </p>
                <ul className="space-y-3 mb-8 text-sm text-gray-400">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> السن يجب أن يكون 18 سنة أو أكثر</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> وثيقة هوية سارية المفعول</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> كاميرا تعمل بشكل جيد</li>
                </ul>
                <div className="bg-[#FFD700]/5 border border-[#FFD700]/10 p-4 rounded-xl mb-6 flex gap-3 items-start">
                  <Shield className="text-[#FFD700] shrink-0 mt-1" size={18} />
                  <p className="text-xs text-[#FFD700]">بياناتك محمية بتشفير كامل ولن تُشارك مع أي طرف ثالث.</p>
                </div>
                <button onClick={handleStart} className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-colors">
                  ابدأ التحقق الآن
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="document" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold text-white mb-4">المرحلة ١: رفع وثيقة الهوية</h3>
                
                <div className="space-y-4 mb-6">
                  <label className="block text-sm text-gray-400 mb-1">نوع الوثيقة</label>
                  <select 
                    value={documentType} 
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700] outline-none"
                  >
                    <option value="national_id">البطاقة الشخصية المصرية</option>
                    <option value="passport">جواز السفر</option>
                    <option value="driving_license">رخصة القيادة</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#FFD700]/50 transition-colors cursor-pointer bg-white/5">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-300 font-medium">صورة الوجه الأمامي</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF (Max 5MB)</p>
                  </div>
                  {documentType === 'national_id' && (
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#FFD700]/50 transition-colors cursor-pointer bg-white/5">
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-300 font-medium">صورة الظهر</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleDocumentUpload} 
                  disabled={isVerifying}
                  className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isVerifying ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span> : 'متابعة'}
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="liveness" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold text-white mb-4">المرحلة ٢: التحقق من الوجه</h3>
                
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 border border-white/10">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-64 border-2 border-[#FFD700] rounded-full opacity-50 animate-pulse" />
                  </div>
                  {isVerifying && (
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="bg-black/50 px-3 py-1 rounded-full text-xs text-[#FFD700]">جاري التحقق من الهوية...</span>
                    </div>
                  )}
                </div>

                <div className="bg-white/5 p-4 rounded-xl mb-6 text-sm text-gray-300 space-y-2">
                  <p>• أمسك بطاقة هويتك بجانب وجهك وانظر للكاميرا</p>
                  <p>• تأكد من وضوح وجهك والبطاقة معاً</p>
                  <p>• الإضاءة يجب أن تكون جيدة</p>
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
                  {isVerifying ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span> : 'التقاط وتحقق'}
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                  <Check size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">تم التحقق بنجاح!</h3>
                <p className="text-gray-400 mb-8">
                  تم توثيق حسابك بنجاح. ستظهر شارة التوثيق الذهبية على ملفك الشخصي فوراً.
                </p>
                <button 
                  onClick={onComplete}
                  className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-colors"
                >
                  العودة للمنصة
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
