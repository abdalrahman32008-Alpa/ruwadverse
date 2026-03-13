import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, Lightbulb, CheckCircle, Layout, 
  Box, FlaskConical, TrendingUp, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { STARTUP_ROADMAP, RoadmapStage } from '../constants/roadmap';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap: Record<string, any> = {
  Search, Lightbulb, CheckCircle, Layout, 
  Box, FlaskConical, TrendingUp
};

interface StartupRoadmapProps {
  currentStageId: string;
  onStageSelect: (stageId: string) => void;
  completedStages: string[];
}

export const StartupRoadmap: React.FC<StartupRoadmapProps> = ({ 
  currentStageId, 
  onStageSelect,
  completedStages 
}) => {
  const { dir } = useLanguage();

  return (
    <div className="w-full py-8 overflow-x-auto no-scrollbar">
      <div className="flex items-start gap-4 min-w-max px-4">
        {STARTUP_ROADMAP.map((stage, index) => {
          const Icon = iconMap[stage.icon];
          const isActive = currentStageId === stage.id;
          const isCompleted = completedStages.includes(stage.id);
          const isLast = index === STARTUP_ROADMAP.length - 1;

          return (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center w-40 group">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onStageSelect(stage.id)}
                  className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isActive 
                      ? 'bg-[#FFD700] text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]' 
                      : isCompleted 
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                        : 'bg-white/5 text-gray-500 border border-white/10 hover:border-white/30'
                  }`}
                >
                  <Icon size={28} />
                  {isCompleted && !isActive && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                      <CheckCircle size={12} fill="currentColor" />
                    </div>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="active-glow"
                      className="absolute inset-0 rounded-2xl bg-[#FFD700] blur-xl opacity-20"
                    />
                  )}
                </motion.button>
                
                <div className="mt-4 text-center">
                  <span className={`text-xs font-bold block mb-1 transition-colors ${isActive ? 'text-[#FFD700]' : 'text-gray-500'}`}>
                    المرحلة {index + 1}
                  </span>
                  <span className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {stage.title}
                  </span>
                </div>
              </div>

              {!isLast && (
                <div className="mt-8 w-12 h-[2px] bg-white/10 relative">
                  <div 
                    className={`absolute inset-0 transition-all duration-700 ${isCompleted ? 'bg-green-500' : 'bg-transparent'}`} 
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
