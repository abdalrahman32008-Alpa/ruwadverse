import { supabase } from './supabase';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface TrendData {
  keyword: string;
  interestOverTime: { date: string; value: number }[];
  averageInterest: number;
}

export async function getMarketTrend(keyword: string): Promise<TrendData | null> {
  try {
    // Check cache first
    const { data: cached, error: cacheError } = await supabase
      .from('market_cache')
      .select('*')
      .eq('keyword', keyword.toLowerCase())
      .single();

    if (cached && !cacheError) {
      // Check if cache is fresh (e.g., less than 7 days old)
      const lastFetched = new Date(cached.last_fetched);
      const now = new Date();
      if ((now.getTime() - lastFetched.getTime()) / (1000 * 3600 * 24) < 7) {
        return cached.trend_data as TrendData;
      }
    }

    if (!ai) {
        console.warn("Gemini API key missing for trends analysis");
        return null;
    }

    // Use Gemini to estimate trend data
    const prompt = `
      Estimate the relative search interest (0-100) for the keyword "${keyword}" over the last 12 months.
      Provide a JSON response with:
      - interestOverTime: array of objects { date: "YYYY-MM", value: number }
      - averageInterest: number
      Based on your knowledge of market trends.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });

    let trendData: TrendData | null = null;
    if (response.text) {
        const result = JSON.parse(response.text);
        trendData = {
            keyword,
            interestOverTime: result.interestOverTime || [],
            averageInterest: result.averageInterest || 0
        };
    }

    if (trendData) {
        // Update cache
        await supabase
        .from('market_cache')
        .upsert({
            keyword: keyword.toLowerCase(),
            trend_data: trendData,
            last_fetched: new Date().toISOString(),
        }, { onConflict: 'keyword' });

        return trendData;
    }
    
    return null;

  } catch (error) {
    console.error('Error fetching market trend:', error);
    return null;
  }
}
