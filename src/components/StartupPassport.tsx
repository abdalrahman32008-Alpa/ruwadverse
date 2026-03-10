import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Download, Share2, Sparkles, Trophy, Target, Activity, Globe } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';

interface StartupPassportProps {
  idea: {
    title: string;
    sector: string;
    stage: string;
    raed_score: number;
    author_name?: string;
  };
}

export const StartupPassport = ({ idea }: StartupPassportProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0B0C0E',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `ruwadverse-passport-${idea.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('تم تحميل جواز سفر الشركة الناشئة بنجاح!');
    } catch (error) {
      console.error('Error generating card:', error);
      toast.error('حدث خطأ أثناء تحميل البطاقة');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `مشروعي على Ruwadverse: ${idea.title}`,
          text: `تحقق من مشروعي الجديد وحصلت على تقييم رائد: ${idea.raed_score}/100!`,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ رابط المشروع للمشاركة');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Globe size={20} className="text-[#FFD700]" />
          جواز سفر الشركة الناشئة (Startup Passport)
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={downloadCard}
            disabled={isGenerating}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all disabled:opacity-50"
            title="تحميل كصورة"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={shareCard}
            className="p-2 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 rounded-lg text-[#FFD700] transition-all"
            title="مشاركة"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* The Visual Card */}
      <div className="relative group">
        <div 
          ref={cardRef}
          className="w-full aspect-[1.6/1] bg-[#0B0C0E] border-2 border-[#FFD700]/30 rounded-3xl p-8 overflow-hidden relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#FFD700,transparent)]" />
            <div className="grid grid-cols-12 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-r border-white/10 h-full" />
              ))}
            </div>
          </div>

          {/* Card Content */}
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-[#FFD700]" />
                  <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest">RUWADVERSE PASSPORT</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">{idea.title}</h2>
                <p className="text-sm text-gray-400">{idea.sector} • {idea.stage}</p>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFC000] rounded-2xl flex items-center justify-center text-black shadow-lg shadow-[#FFD700]/20">
                  <Trophy size={32} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Activity size={12} />
                  <span className="text-[10px] font-bold">RAED SCORE</span>
                </div>
                <div className="text-2xl font-bold text-[#FFD700]">{idea.raed_score}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Target size={12} />
                  <span className="text-[10px] font-bold">STATUS</span>
                </div>
                <div className="text-sm font-bold text-white">Verified Idea</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Globe size={12} />
                  <span className="text-[10px] font-bold">REGION</span>
                </div>
                <div className="text-sm font-bold text-white">MENA Region</div>
              </div>
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {idea.author_name?.[0] || 'R'}
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">FOUNDER</div>
                  <div className="text-xs font-bold text-white">{idea.author_name || 'Ruwadverse Member'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500">PLATFORM</div>
                <div className="text-xs font-bold text-[#FFD700]">ruwadverse.com</div>
              </div>
            </div>
          </div>
          
          {/* Holographic Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 pointer-events-none" />
        </div>
        
        {/* Hover Hint */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl pointer-events-none">
          <div className="text-center">
            <Download className="mx-auto mb-2 text-[#FFD700]" size={32} />
            <p className="text-sm font-bold text-white">انقر للتحميل والمشاركة</p>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 text-center leading-relaxed">
        شارك "جواز سفر" مشروعك على LinkedIn أو Twitter لجذب المستثمرين والشركاء. 
        هذه البطاقة تظهر احترافيتك وتقييم RAED الذكي لمشروعك.
      </p>
    </div>
  );
};
