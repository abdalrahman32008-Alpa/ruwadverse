import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, AlertOctagon, ShieldAlert, Skull, Activity, ShieldCheck } from 'lucide-react';

export const RiskOracle = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [survivalRate, setSurvivalRate] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      setSurvivalRate(38); // 38% survival rate
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const threats = [
    {
      id: 1,
      title: 'تشبع السوق (Market Saturation)',
      severity: 'high',
      probability: '85%',
      impact: 'فشل في الاستحواذ على العملاء (CAC > LTV)',
      mitigation: 'التركيز على شريحة متخصصة جداً (Niche Down) بدلاً من السوق العام.'
    },
    {
      id: 2,
      title: 'مخاطر تنفيذية (Execution Risk)',
      severity: 'medium',
      probability: '60%',
      impact: 'تأخر الإطلاق ونفاد السيولة (Runway Depletion)',
      mitigation: 'تقليل ميزات الـ MVP إلى 20% وإطلاق نسخة تجريبية خلال 30 يوماً.'
    },
    {
      id: 3,
      title: 'تغيرات تنظيمية (Regulatory Shifts)',
      severity: 'low',
      probability: '25%',
      impact: 'غرامات أو إيقاف الخدمة',
      mitigation: 'التعاقد مع مستشار قانوني متخصص في التقنية المالية قبل الإطلاق.'
    }
  ];

  return (
    <div className="bg-[#0B0C0E] border border-red-500/20 rounded-3xl p-6 relative overflow-hidden group">
      {/* Oracle Eye Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,_rgba(239,68,68,0.1)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="text-red-500" />
            عراف المخاطر (Risk Oracle)
          </h3>
          <p className="text-gray-400 text-sm mt-1">تحليل استباقي لأسباب الفشل المحتملة (Pre-Mortem Analysis)</p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-red-500 flex items-center gap-1 justify-end font-mono">
            {isScanning ? (
              <span className="animate-pulse">--%</span>
            ) : (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{survivalRate}%</motion.span>
            )}
          </div>
          <p className="text-xs text-gray-400">احتمالية النجاة (Year 3)</p>
        </div>
      </div>

      <div className="relative z-10">
        {isScanning ? (
          <div className="h-64 flex flex-col items-center justify-center text-red-500/50">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4"
            >
              <Eye size={64} />
            </motion.div>
            <p className="font-mono text-sm tracking-widest">SCANNING MULTIVERSE TIMELINES...</p>
            <div className="w-48 h-1 bg-red-500/20 rounded-full mt-4 overflow-hidden">
              <motion.div 
                className="h-full bg-red-500"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 mb-6 text-sm text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              <Skull size={16} />
              <span>تم رصد 3 تهديدات قاتلة (Lethal Threats) في مسار هذا المشروع.</span>
            </div>

            {threats.map((threat, idx) => (
              <motion.div 
                key={threat.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="bg-black/40 border border-white/5 rounded-xl p-4 hover:border-red-500/30 transition-colors relative overflow-hidden"
              >
                <div className={`absolute right-0 top-0 bottom-0 w-1 ${
                  threat.severity === 'high' ? 'bg-red-500' : 
                  threat.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                }`} />
                
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold flex items-center gap-2">
                    <AlertOctagon size={16} className={
                      threat.severity === 'high' ? 'text-red-500' : 
                      threat.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                    } />
                    {threat.title}
                  </h4>
                  <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                    احتمالية: {threat.probability}
                  </span>
                </div>
                
                <div className="space-y-2 mt-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Activity size={14} className="text-gray-500 mt-0.5 shrink-0" />
                    <p className="text-gray-400"><span className="text-gray-500">الأثر:</span> {threat.impact}</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                    <ShieldCheck size={14} className="text-green-500 mt-0.5 shrink-0" />
                    <p className="text-green-400/80"><span className="text-green-500 font-bold">استراتيجية النجاة:</span> {threat.mitigation}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
