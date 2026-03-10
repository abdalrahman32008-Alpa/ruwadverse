import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Globe, TrendingUp, Target, AlertCircle, Loader2, Sparkles, Users } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import * as Sentry from "@sentry/react";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ai = Sentry.instrumentGoogleGenAIClient(genAI, {
  recordInputs: true,
  recordOutputs: true,
});

export const MarketAnalysisTool = () => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeMarket = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    try {
      const prompt = `
        Perform a detailed market analysis for the following business idea or sector: "${query}".
        Use Google Search grounding to find recent trends, competitors, and market size in the Middle East (specifically Saudi Arabia if applicable).
        Provide a structured JSON response with:
        - summary (string)
        - trends (array of strings)
        - competitors (array of objects { name, strength, weakness })
        - opportunities (array of strings)
        - threats (array of strings)
        - sources (array of URLs)
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
        }
      });

      if (response.text) {
        setResult(JSON.parse(response.text));
      }
    } catch (error) {
      console.error('Market analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#141517] rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
          <Globe size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">محلل السوق الذكي</h2>
          <p className="text-sm text-gray-400">تحليل فوري لبيانات السوق الحقيقية باستخدام الذكاء الاصطناعي</p>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyzeMarket()}
            placeholder="أدخل القطاع أو الفكرة (مثال: توصيل الورد في الرياض)" 
            className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <button 
          onClick={analyzeMarket}
          disabled={isAnalyzing || !query.trim()}
          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {isAnalyzing ? 'جاري البحث...' : 'تحليل'}
        </button>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Summary */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Target className="text-blue-400" size={20} /> ملخص التحليل
            </h3>
            <p className="text-gray-300 leading-relaxed">{result.summary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Trends */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-green-400" size={20} /> اتجاهات حديثة
              </h3>
              <ul className="space-y-3">
                {result.trends?.map((trend: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-blue-400 mt-1">•</span>
                    {trend}
                  </li>
                ))}
              </ul>
            </div>

            {/* Competitors */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="text-purple-400" size={20} /> المنافسون الرئيسيون
              </h3>
              <div className="space-y-4">
                {result.competitors?.map((comp: any, i: number) => (
                  <div key={i} className="p-3 bg-black/20 rounded-xl border border-white/5">
                    <p className="font-bold text-white text-sm mb-1">{comp.name}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <span className="text-green-400">قوة: {comp.strength}</span>
                      <span className="text-red-400">ضعف: {comp.weakness}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SWOT-like Opportunities & Threats */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/5 p-6 rounded-2xl border border-green-500/10">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <Sparkles size={20} /> الفرص المتاحة
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {result.opportunities?.map((opp: string, i: number) => <li key={i}>• {opp}</li>)}
              </ul>
            </div>
            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertCircle size={20} /> التهديدات والمخاطر
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {result.threats?.map((threat: string, i: number) => <li key={i}>• {threat}</li>)}
              </ul>
            </div>
          </div>

          {/* Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="pt-6 border-t border-white/5">
              <p className="text-xs text-gray-500 mb-3">المصادر المعتمدة في التحليل:</p>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((url: string, i: number) => (
                  <a 
                    key={i} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-400 hover:underline bg-blue-400/5 px-2 py-1 rounded-full border border-blue-400/20 truncate max-w-[200px]"
                  >
                    {new URL(url).hostname}
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
