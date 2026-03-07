import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const MarketTrendsDashboard = () => {
  const data = [
    { name: 'يناير', value: 4000 },
    { name: 'فبراير', value: 3000 },
    { name: 'مارس', value: 2000 },
    { name: 'أبريل', value: 2780 },
    { name: 'مايو', value: 1890 },
    { name: 'يونيو', value: 2390 },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">لوحة تحليلات السوق</h1>
      <div className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">اتجاهات الاستثمار في الـ EdTech</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#141517', border: 'none' }} />
              <Line type="monotone" dataKey="value" stroke="#FFD700" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
