import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Mic, Image as ImageIcon, Video, FileSearch, Globe, Presentation } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { VoiceInterface } from './VoiceInterface';
import { BrandStudio } from './BrandStudio';
import { PromoVideo } from './PromoVideo';
import { PitchAnalyzer } from './PitchAnalyzer';
import { MarketAnalysisTool } from './MarketAnalysisTool';
import { PitchDeckGenerator } from './PitchDeckGenerator';

export const RaedStudio = ({ initialMessage }: { initialMessage?: string }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'brand' | 'video' | 'analyze' | 'market' | 'deck'>('chat');

  const tabs = [
    { id: 'chat', label: 'المستشار الذكي', icon: MessageSquare },
    { id: 'voice', label: 'المدرب الصوتي', icon: Mic },
    { id: 'brand', label: 'استوديو الهوية', icon: ImageIcon },
    { id: 'video', label: 'فيديو ترويجي', icon: Video },
    { id: 'analyze', label: 'تحليل العروض', icon: FileSearch },
    { id: 'market', label: 'تحليل السوق', icon: Globe },
    { id: 'deck', label: 'منشئ العروض', icon: Presentation },
  ];

  return (
    <div className="flex flex-col h-full bg-[#141517] rounded-3xl border border-white/5 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-white/5 bg-[#0B0C0E]/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors relative ${
              activeTab === tab.id ? 'text-[#FFD700]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD700]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'chat' && <ChatInterface initialMessage={initialMessage} />}
            {activeTab === 'voice' && <VoiceInterface />}
            {activeTab === 'brand' && <BrandStudio />}
            {activeTab === 'video' && <PromoVideo />}
            {activeTab === 'analyze' && <PitchAnalyzer />}
            {activeTab === 'market' && <MarketAnalysisTool />}
            {activeTab === 'deck' && <PitchDeckGenerator />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
