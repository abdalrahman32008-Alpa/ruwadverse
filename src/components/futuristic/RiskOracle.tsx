import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, AlertOctagon, ShieldAlert, Skull, Activity, ShieldCheck, Database, BarChart3 } from 'lucide-react';

export const RiskOracle = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [survivalRate, setSurvivalRate] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      setSurvivalRate(79); // 79% AUC-ROC
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      id: 1,
      title: 'الكثافة الجغرافية (Geographic Density)',
      value: 'مرتفعة',
      impact: 'Positive',
      shap: '+12.4%'
    },
    {
      id: 2,
      title: 'فئة الصناعة (Industry Category)',
      value: 'FinTech',
      impact: 'Positive',
      shap: '+8.1%'
    },
    {
      id: 3,
      title: 'الحقبة الاقتصادية (Economic Era)',
      value: 'Post-2024',
      impact: 'Neutral',
      shap: '-1.2%'
    }
  ];

  return (
    <div className="bg-[#0B0C0E] border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden group">
      {/* Oracle Eye Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,_rgba(59,130,246,0.1)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="text-blue-500" />
            التنبؤ الآلي بالنجاح (Automated Due Diligence)
          </h3>
          <p className="text-gray-400 text-sm mt-1">نماذج XGBoost مُدربة على +50K مجموعة بيانات من Crunchbase</p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-500 flex items-center gap-1 justify-end font-mono">
            {isScanning ? (
              <span className="animate-pulse">--%</span>
            ) : (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{survivalRate}%</motion.span>
            )}
          </div>
          <p className="text-xs text-gray-400">AUC-ROC Score</p>
        </div>
      </div>

      <div className="relative z-10">
        {isScanning ? (
          <div className="h-64 flex flex-col items-center justify-center text-blue-500/50">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4"
            >
              <BarChart3 size={64} />
            </motion.div>
            <p className="font-mono text-sm tracking-widest">ANALYZING 22 FEATURES VIA FASTAPI...</p>
            <div className="w-48 h-1 bg-blue-500/20 rounded-full mt-4 overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 mb-6 text-sm text-blue-400 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <Activity size={16} />
              <span>تم إنشاء تنبؤات لحظية مع قابلية التفسير (SHAP explainability) بنجاح.</span>
            </div>

            {features.map((feature, idx) => (
              <motion.div 
                key={feature.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-black/40 border border-white/5 p-4 rounded-xl hover:border-blue-500/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{feature.title}</span>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">{feature.value}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${feature.impact === 'Positive' ? 'text-green-400' : feature.impact === 'Neutral' ? 'text-gray-400' : 'text-red-400'}`}>
                    SHAP: {feature.shap}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
