import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Share2, Copy, Check, Twitter, Linkedin, Instagram, Loader2, Megaphone } from 'lucide-react';
import { generateMarketingContent } from '../services/raed';
import { toast } from 'react-hot-toast';

interface MarketingKitProps {
  idea: {
    title: string;
    description: string;
    sector: string;
  };
}

export const MarketingKit = ({ idea }: MarketingKitProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<{
    linkedin: string;
    twitter: string;
    instagram: string;
  } | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateMarketingContent(idea.title, idea.description, idea.sector);
      if (result) {
        setContent(result);
        toast.success('تم توليد المحتوى التسويقي بنجاح!');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء توليد المحتوى');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast.success('تم النسخ للحافظة');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-600/10' },
    { id: 'twitter', name: 'X / Twitter', icon: Twitter, color: 'text-white', bg: 'bg-white/10' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Megaphone size={20} className="text-[#FFD700]" />
          حقيبة التسويق الذكية (Marketing Kit)
        </h3>
        {!content && (
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black rounded-xl font-bold hover:bg-[#FFC000] transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            توليد محتوى إبداعي
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {content ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4"
          >
            {platforms.map((platform) => (
              <div key={platform.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${platform.bg} ${platform.color}`}>
                      <platform.icon size={16} />
                    </div>
                    <span className="font-bold text-sm">{platform.name}</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(content[platform.id as keyof typeof content], platform.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    {copiedType === platform.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {content[platform.id as keyof typeof content]}
                </p>
              </div>
            ))}
            <button 
              onClick={() => setContent(null)}
              className="text-xs text-gray-500 hover:text-white transition-colors text-center mt-2"
            >
              إعادة التوليد
            </button>
          </motion.div>
        ) : (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-10 text-center">
            <Sparkles size={40} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-sm mb-6">
              دع RAED AI يكتب لك منشورات احترافية لمشروعك لتجذب انتباه المستثمرين على منصات التواصل الاجتماعي.
            </p>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2 mx-auto"
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              ابدأ الآن
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
