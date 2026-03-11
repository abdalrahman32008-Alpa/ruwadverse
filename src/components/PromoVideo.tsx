import React, { useState, useRef } from 'react';
import { generateVideo } from '../services/raed';
import { Video, Upload, Loader2, Play, Download, Sparkles } from 'lucide-react';

export const PromoVideo = () => {
  const [prompt, setPrompt] = useState('');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        setBase64Image(base64);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !base64Image || !mimeType) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateVideo(prompt, base64Image, mimeType, aspectRatio);
      if (result) {
        setGeneratedVideoUrl(result);
      } else {
        setError('فشل توليد الفيديو. يرجى المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 bg-[#0B0C0E] border-l border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="text-[#FFD700]" size={20} />
            فيديو ترويجي
          </h3>
          <p className="text-sm text-gray-400">
            ارفع صورة لمنتجك أو شعارك، وسيقوم RAED AI بتحويلها إلى فيديو ترويجي مذهل.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">الصورة المرجعية</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                base64Image ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-white/20 hover:border-white/40 bg-white/5'
              }`}
            >
              {base64Image ? (
                <div className="relative w-full h-full p-2">
                  <img src={`data:${mimeType};base64,${base64Image}`} alt="Reference" className="w-full h-full object-contain rounded-lg" />
                </div>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">اضغط لرفع صورة</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">وصف الحركة (Prompt)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="مثال: المنتج يطفو في الفضاء مع إضاءة سينمائية وحركة بطيئة..."
              className="w-full bg-[#141517] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 min-h-[100px] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">الأبعاد</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '16:9', label: 'أفقي (يوتيوب)' },
                { id: '9:16', label: 'عمودي (تيك توك)' }
              ].map(ratio => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id as any)}
                  className={`py-2 rounded-lg text-xs transition-colors border ${
                    aspectRatio === ratio.id 
                      ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' 
                      : 'bg-[#141517] border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || !base64Image || isGenerating}
          className="mt-auto w-full bg-[#FFD700] text-black py-3 rounded-xl font-bold hover:bg-[#FFC000] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#FFD700]/20 flex items-center justify-center gap-2"
        >
          {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Video size={20} />}
          {isGenerating ? 'جاري التوليد (قد يستغرق دقائق)...' : 'توليد الفيديو'}
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-[#141517] p-8 flex items-center justify-center relative">
        {error && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm z-10">
            {error}
          </div>
        )}

        {generatedVideoUrl ? (
          <div className="relative group max-w-full max-h-full flex items-center justify-center w-full h-full">
            <video 
              src={generatedVideoUrl} 
              controls 
              autoPlay 
              loop
              className="max-w-full max-h-[calc(100vh-250px)] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Play size={40} className="opacity-50" />
            </div>
            <p>سيتم عرض الفيديو الترويجي هنا</p>
            {isGenerating && (
              <p className="text-xs text-[#FFD700] animate-pulse max-w-xs mt-2">
                توليد الفيديو يتطلب قوة حوسبة عالية وقد يستغرق بضع دقائق. يرجى الانتظار...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
