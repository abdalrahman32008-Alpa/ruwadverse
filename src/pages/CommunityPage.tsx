import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Filter, Search, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { StoriesBar } from '../components/community/StoriesBar';
import { PostCard } from '../components/community/PostCard';

const POSTS: {
  id: number;
  user: { name: string; avatar: string; role: string };
  content: string;
  image?: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
  type: 'idea' | 'skill' | 'investment' | 'general';
}[] = [
  {
    id: 1,
    user: { name: 'أحمد محمد', avatar: 'https://i.pravatar.cc/150?u=1', role: 'مطور واجهات' },
    content: 'أبحث عن شريك تقني لبناء منصة تعليمية تفاعلية للأطفال باستخدام الذكاء الاصطناعي. الفكرة جاهزة ولدينا نموذج أولي.',
    time: 'منذ ساعتين',
    likes: 24,
    comments: 5,
    shares: 2,
    type: 'idea'
  },
  {
    id: 2,
    user: { name: 'سارة علي', avatar: 'https://i.pravatar.cc/150?u=2', role: 'مصممة UX/UI' },
    content: 'تم بحمد الله إطلاق النسخة التجريبية من تطبيق "صحتك". شكراً لكل من ساهم في هذا الإنجاز!',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    time: 'منذ 5 ساعات',
    likes: 156,
    comments: 32,
    shares: 12,
    type: 'general'
  },
  {
    id: 3,
    user: { name: 'خالد عمر', avatar: 'https://i.pravatar.cc/150?u=3', role: 'مستثمر ملائكي' },
    content: 'أبحث عن فرص استثمارية في قطاع التقنية المالية (FinTech) في مرحلة البذرة (Seed Stage). تواصل معي إذا كان لديك مشروع واعد.',
    time: 'منذ يوم واحد',
    likes: 89,
    comments: 45,
    shares: 28,
    type: 'investment'
  }
];

export const CommunityPage = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-3">
          <StoriesBar />
          
          {/* Create Post Input */}
          <div className="bg-[#141517] border border-white/10 rounded-2xl p-4 mb-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=0" alt="User" className="w-full h-full object-cover" />
            </div>
            <input 
              type="text" 
              placeholder={t('postPlaceholder')} 
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
              readOnly
            />
            <button className="bg-[#FFD700] text-black p-2 rounded-xl hover:bg-[#FFC000] transition-colors">
              <Plus size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
            {['all', 'idea', 'skill', 'investment'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'bg-white text-black' 
                    : 'bg-[#141517] text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {t(`filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {POSTS.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block space-y-6">
          {/* Suggested People */}
          <div className="bg-[#141517] border border-white/10 rounded-2xl p-4">
            <h3 className="font-bold mb-4 text-lg">{t('suggestedPeople')}</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">محمد علي</h4>
                      <p className="text-xs text-gray-400">مطور تطبيقات</p>
                    </div>
                  </div>
                  <button className="text-[#FFD700] text-xs font-bold hover:underline">متابعة</button>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Ideas */}
          <div className="bg-[#141517] border border-white/10 rounded-2xl p-4">
            <h3 className="font-bold mb-4 text-lg">{t('suggestedIdeas')}</h3>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                  <h4 className="font-bold text-sm mb-1">منصة تعليمية AI</h4>
                  <p className="text-xs text-gray-400 line-clamp-2">فكرة لبناء منصة تعليمية تستخدم الذكاء الاصطناعي لتخصيص المناهج...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
