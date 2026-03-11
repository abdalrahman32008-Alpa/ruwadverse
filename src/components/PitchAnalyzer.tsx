import React, { useState, useRef } from 'react';
import { analyzeImage, analyzeVideo } from '../services/raed';
import { FileSearch, Upload, Loader2, FileText, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const PitchAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        setBase64Data(base64);
        setMimeType(selectedFile.type);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!base64Data || !mimeType) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    
    const prompt = `
      أنت RAED AI، مستشار أعمال خبير ومستثمر ملائكي.
      قم بتحليل هذا العرض التقديمي (Pitch Deck) أو الفيديو الترويجي للمشروع.
      
      أريد تقييماً مفصلاً يشمل:
      1. نقاط القوة (Strengths)
      2. نقاط الضعف أو المخاطر (Weaknesses/Risks)
      3. وضوح المشكلة والحل (Clarity of Problem/Solution)
      4. نصائح للتحسين قبل العرض على المستثمرين
      
      اكتب التقرير باللغة العربية بتنسيق Markdown منظم وجذاب.
    `;

    try {
      let result;
      if (mimeType.startsWith('image/')) {
        result = await analyzeImage(base64Data, mimeType, prompt);
      } else if (mimeType.startsWith('video/')) {
        result = await analyzeVideo(base64Data, mimeType, prompt);
      } else {
        throw new Error('نوع الملف غير مدعوم');
      }
      
      if (result) {
        setAnalysisResult(result);
      } else {
        setError('فشل تحليل الملف. يرجى المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 bg-[#0B0C0E] border-l border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="text-[#FFD700]" size={20} />
            تحليل العروض
          </h3>
          <p className="text-sm text-gray-400">
            ارفع صورة من عرضك التقديمي (Pitch Deck) أو فيديو ترويجي ليقوم RAED بتقييمه وإعطائك نصائح استثمارية.
          </p>
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">الملف (صورة أو فيديو)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                file ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-white/20 hover:border-white/40 bg-white/5'
              }`}
            >
              {file ? (
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-sm font-bold text-white truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <>
                  <Upload size={32} className="text-gray-400 mb-3" />
                  <span className="text-sm text-gray-400 font-bold mb-1">اضغط لرفع ملف</span>
                  <span className="text-xs text-gray-500">يدعم الصور والفيديوهات القصيرة</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*,video/*" 
              className="hidden" 
            />
          </div>

          {file && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-300 leading-relaxed">
                سيقوم RAED AI بتحليل المحتوى البصري والنصي في الملف لتقديم تقييم شامل بناءً على معايير المستثمرين.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
          className="mt-auto w-full bg-[#FFD700] text-black py-3 rounded-xl font-bold hover:bg-[#FFC000] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#FFD700]/20 flex items-center justify-center gap-2"
        >
          {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <FileSearch size={20} />}
          {isAnalyzing ? 'جاري التحليل...' : 'تحليل الملف'}
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-[#141517] p-8 overflow-y-auto relative">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {analysisResult ? (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-[#FFD700]/20">
                R
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">تقرير تحليل RAED AI</h2>
                <p className="text-sm text-gray-400">بناءً على الملف المرفق: {file?.name}</p>
              </div>
            </div>
            
            <div className="prose prose-invert prose-yellow max-w-none">
              <div className="markdown-body text-gray-300 leading-relaxed">
                <ReactMarkdown>{analysisResult}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <FileText size={40} className="opacity-50" />
            </div>
            <p>سيتم عرض تقرير التحليل المفصل هنا</p>
            {isAnalyzing && (
              <div className="flex flex-col items-center mt-4">
                <div className="flex gap-1 mb-2">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-xs text-[#FFD700]">RAED يقوم بتحليل البيانات...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
