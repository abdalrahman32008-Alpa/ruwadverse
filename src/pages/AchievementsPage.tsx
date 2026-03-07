import React from 'react';
import { Trophy, Star, Zap, Shield } from 'lucide-react';

export const AchievementsPage = () => {
  const achievements = [
    { title: 'أول صفقة ناجحة', icon: <Trophy size={24} />, desc: 'أغلقت أول صفقة استثمارية' },
    { title: 'مستشار مجتمع', icon: <Star size={24} />, desc: 'حصلت على 10 ردود مفيدة' },
    { title: 'مؤسس نشط', icon: <Zap size={24} />, desc: 'نشرت 50 منشوراً' },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">إنجازاتك في ruwadverse</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {achievements.map((a, i) => (
          <div key={i} className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] mb-4">
              {a.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
            <p className="text-sm text-gray-400">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
