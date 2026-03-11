import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Shield, Award, TrendingUp, Target, Rocket, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Achievement {
  id: number;
  title: string;
  icon: any;
  desc: string;
  progress: number;
  color: string;
  bg: string;
}

export const AchievementsPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
      completed: 0,
      xp: 0,
      level: 1,
      rank: 'N/A'
  });

  useEffect(() => {
    if (!user) return;

    const calculateAchievements = async () => {
      try {
        // Fetch user data for calculations
        const { count: ideasCount } = await supabase
            .from('ideas')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
        
        const { count: messagesCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', user.id);

        const hasProfile = user.user_metadata?.avatar_url && user.user_metadata?.bio;

        const newAchievements: Achievement[] = [
            {
                id: 1,
                title: 'رائد أعمال واعد',
                icon: Rocket,
                desc: 'أطلق مشروعك الأول',
                progress: (ideasCount || 0) > 0 ? 100 : 0,
                color: 'text-orange-400',
                bg: 'bg-orange-400/10'
            },
            {
                id: 2,
                title: 'مؤسس نشط',
                icon: Zap,
                desc: 'انشر 5 مشاريع',
                progress: Math.min(((ideasCount || 0) / 5) * 100, 100),
                color: 'text-purple-400',
                bg: 'bg-purple-400/10'
            },
            {
                id: 3,
                title: 'متواصل جيد',
                icon: Star,
                desc: 'أرسل 10 رسائل',
                progress: Math.min(((messagesCount || 0) / 10) * 100, 100),
                color: 'text-blue-400',
                bg: 'bg-blue-400/10'
            },
            {
                id: 4,
                title: 'هوية مكتملة',
                icon: Shield,
                desc: 'أكمل ملفك الشخصي',
                progress: hasProfile ? 100 : 50,
                color: 'text-green-400',
                bg: 'bg-green-400/10'
            }
        ];

        setAchievements(newAchievements);

        // Calculate stats
        const completed = newAchievements.filter(a => a.progress === 100).length;
        const xp = completed * 100 + (ideasCount || 0) * 50 + (messagesCount || 0) * 10;
        const level = Math.floor(xp / 500) + 1;

        setStats({
            completed,
            xp,
            level,
            rank: 'Top 50%' // Placeholder
        });

      } catch (error) {
        console.error('Error calculating achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateAchievements();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-24 px-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10">
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
          <div className="text-3xl font-bold text-white mb-1">{loading ? '-' : stats.completed}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">إنجاز مكتمل</div>
        </div>
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl text-center">
          <div className="text-3xl font-bold text-[#FFD700] mb-1">{loading ? '-' : stats.xp}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">نقطة خبرة</div>
        </div>
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">{loading ? '-' : `Lv. ${stats.level}`}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">المستوى الحالي</div>
        </div>
        <div className="bg-[#141517] border border-white/10 p-6 rounded-3xl text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">{loading ? '-' : stats.rank}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">الترتيب العالمي</div>
        </div>
      </div>

      {/* Achievements Grid */}
      {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="skeleton-card h-48" />)}
          </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
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
                    <span>{Math.round(achievement.progress)}%</span>
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
      )}
    </div>
    </div>
  );
};
