import { supabase } from './supabase';

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

    // Mock Google Trends API fetch
    // In reality, you would call a backend function that uses google-trends-api
    const mockData: TrendData = {
      keyword,
      interestOverTime: Array.from({ length: 12 }).map((_, i) => ({
        date: new Date(new Date().setMonth(new Date().getMonth() - i)).toISOString().slice(0, 7),
        value: Math.floor(Math.random() * 50) + 50, // Mock value 50-100
      })).reverse(),
      averageInterest: Math.floor(Math.random() * 30) + 60,
    };

    // Update cache
    await supabase
      .from('market_cache')
      .upsert({
        keyword: keyword.toLowerCase(),
        trend_data: mockData,
        last_fetched: new Date().toISOString(),
      }, { onConflict: 'keyword' });

    return mockData;
  } catch (error) {
    console.error('Error fetching market trend:', error);
    return null;
  }
}
