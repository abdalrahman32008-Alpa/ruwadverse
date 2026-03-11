export interface MarketData {
  percentage: number;
  insight: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

const INSIGHTS = [
  "insight_1",
  "insight_2",
  "insight_3",
  "insight_4",
  "insight_5",
  "insight_6",
  "insight_7",
  "insight_8"
];

export const getDailyMarketInsight = (): MarketData => {
  const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format
  const storedData = localStorage.getItem('ruwad_market_data');

  if (storedData) {
    const parsedData: MarketData = JSON.parse(storedData);
    if (parsedData.lastUpdated === today) {
      return parsedData;
    }
  }

  // Generate new data for a new day
  const basePercentage = 75;
  const variance = Math.floor(Math.random() * 10) - 5; // -5 to +5
  const newPercentage = Math.max(0, Math.min(100, basePercentage + variance));
  
  const randomInsight = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];
  
  const newTrend = Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down';

  const newData: MarketData = {
    percentage: newPercentage,
    insight: randomInsight,
    lastUpdated: today,
    trend: newTrend
  };

  localStorage.setItem('ruwad_market_data', JSON.stringify(newData));
  return newData;
};
