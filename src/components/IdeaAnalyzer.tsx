import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Target, TrendingUp, Shield, Users, AlertTriangle, CheckCircle, Search, RefreshCw, BarChart2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { GoogleGenAI } from '@google/genai';
import { getMarketTrend } from '../lib/trends';
import { supabase } from '../lib/supabase';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface IdeaData {
  title: string;
  problem: string;
  customers: string;
  market_size: string;
  advantage: string;
  demand_proof: string;
  team: string;
  risks: string;
}

export const IdeaAnalyzer = () => {
  const { t } = useLanguage();
  const [ideaData, setIdeaData] = useState<IdeaData>({
    title: '',
    problem: '',
    customers: '',
    market_size: '',
    advantage: '',
    demand_proof: '',
    team: '',
    risks: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [marketTrend, setMarketTrend] = useState<any>(null);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setIdeaData(prev => ({ ...prev, [name]: value }));
  };

  const analyzeIdea = async () => {
    setIsAnalyzing(true);
    try {
      // 1. Fetch Market Trend (Mock Google Trends API)
      const trend = await getMarketTrend(ideaData.market_size);
      setMarketTrend(trend);

      // 2. Semantic Search for Duplicates (pgvector)
      // Note: In a real app, you'd generate an embedding for the idea first using Gemini, then call the RPC.
      // Here we mock the embedding generation and RPC call for demonstration.
      const mockEmbedding = Array(768).fill(0.1); // Mock embedding
      const { data: similarIdeas, error: searchError } = await supabase.rpc('match_ideas', {
        query_embedding: mockEmbedding,
        match_threshold: 0.8,
        match_count: 3
      });
      
      if (!searchError && similarIdeas) {
         setDuplicates(similarIdeas);
      }

      // 3. LLM Feasibility Evaluation (Fuzzy Random Forest simulated via Prompt Engineering)
      const prompt = `
        Analyze the following startup idea using a Fuzzy Random Forest approach (simulated).
        Evaluate feasibility, market potential, and risks.
        Provide a JSON response with:
        - score (0-100)
        - strengths (array of strings)
        - weaknesses (array of strings)
        - recommendations (array of strings)
        - sentiment (positive, neutral, negative) - simulating Arabic BiLSTM Sentiment Analysis.

        Idea Details:
        Title: ${ideaData.title}
        Problem: ${ideaData.problem}
        Target Customers: ${ideaData.customers}
        Market Size/Keyword: ${ideaData.market_size}
        Competitive Advantage: ${ideaData.advantage}
        Proof of Demand: ${ideaData.demand_proof}
        Required Team: ${ideaData.team}
        Risks: ${ideaData.risks}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (response.text) {
        setAnalysisResult(JSON.parse(response.text));
      }

    } catch (error) {
      console.error('Error analyzing idea:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#141517] rounded-3xl border border-white/10 shadow-2xl mt-8">
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <div className="w-12 h-12 bg-[#FFD700]/10 rounded-xl flex items-center justify-center text-[#FFD700]">
          <Lightbulb size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">محلل الأفكار المتقدم (RAED)</h2>
          <p className="text-sm text-gray-400">تقييم الجدوى باستخدام الذكاء الاصطناعي وتحليل السوق</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">عنوان الفكرة</label>
            <input type="text" name="title" value={ideaData.title} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-[#FFD700] outline-none" placeholder="مثال: منصة تعليمية للبرمجة" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">المشكلة التي تحلها</label>
            <textarea name="problem" value={ideaData.problem} onChange={handleInputChange} rows={2} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-[#FFD700] outline-none" placeholder="ما هي المشكلة الحقيقية؟" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">العملاء المستهدفون</label>
            <input type="text" name="customers" value={ideaData.customers} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-[#FFD700] outline-none" placeholder="من سيدفع مقابل الحل؟" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">حجم السوق (كلمة مفتاحية للبحث)</label>
            <input type="text" name="market_size" value={ideaData.market_size} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-[#FFD700] outline-none" placeholder="مثال: EdTech Saudi" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">الميزة التنافسية</label>
            <textarea name="advantage" value={ideaData.advantage} onChange={handleInputChange} rows={2} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-[#FFD700] outline-none" placeholder="لماذا أنت أفضل من المنافسين؟" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">دليل الطلب (Traction)</label>
            <input type="text" name="demand_proof" value={ideaData.demand_proof} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-[#FFD700] outline-none" placeholder="هل سألت عملاء محتملين؟" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">الفريق المطلوب (مهارات)</label>
            <input type="text" name="team" value={ideaData.team} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-[#FFD700] outline-none" placeholder="مثال: React, Node.js, Marketing" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">المخاطر المحتملة</label>
            <textarea name="risks" value={ideaData.risks} onChange={handleInputChange} rows={2} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-[#FFD700] outline-none" placeholder="ما الذي قد يفشل الفكرة؟" />
          </div>

          <button 
            onClick={analyzeIdea}
            disabled={isAnalyzing || !ideaData.title}
            className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <BarChart2 size={20} />}
            {isAnalyzing ? 'جاري التحليل المعمق...' : 'تحليل الفكرة'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
          {!analysisResult && !isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
              <Search size={48} className="mb-4 opacity-20" />
              <p>أدخل تفاصيل فكرتك واضغط على "تحليل الفكرة" للحصول على تقييم شامل باستخدام نماذج الذكاء الاصطناعي المتقدمة.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#141517]/80 backdrop-blur-sm z-10">
              <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[#FFD700] font-medium animate-pulse">RAED AI يحلل البيانات...</p>
            </div>
          )}

          {analysisResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Score & Sentiment */}
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">نقاط الجدوى (Fuzzy RF)</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-[#FFD700]">{analysisResult.score}</span>
                    <span className="text-sm text-gray-500 mb-1">/ 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">تحليل المشاعر (BiLSTM)</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    analysisResult.sentiment === 'positive' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    analysisResult.sentiment === 'negative' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {analysisResult.sentiment === 'positive' ? 'إيجابي ومحفز' : analysisResult.sentiment === 'negative' ? 'سلبي/مخاطرة عالية' : 'محايد'}
                  </span>
                </div>
              </div>

              {/* Market Trend */}
              {marketTrend && (
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><TrendingUp size={16} className="text-blue-400" /> اتجاهات السوق (Google Trends)</h4>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-sm text-gray-300">متوسط الاهتمام بـ "{marketTrend.keyword}"</span>
                    <span className="font-mono text-blue-400 font-bold">{marketTrend.averageInterest}%</span>
                  </div>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                  <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2"><CheckCircle size={14} /> نقاط القوة</h4>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                    {analysisResult.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                  <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={14} /> نقاط الضعف</h4>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                    {analysisResult.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-sm font-bold text-[#FFD700] mb-2 flex items-center gap-2"><Target size={16} /> توصيات RAED</h4>
                <ul className="text-sm text-gray-300 space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  {analysisResult.recommendations?.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Duplicates (Semantic Search) */}
              {duplicates.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2"><Search size={16} /> أفكار مشابهة في المنصة (Semantic Search)</h4>
                  <div className="space-y-2">
                    {duplicates.map((dup, i) => (
                      <div key={i} className="bg-white/5 p-2 rounded-lg border border-white/10 flex justify-between items-center text-xs">
                        <span className="text-gray-300">{dup.title}</span>
                        <span className="text-purple-400 font-mono">{(dup.similarity * 100).toFixed(1)}% تطابق</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
