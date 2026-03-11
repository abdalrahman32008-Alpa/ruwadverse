import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Zap, Download, RefreshCw, Cpu, Database } from 'lucide-react';

export const NeuralPitchDeck = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const generateDeck = () => {
    setIsGenerating(true);
    setProgress(0);
    setIsComplete(false);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setIsComplete(true);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 500);
  };

  const slides = [
    { title: 'The Problem', type: 'Problem Statement', color: 'from-red-500/20 to-transparent' },
    { title: 'The Solution', type: 'Product Demo', color: 'from-blue-500/20 to-transparent' },
    { title: 'Market Size', type: 'TAM/SAM/SOM', color: 'from-green-500/20 to-transparent' },
    { title: 'Business Model', type: 'Revenue Streams', color: 'from-purple-500/20 to-transparent' },
    { title: 'Traction', type: 'Metrics & Growth', color: 'from-[#FFD700]/20 to-transparent' },
  ];

  return (
    <div className="bg-[#0B0C0E] border border-white/10 rounded-3xl p-6 relative overflow-hidden mt-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B0C0E] to-[#0B0C0E] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="text-blue-400" />
            المولد العصبي للعروض (Neural Pitch Deck)
          </h3>
          <p className="text-gray-400 text-sm mt-1">توليد عرض تقديمي ثلاثي الأبعاد باستخدام الذكاء الاصطناعي التوليدي</p>
        </div>
        
        {!isGenerating && !isComplete && (
          <button 
            onClick={generateDeck}
            className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Zap size={16} />
            توليد العرض الآن
          </button>
        )}
      </div>

      <div className="relative z-10 min-h-[200px] flex flex-col items-center justify-center">
        {!isGenerating && !isComplete && (
          <div className="text-center text-gray-500">
            <Cpu size={48} className="mx-auto mb-4 opacity-50" />
            <p>اضغط على "توليد العرض" لإنشاء شرائح مخصصة لمشروعك</p>
          </div>
        )}

        {isGenerating && (
          <div className="w-full max-w-md text-center">
            <div className="flex items-center justify-center gap-4 mb-6 text-blue-400">
              <RefreshCw className="animate-spin" size={32} />
              <Database className="animate-pulse" size={32} />
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 font-mono">
              {progress < 30 ? 'Analyzing Market Data...' : progress < 60 ? 'Generating 3D Assets...' : progress < 90 ? 'Structuring Narrative...' : 'Finalizing Deck...'} {progress}%
            </p>
          </div>
        )}

        {isComplete && (
          <div className="w-full">
            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x">
              <AnimatePresence>
                {slides.map((slide, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: i * 0.15, type: 'spring', damping: 15 }}
                    className={`min-w-[240px] h-40 rounded-2xl border border-white/10 bg-gradient-to-br ${slide.color} p-4 flex flex-col justify-between snap-center group cursor-pointer hover:border-white/30 transition-colors relative overflow-hidden`}
                    style={{ transformPerspective: 1000 }}
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <div className="text-xs text-gray-400 mb-1 font-mono">Slide {i + 1}</div>
                      <h4 className="text-white font-bold text-lg">{slide.title}</h4>
                    </div>
                    <div className="text-xs text-blue-300/70 bg-blue-900/30 px-2 py-1 rounded w-fit border border-blue-500/20">
                      {slide.type}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center mt-4">
              <button className="bg-blue-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                <Download size={18} />
                تحميل كـ 3D Presentation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
