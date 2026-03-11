import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Sparkles, Loader2, Layout, Presentation, CheckCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import * as Sentry from "@sentry/react";
import { toast } from 'react-hot-toast';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ai = Sentry.instrumentGoogleGenAIClient(genAI, {
  recordInputs: true,
  recordOutputs: true,
});

export const PitchDeckGenerator = () => {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [deck, setDeck] = useState<any>(null);

  const generateDeck = async () => {
    if (!idea.trim()) return;
    setIsGenerating(true);
    try {
      const prompt = `
        Create a professional 10-slide pitch deck outline for the following startup idea: "${idea}".
        The deck should be in Arabic and follow the standard venture capital format.
        Provide a JSON response with:
        - title (string)
        - slides (array of objects { slide_number, title, key_points (array of strings), visual_suggestion (string) })
        - elevator_pitch (string)
        - target_investors (string)
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (response.text) {
        setDeck(JSON.parse(response.text));
        toast.success('تم إنشاء مسودة العرض التقديمي بنجاح');
      }
    } catch (error) {
      console.error('Pitch deck error:', error);
      toast.error('فشل إنشاء العرض التقديمي');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#141517] rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
          <Presentation size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">منشئ العروض التقديمية (Pitch Deck)</h2>
          <p className="text-sm text-gray-400">حول فكرتك إلى عرض تقديمي احترافي جاهز للمستثمرين</p>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-2">وصف الفكرة أو المشروع</label>
          <textarea 
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={4}
            placeholder="اشرح فكرتك باختصار، ما هي المشكلة والحل؟"
            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500 outline-none transition-all resize-none"
          />
        </div>
        <button 
          onClick={generateDeck}
          disabled={isGenerating || !idea.trim()}
          className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {isGenerating ? 'جاري التصميم والتحليل...' : 'إنشاء محتوى العرض التقديمي'}
        </button>
      </div>

      {deck && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Elevator Pitch */}
          <div className="bg-purple-500/5 p-6 rounded-2xl border border-purple-500/10">
            <h3 className="text-lg font-bold text-purple-400 mb-2">خطاب المصعد (Elevator Pitch)</h3>
            <p className="text-white italic leading-relaxed">"{deck.elevator_pitch}"</p>
          </div>

          {/* Slides List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Layout size={20} className="text-purple-400" /> هيكل العرض (10 شرائح)
            </h3>
            <div className="grid gap-4">
              {deck.slides?.map((slide: any, i: number) => (
                <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded">شريحة {slide.slide_number}</span>
                    <h4 className="text-lg font-bold text-white">{slide.title}</h4>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {slide.key_points?.map((point: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle size={14} className="text-green-500 mt-1 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-xs text-gray-500 italic">
                    <span className="font-bold text-gray-400 not-italic">اقتراح بصري: </span>
                    {slide.visual_suggestion}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Investors */}
          <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10">
            <h3 className="text-lg font-bold text-blue-400 mb-2">المستثمرون المستهدفون</h3>
            <p className="text-gray-300 text-sm">{deck.target_investors}</p>
          </div>

          <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <Download size={20} /> تحميل كملف نصي (Draft)
          </button>
        </motion.div>
      )}
    </div>
  );
};
