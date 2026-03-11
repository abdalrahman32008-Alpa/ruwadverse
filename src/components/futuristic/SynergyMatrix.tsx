import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Sparkles, Zap } from 'lucide-react';

interface SynergyMatrixProps {
  matchScore: number;
  dimensions: {
    vision: number;
    execution: number;
    riskTolerance: number;
    techStack: number;
    culture: number;
  };
}

export const SynergyMatrix: React.FC<SynergyMatrixProps> = ({ matchScore, dimensions }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(matchScore), 500);
    return () => clearTimeout(timer);
  }, [matchScore]);

  // Points for a pentagon radar chart
  const getPoints = (scale: number = 1) => {
    const { vision, execution, riskTolerance, techStack, culture } = dimensions;
    const values = [vision, execution, riskTolerance, techStack, culture];
    
    return values.map((val, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const radius = 50 * (val / 100) * scale;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  const getBasePoints = () => {
    return [100, 100, 100, 100, 100].map((val, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const radius = 50 * (val / 100);
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="bg-[#0B0C0E] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="text-[#FFD700]" />
            التوافق العصبي (Neural Synergy)
          </h3>
          <p className="text-gray-400 text-sm mt-1">تحليل ذكاء اصطناعي لمدى توافقك مع هذا المشروع</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[#FFD700] flex items-center gap-1 justify-end">
            {animatedScore}% <Sparkles size={20} className="animate-pulse" />
          </div>
          <p className="text-xs text-green-400">توافق عالي جداً</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Radar Chart */}
        <div className="w-48 h-48 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* Base Grid */}
            {[20, 40, 60, 80, 100].map((r) => (
              <polygon
                key={r}
                points={getBasePoints().split(' ').map(p => {
                  const [x, y] = p.split(',').map(Number);
                  return `${50 + (x - 50) * (r / 100)},${50 + (y - 50) * (r / 100)}`;
                }).join(' ')}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            ))}
            
            {/* Axes */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
              return (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 50 * Math.cos(angle)}
                  y2={50 + 50 * Math.sin(angle)}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Data Polygon */}
            <motion.polygon
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
              points={getPoints()}
              fill="rgba(255, 215, 0, 0.2)"
              stroke="#FFD700"
              strokeWidth="1.5"
              className="drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
            />
          </svg>
          
          {/* Labels */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap">الرؤية</div>
          <div className="absolute top-1/3 -right-6 text-[10px] text-gray-400 whitespace-nowrap">التنفيذ</div>
          <div className="absolute bottom-4 -right-4 text-[10px] text-gray-400 whitespace-nowrap">المخاطرة</div>
          <div className="absolute bottom-4 -left-4 text-[10px] text-gray-400 whitespace-nowrap">التقنية</div>
          <div className="absolute top-1/3 -left-6 text-[10px] text-gray-400 whitespace-nowrap">الثقافة</div>
        </div>

        {/* Dimension Details */}
        <div className="flex-1 w-full space-y-4">
          {[
            { label: 'توافق الرؤية (Vision)', value: dimensions.vision, color: 'bg-blue-500' },
            { label: 'القدرة على التنفيذ (Execution)', value: dimensions.execution, color: 'bg-green-500' },
            { label: 'تحمل المخاطر (Risk Tolerance)', value: dimensions.riskTolerance, color: 'bg-red-500' },
            { label: 'التكامل التقني (Tech Stack)', value: dimensions.techStack, color: 'bg-purple-500' },
            { label: 'الثقافة العملية (Culture)', value: dimensions.culture, color: 'bg-[#FFD700]' },
          ].map((dim, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">{dim.label}</span>
                <span className="text-white font-mono">{dim.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.value}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className={`h-full ${dim.color} shadow-[0_0_10px_currentColor]`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
