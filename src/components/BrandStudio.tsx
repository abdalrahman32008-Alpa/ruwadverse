import React, { useState } from 'react';
import { generateImage } from '../services/raed';
import { Image as ImageIcon, Loader2, Download, Sparkles, Layout } from 'lucide-react';

export const BrandStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [size, setSize] = useState('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateImage(prompt, aspectRatio, size);
      if (result) {
        setGeneratedImage(result);
      } else {
        setError('فشل توليد الصورة. يرجى المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `ruwad-brand-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 bg-[#0B0C0E] border-l border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="text-[#FFD700]" size={20} />
            استوديو الهوية
          </h3>
          <p className="text-sm text-gray-400">
            صمم شعاراً، أو نموذجاً مبدئياً، أو هوية بصرية لمشروعك باستخدام الذكاء الاصطناعي.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">وصف الصورة</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="مثال: شعار حديث وبسيط لتطبيق توصيل طعام صحي، ألوان خضراء وبرتقالية، تصميم مسطح..."
              className="w-full bg-[#141517] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 min-h-[120px] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">الأبعاد (Aspect Ratio)</label>
            <div className="grid grid-cols-3 gap-2">
              {['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'].map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 rounded-lg text-xs font-mono transition-colors border ${
                    aspectRatio === ratio 
                      ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' 
                      : 'bg-[#141517] border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">الجودة (Resolution)</label>
            <div className="grid grid-cols-3 gap-2">
              {['1K', '2K', '4K'].map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-2 rounded-lg text-xs font-mono transition-colors border ${
                    size === s 
                      ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' 
                      : 'bg-[#141517] border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="mt-auto w-full bg-[#FFD700] text-black py-3 rounded-xl font-bold hover:bg-[#FFC000] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#FFD700]/20 flex items-center justify-center gap-2"
        >
          {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
          {isGenerating ? 'جاري التوليد...' : 'توليد الصورة'}
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-[#141517] p-8 flex items-center justify-center relative">
        {error && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm z-10">
            {error}
          </div>
        )}

        {generatedImage ? (
          <div className="relative group max-w-full max-h-full flex items-center justify-center">
            <img 
              src={generatedImage} 
              alt="Generated brand asset" 
              className="max-w-full max-h-[calc(100vh-250px)] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              <button 
                onClick={handleDownload}
                className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Download size={20} />
                تحميل الصورة
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Layout size={40} className="opacity-50" />
            </div>
            <p>سيتم عرض الصورة المولدة هنا</p>
          </div>
        )}
      </div>
    </div>
  );
};
