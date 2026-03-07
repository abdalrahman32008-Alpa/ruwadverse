import React from 'react';
import { Trophy, Star, Zap, Shield, Award, TrendingUp, Target, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

const ACHIEVEMENTS = [
  { id: 1, title: 'أول صفقة ناجحة', icon: Trophy, desc: 'أغلقت أول صفقة استثمارية', progress: 100, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: 2, title: 'مستشار مجتمع', icon: Star, desc: 'حصلت على 10 ردود مفيدة', progress: 80, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 3, title: 'مؤسس نشط', icon: Zap, desc: 'نشرت 50 منشوراً', progress: 60, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 4, title: 'مستثمر موثوق', icon: Shield, desc: 'أكملت التحقق من الهوية', progress: 100, color: 'text-green-400', bg: 'bg-green-400/10' },
  { id: 5, title: 'رائد أعمال واعد', icon: Rocket, desc: 'أطلقت مشروعك الأول', progress: 40, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { id: 6, title: 'خبير سوق', icon: TrendingUp, desc: 'حللت 20 فرصة استثمارية', progress: 20, color: 'text-red-400', bg: 'bg-red-400/10' },
];

export const AchievementsPage = () => {
  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Award className="text-[#FFD700]" size={40} />
          إنجازاتك في ruwadverse
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          تابع تقدمك واحتفل بنجاحاتك في رحلتك الريادية. كل خطوة تقربك من هدفك.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl text-center">
          <div className="text-3xl font-bold text-white mb-1">12</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">إنجاز مكتمل</div>
        </div>
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl text-center">
          <div className="text-3xl font-bold text-[#FFD700] mb-1">850</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">نقطة خبرة</div>
        </div>
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">Lv. 5</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">المستوى الحالي</div>
        </div>
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">Top 10%</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">الترتيب العالمي</div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-[#141517] border border-white/10 p-6 rounded-3xl hover:border-[#FFD700]/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FFD700]/5 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-150 ${achievement.bg}`} />
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${achievement.bg} ${achievement.color}`}>
                <achievement.icon size={28} />
              </div>
              {achievement.progress === 100 && (
                <div className="bg-[#FFD700] text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Target size={12} /> مكتمل
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2 relative z-10">{achievement.title}</h3>
            <p className="text-sm text-gray-400 mb-6 relative z-10">{achievement.desc}</p>

            <div className="relative z-10">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>التقدم</span>
                <span>{achievement.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full rounded-full ${achievement.progress === 100 ? 'bg-[#FFD700]' : 'bg-gray-600'}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
