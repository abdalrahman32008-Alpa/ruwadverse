import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Filter, MessageSquare, Heart, Share2, Bookmark, 
  MoreHorizontal, Sparkles, Briefcase, TrendingUp, Lightbulb,
  Image as ImageIcon, Video, Link as LinkIcon, Send, X,
  ChevronDown, Globe, Shield, User, Zap, Star
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Post, PostType } from '../types/social';
import { Skeleton } from '../components/Skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

// --- Feed Page Component ---
export const FeedPage = () => {
  const { t, language, dir } = useLanguage();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostType | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [activeFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(full_name, avatar_url, user_type),
          reactions_count:post_reactions(count),
          comments_count:comments(count)
        `)
        .order('created_at', { ascending: false });

      if (activeFilter !== 'all') {
        query = query.eq('type', activeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto" dir={dir}>
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: User Profile Summary & Navigation */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <UserProfileCard />
          <FeedNavigation activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <TrendingSectors />
        </div>

        {/* Main Feed Area */}
        <div className="lg:col-span-6 space-y-6">
          <StoriesBar />
          <CreatePostTrigger onClick={() => setIsCreateModalOpen(true)} />
          
          <div className="space-y-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onRefresh={fetchPosts} />
              ))
            ) : (
              <EmptyFeed onReset={() => setActiveFilter('all')} />
            )}
          </div>
        </div>

        {/* Right Sidebar: Suggestions & RAED Insights */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <RaedInsightsCard />
          <SuggestedConnections />
          <UpcomingEvents />
        </div>
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreatePostModal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)} 
            onSuccess={() => {
              setIsCreateModalOpen(false);
              fetchPosts();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-components ---

const UserProfileCard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  if (!profile) return <Skeleton className="h-48 rounded-3xl" />;

  return (
    <div className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img 
            src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=FFD700&color=000`} 
            alt={profile.full_name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FFD700]/20"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FFD700] rounded-lg flex items-center justify-center text-black">
            <Zap size={12} fill="currentColor" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-white">{profile.full_name}</h3>
        <p className="text-sm text-gray-400 mb-4">{profile.user_type === 'idea' ? 'مؤسس' : profile.user_type === 'skill' ? 'خبير مهارة' : 'مستثمر'}</p>
        
        <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-white/5">
          <div>
            <div className="text-sm font-bold text-white">12</div>
            <div className="text-[10px] text-gray-500 uppercase">منشور</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white">256</div>
            <div className="text-[10px] text-gray-500 uppercase">متابع</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white">1.2k</div>
            <div className="text-[10px] text-gray-500 uppercase">Rep</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedNavigation = ({ activeFilter, onFilterChange }: { activeFilter: string, onFilterChange: (f: any) => void }) => {
  const { t } = useLanguage();
  const navItems = [
    { id: 'all', label: 'الكل', icon: <Globe size={18} /> },
    { id: 'idea', label: 'أفكار', icon: <Lightbulb size={18} /> },
    { id: 'skill', label: 'مهارات', icon: <Briefcase size={18} /> },
    { id: 'investment', label: 'استثمارات', icon: <TrendingUp size={18} /> },
    { id: 'community', label: 'المجتمع', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="space-y-1">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onFilterChange(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
            activeFilter === item.id 
              ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' 
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const StoriesBar = () => {
  const { user } = useAuth();
  // Mock stories for now
  const stories = [
    { id: '1', name: 'أحمد', avatar: 'https://i.pravatar.cc/150?u=1', type: 'progress' },
    { id: '2', name: 'سارة', avatar: 'https://i.pravatar.cc/150?u=2', type: 'urgent' },
    { id: '3', name: 'خالد', avatar: 'https://i.pravatar.cc/150?u=3', type: 'achievement' },
    { id: '4', name: 'ليلى', avatar: 'https://i.pravatar.cc/150?u=4', type: 'progress' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
      <button className="flex-shrink-0 flex flex-col items-center gap-2 group">
        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-[#FFD700] transition-colors">
          <Plus size={24} className="text-gray-400 group-hover:text-[#FFD700]" />
        </div>
        <span className="text-[10px] text-gray-400">قصتك</span>
      </button>

      {stories.map((story) => (
        <button key={story.id} className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className={`w-16 h-16 rounded-2xl p-0.5 border-2 ${
            story.type === 'urgent' ? 'border-red-500' : 
            story.type === 'achievement' ? 'border-[#FFD700]' : 'border-blue-500'
          }`}>
            <img src={story.avatar} alt={story.name} className="w-full h-full rounded-[14px] object-cover" />
          </div>
          <span className="text-[10px] text-gray-400">{story.name}</span>
        </button>
      ))}
    </div>
  );
};

const CreatePostTrigger = ({ onClick }: { onClick: () => void }) => {
  const { user } = useAuth();
  return (
    <div className="linear-card p-4 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10 flex items-center gap-4">
      <img 
        src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=FFD700&color=000`} 
        className="w-10 h-10 rounded-xl object-cover"
        alt="User"
      />
      <button 
        onClick={onClick}
        className="flex-grow text-start px-4 py-2.5 rounded-2xl bg-white/5 text-gray-400 hover:bg-white/10 transition-colors text-sm"
      >
        بماذا تفكر يا رائد؟ شارك فكرة أو مهارة...
      </button>
      <div className="flex gap-2">
        <button onClick={onClick} className="p-2 text-gray-400 hover:text-[#FFD700] transition-colors"><ImageIcon size={20} /></button>
        <button onClick={onClick} className="p-2 text-gray-400 hover:text-[#FFD700] transition-colors"><Video size={20} /></button>
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: Post, onRefresh: () => void }> = ({ post, onRefresh }) => {
  const { language } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const getTypeStyles = (type: PostType) => {
    switch (type) {
      case 'idea': return { icon: <Lightbulb size={14} />, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'فكرة مشروع' };
      case 'skill': return { icon: <Briefcase size={14} />, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'مهارة خبير' };
      case 'investment': return { icon: <TrendingUp size={14} />, color: 'text-green-400', bg: 'bg-green-500/10', label: 'فرصة استثمار' };
      default: return { icon: <Globe size={14} />, color: 'text-gray-400', bg: 'bg-white/5', label: 'منشور مجتمع' };
    }
  };

  const styles = getTypeStyles(post.type);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="linear-card rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={post.author?.avatar_url || `https://ui-avatars.com/api/?name=${post.author?.full_name}&background=FFD700&color=000`} 
            className="w-12 h-12 rounded-2xl object-cover"
            alt={post.author?.full_name}
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white">{post.author?.full_name}</h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles.bg} ${styles.color} border border-white/5 flex items-center gap-1`}>
                {styles.icon}
                {styles.label}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: language === 'ar' ? ar : undefined })}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        {post.title && <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>}
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
        {/* Post Specific Metadata (Idea/Skill/Investment) */}
        {(post.type === 'idea' || post.type === 'skill' || post.type === 'investment') && (
          <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-2 gap-4">
            {post.sector && (
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-1">القطاع</div>
                <div className="text-sm text-white font-medium">{post.sector}</div>
              </div>
            )}
            {post.stage && (
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-1">المرحلة</div>
                <div className="text-sm text-white font-medium">{post.stage}</div>
              </div>
            )}
            {post.raed_score && (
              <div className="col-span-2 pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#FFD700]" />
                  <span className="text-xs text-gray-400">RAED Score:</span>
                </div>
                <div className="text-sm font-bold text-[#FFD700]">{post.raed_score}%</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="px-6 pb-4">
          <div className={`grid gap-2 ${post.media_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.media_urls.map((url, i) => (
              <img key={i} src={url} className="w-full h-64 object-cover rounded-2xl border border-white/5" alt="Post media" />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm font-medium">{isLiked ? (post.reactions_count || 0) + 1 : (post.reactions_count || 0)}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <MessageSquare size={20} />
            <span className="text-sm font-medium">{post.comments_count || 0}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
        </div>
        <button className="text-gray-400 hover:text-[#FFD700] transition-colors">
          <Bookmark size={20} />
        </button>
      </div>

      {/* Comments Section (Simplified) */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 border-t border-white/5 bg-black/20"
          >
            <div className="pt-4 space-y-4">
              <div className="flex gap-3">
                <img src="https://i.pravatar.cc/150?u=me" className="w-8 h-8 rounded-lg object-cover" alt="Me" />
                <div className="flex-grow relative">
                  <input 
                    type="text" 
                    placeholder="اكتب تعليقاً..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                  <button className="absolute left-2 top-1/2 -translate-y-1/2 text-[#FFD700]"><Send size={16} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CreatePostModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [type, setType] = useState<PostType>('community');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!content.trim() || !user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('posts').insert({
        author_id: user.id,
        content,
        type,
        visibility: 'public'
      });
      if (error) throw error;
      onSuccess();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xl bg-[#141517] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">إنشاء منشور جديد</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            {(['community', 'idea', 'skill', 'investment'] as PostType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                  type === t ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'bg-white/5 text-gray-400 border-white/10'
                }`}
              >
                {t === 'community' ? 'عام' : t === 'idea' ? 'فكرة' : t === 'skill' ? 'مهارة' : 'استثمار'}
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="بماذا تفكر؟"
            className="w-full h-40 bg-transparent text-white resize-none outline-none text-lg placeholder-gray-600"
          />

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-[#FFD700] transition-colors"><ImageIcon size={20} /></button>
              <button className="p-2 text-gray-400 hover:text-[#FFD700] transition-colors"><Video size={20} /></button>
              <button className="p-2 text-gray-400 hover:text-[#FFD700] transition-colors"><LinkIcon size={20} /></button>
            </div>
            <button 
              onClick={handleCreate}
              disabled={loading || !content.trim()}
              className="px-8 py-2.5 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-all disabled:opacity-50"
            >
              {loading ? 'جاري النشر...' : 'نشر'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const RaedInsightsCard = () => {
  return (
    <div className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-[#FFD700]" />
        <h3 className="text-lg font-bold text-white">رؤى RAED اليومية</h3>
      </div>
      <div className="space-y-4">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-xs text-gray-400 leading-relaxed">
            "نلاحظ زيادة بنسبة <span className="text-[#FFD700] font-bold">15%</span> في البحث عن شركاء تقنيين في قطاع الـ EdTech هذا الأسبوع."
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-xs text-gray-400 leading-relaxed">
            "أفضل وقت للنشر اليوم هو الساعة <span className="text-[#FFD700] font-bold">8:00 مساءً</span> للوصول لأكبر عدد من المستثمرين."
          </p>
        </div>
      </div>
    </div>
  );
};

const SuggestedConnections = () => {
  const users = [
    { name: 'محمد علي', role: 'مستثمر ملائكي', avatar: 'https://i.pravatar.cc/150?u=11' },
    { name: 'فاطمة حسن', role: 'مؤسس تقني', avatar: 'https://i.pravatar.cc/150?u=12' },
  ];

  return (
    <div className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10">
      <h3 className="text-lg font-bold text-white mb-4">رواد قد تهمك متابعتهم</h3>
      <div className="space-y-4">
        {users.map((u, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={u.avatar} className="w-10 h-10 rounded-xl object-cover" alt={u.name} />
              <div>
                <div className="text-sm font-bold text-white">{u.name}</div>
                <div className="text-[10px] text-gray-500">{u.role}</div>
              </div>
            </div>
            <button className="p-2 text-[#FFD700] hover:bg-[#FFD700]/10 rounded-lg transition-all"><Plus size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const UpcomingEvents = () => {
  return (
    <div className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10">
      <h3 className="text-lg font-bold text-white mb-4">فعاليات قادمة</h3>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex flex-col items-center justify-center text-[#FFD700]">
            <span className="text-[10px] font-bold">MAR</span>
            <span className="text-xs font-bold">12</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white">جلسة Pitching مع RAED</div>
            <div className="text-[10px] text-gray-500">8:00 مساءً - أونلاين</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendingSectors = () => {
  const sectors = ['الذكاء الاصطناعي', 'التكنولوجيا المالية', 'التجارة الإلكترونية', 'التعليم الرقمي'];
  return (
    <div className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10">
      <h3 className="text-lg font-bold text-white mb-4">قطاعات رائجة</h3>
      <div className="flex flex-wrap gap-2">
        {sectors.map((s, i) => (
          <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 hover:text-[#FFD700] transition-colors cursor-pointer">
            #{s.replace(' ', '_')}
          </span>
        ))}
      </div>
    </div>
  );
};

const PostSkeleton = () => (
  <div className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="w-32 h-4 rounded-full" />
        <Skeleton className="w-20 h-3 rounded-full" />
      </div>
    </div>
    <Skeleton className="w-full h-24 rounded-2xl" />
    <div className="flex gap-4">
      <Skeleton className="w-16 h-8 rounded-full" />
      <Skeleton className="w-16 h-8 rounded-full" />
    </div>
  </div>
);

const EmptyFeed = ({ onReset }: { onReset: () => void }) => (
  <div className="text-center py-20">
    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
      <Globe size={40} className="text-gray-600" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">لا توجد منشورات بعد</h3>
    <p className="text-gray-400 mb-8">كن أول من يشارك تحديثاته مع مجتمع رواد</p>
    <button 
      onClick={onReset}
      className="px-8 py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFC000] transition-all"
    >
      عرض كل المنشورات
    </button>
  </div>
);
