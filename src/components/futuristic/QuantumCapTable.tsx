import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Network, TrendingDown, DollarSign, GitBranch, Zap, AlertCircle } from 'lucide-react';

export const QuantumCapTable = () => {
  const [activeScenario, setActiveScenario] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulated Monte Carlo scenarios for startup funding
  const scenarios = [
    {
      id: 0,
      name: 'مسار النمو الطبيعي (Base Case)',
      probability: '65%',
      color: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/50',
      rounds: [
        { name: 'التأسيس (Founders)', valuation: '1M', dilution: 0, founderShare: 100, investorShare: 0 },
        { name: 'جولة ما قبل البذرة (Pre-Seed)', valuation: '3M', dilution: 15, founderShare: 85, investorShare: 15 },
        { name: 'جولة البذرة (Seed)', valuation: '10M', dilution: 20, founderShare: 68, investorShare: 32 },
        { name: 'الجولة أ (Series A)', valuation: '30M', dilution: 20, founderShare: 54.4, investorShare: 45.6 },
        { name: 'التخارج (Exit)', valuation: '100M', dilution: 0, founderShare: 54.4, investorShare: 45.6, founderValue: '54.4M' },
      ]
    },
    {
      id: 1,
      name: 'مسار النمو الفائق (Unicorn Trajectory)',
      probability: '5%',
      color: 'from-[#FFD700] to-orange-500',
      shadow: 'shadow-[#FFD700]/50',
      rounds: [
        { name: 'التأسيس (Founders)', valuation: '2M', dilution: 0, founderShare: 100, investorShare: 0 },
        { name: 'جولة البذرة (Seed)', valuation: '15M', dilution: 15, founderShare: 85, investorShare: 15 },
        { name: 'الجولة أ (Series A)', valuation: '60M', dilution: 15, founderShare: 72.2, investorShare: 27.8 },
        { name: 'الجولة ب (Series B)', valuation: '200M', dilution: 10, founderShare: 65, investorShare: 35 },
        { name: 'الاكتتاب العام (IPO)', valuation: '1B+', dilution: 10, founderShare: 58.5, investorShare: 41.5, founderValue: '585M' },
      ]
    },
    {
      id: 2,
      name: 'مسار الشتاء الاستثماري (Down Round)',
      probability: '30%',
      color: 'from-red-500 to-pink-500',
      shadow: 'shadow-red-500/50',
      rounds: [
        { name: 'التأسيس (Founders)', valuation: '1M', dilution: 0, founderShare: 100, investorShare: 0 },
        { name: 'جولة البذرة (Seed)', valuation: '5M', dilution: 25, founderShare: 75, investorShare: 25 },
        { name: 'جولة إنقاذ (Bridge)', valuation: '3M', dilution: 40, founderShare: 45, investorShare: 55 },
        { name: 'استحواذ مبكر (Acquisition)', valuation: '10M', dilution: 0, founderShare: 45, investorShare: 55, founderValue: '4.5M' },
      ]
    }
  ];

  const currentData = scenarios[activeScenario];

  const handleSimulate = (index: number) => {
    setIsSimulating(true);
    setTimeout(() => {
      setActiveScenario(index);
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="bg-[#0B0C0E] border border-white/10 rounded-3xl p-6 relative overflow-hidden font-mono">
      {/* Quantum Grid Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[size:20px_20px]" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="text-cyan-400" />
            جدول الحصص الكمّي (Quantum Cap Table)
          </h3>
          <p className="text-gray-400 text-sm mt-1">محاكاة مونت كارلو (Monte Carlo) لمسارات التمويل والتخفيف (Dilution)</p>
        </div>
        <div className="flex gap-2 bg-black/50 p-1 rounded-xl border border-white/10">
          {scenarios.map((scenario, idx) => (
            <button
              key={scenario.id}
              onClick={() => handleSimulate(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeScenario === idx 
                  ? `bg-gradient-to-r ${scenario.color} text-black shadow-[0_0_10px_rgba(255,255,255,0.2)]` 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {scenario.name.split(' ')[0]} {scenario.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500 border-b border-white/10 pb-2">
          <span className="w-1/3">الجولة التمويلية</span>
          <span className="w-1/6 text-center">التقييم</span>
          <span className="w-1/6 text-center">التخفيف</span>
          <span className="w-1/3 text-left">توزيع الحصص (مؤسس / مستثمر)</span>
        </div>

        <div className="space-y-4 relative">
          {/* Connecting Line */}
          <div className="absolute right-[16%] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          {currentData.rounds.map((round, idx) => (
            <motion.div 
              key={`${activeScenario}-${idx}`}
              initial={{ opacity: 0, x: isSimulating ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15, type: 'spring' }}
              className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors relative group"
            >
              <div className="w-1/3 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentData.color} ${currentData.shadow} z-10`} />
                <span className="text-white font-bold text-sm">{round.name}</span>
              </div>
              
              <div className="w-1/6 text-center text-cyan-400 font-bold">
                ${round.valuation}
              </div>
              
              <div className="w-1/6 text-center text-red-400 text-xs flex items-center justify-center gap-1">
                {round.dilution > 0 ? <><TrendingDown size={12} /> -{round.dilution}%</> : '-'}
              </div>
              
              <div className="w-1/3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${round.founderShare}%` }}
                    transition={{ delay: 0.5 + (idx * 0.1), duration: 1 }}
                    className={`h-full bg-gradient-to-r ${currentData.color}`} 
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${round.investorShare}%` }}
                    transition={{ delay: 0.5 + (idx * 0.1), duration: 1 }}
                    className="h-full bg-gray-600" 
                  />
                </div>
                <span className="text-xs text-white w-12 text-left">{round.founderShare.toFixed(1)}%</span>
              </div>

              {/* Exit Value Tooltip */}
              {round.founderValue && (
                <div className="absolute left-0 -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 text-white text-xs py-1 px-3 rounded-lg flex items-center gap-1 shadow-xl pointer-events-none z-20">
                  <DollarSign size={12} className="text-green-400" />
                  قيمة حصة المؤسس: <span className="font-bold text-green-400">${round.founderValue}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-black/40 border border-white/10 rounded-xl flex items-start gap-3">
          <GitBranch className="text-cyan-400 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-white text-sm font-bold mb-1">تحليل الاحتمالات (Probability Analysis)</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              احتمالية حدوث هذا المسار هي <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentData.color}`}>{currentData.probability}</span> بناءً على ظروف السوق الحالية للقطاع. 
              {activeScenario === 2 && ' تحذير: هذا المسار يؤدي إلى فقدان السيطرة على الشركة (Founder Cram-down).'}
              {activeScenario === 1 && ' ملاحظة: يتطلب هذا المسار معدل نمو شهري (CMGR) لا يقل عن 20%.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
