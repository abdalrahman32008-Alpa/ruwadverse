import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Filter, Search, MoreHorizontal, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { StoriesBar } from '../components/community/StoriesBar';
import { PostCard } from '../components/community/PostCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  user: { name: string; avatar: string; role: string };
  content: string;
  image?: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
  type: 'idea' | 'skill' | 'investment' | 'general';
}

interface UserProfile {
    id: string;
    name: string;
    avatar_url: string;
    role: string;
}

interface SuggestedIdea {
    id: string;
    title: string;
    description: string;
}

export const CommunityPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedPeople, setSuggestedPeople] = useState<UserProfile[]>([]);
  const [suggestedIdeas, setSuggestedIdeas] = useState<SuggestedIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Ideas as Posts
        const { data: ideasData, error: ideasError } = await supabase
          .from('ideas')
          .select(`
            *,
            owner:user_id (full_name, avatar_url, user_type)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (ideasError) throw ideasError;

        const mappedPosts: Post[] = ideasData?.map(idea => ({
            id: idea.id,
            user: {
                name: idea.owner?.full_name || 'مستخدم',
                avatar: idea.owner?.avatar_url || '',
                role: idea.owner?.user_type || 'عضو'
            },
            content: idea.description,
            time: new Date(idea.created_at).toLocaleDateString('ar-EG'),
            likes: 0, // No likes table yet
            comments: 0, // No comments table yet
            shares: 0,
            type: 'idea' // Defaulting to idea type since we are fetching from ideas table
        })) || [];

        setPosts(mappedPosts);

        // Fetch Suggested People (Profiles)
        const { data: usersData, error: usersError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, user_type')
            .neq('id', user?.id || '') // Exclude current user
            .limit(3);
        
        if (usersError) throw usersError;
        setSuggestedPeople(usersData?.map(u => ({
            id: u.id,
            name: u.full_name || 'مستخدم',
            avatar_url: u.avatar_url || '',
            role: u.user_type || 'عضو'
        })) || []);

        // Fetch Suggested Ideas (different from feed)
        const { data: suggestedIdeasData, error: suggestedIdeasError } = await supabase
            .from('ideas')
            .select('id, title, description')
            .limit(3);

        if (suggestedIdeasError) throw suggestedIdeasError;
        setSuggestedIdeas(suggestedIdeasData || []);

      } catch (error) {
        console.error('Error fetching community data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-24 px-4">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-3">
          <StoriesBar />
          
          {/* Create Post Input */}
          <div 
            onClick={() => navigate('/create-idea')}
            className="bg-[#141517] border border-white/10 rounded-2xl p-4 mb-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-white font-bold">
              {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
              ) : (
                  user?.email?.[0].toUpperCase()
              )}
            </div>
            <input 
              type="text" 
              placeholder={t('postPlaceholder')} 
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 cursor-pointer"
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
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="skeleton-card h-64" />)}
                </div>
            ) : posts.length > 0 ? (
                posts.map((post) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PostCard post={post} />
                </motion.div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500">
                    <p>لا توجد منشورات حالياً</p>
                </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block space-y-6">
          {/* Suggested People */}
          <div className="bg-[#141517] border border-white/10 rounded-2xl p-4">
            <h3 className="font-bold mb-4 text-lg">{t('suggestedPeople')}</h3>
            <div className="space-y-4">
              {loading ? (
                  <div className="skeleton-text w-full h-10" />
              ) : suggestedPeople.length > 0 ? (
                  suggestedPeople.map((person) => (
                    <div key={person.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-white font-bold text-xs">
                        {person.avatar_url ? (
                            <img src={person.avatar_url} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                            person.name?.[0]
                        )}
                        </div>
                        <div>
                        <h4 className="font-bold text-sm">{person.name}</h4>
                        <p className="text-xs text-gray-400">{person.role}</p>
                        </div>
                    </div>
                    <button className="text-[#FFD700] text-xs font-bold hover:underline">متابعة</button>
                    </div>
                ))
              ) : (
                  <p className="text-gray-500 text-sm">لا يوجد مقترحات</p>
              )}
            </div>
          </div>

          {/* Suggested Ideas */}
          <div className="bg-[#141517] border border-white/10 rounded-2xl p-4">
            <h3 className="font-bold mb-4 text-lg">{t('suggestedIdeas')}</h3>
            <div className="space-y-4">
              {loading ? (
                  <div className="skeleton-text w-full h-10" />
              ) : suggestedIdeas.length > 0 ? (
                  suggestedIdeas.map((idea) => (
                    <div key={idea.id} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer" onClick={() => navigate(`/idea/${idea.id}`)}>
                    <h4 className="font-bold text-sm mb-1">{idea.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{idea.description}</p>
                    </div>
                ))
              ) : (
                  <p className="text-gray-500 text-sm">لا يوجد مقترحات</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
