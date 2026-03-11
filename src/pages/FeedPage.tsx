import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Filter, Sparkles, Heart, MessageCircle, Share2, MoreHorizontal, X, Image as ImageIcon, Send, Trophy, Loader2, Clock } from 'lucide-react';
import { Post } from '../types/social';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const FeedPage = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'reports'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 5;
  const observer = useRef<IntersectionObserver | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchPosts = async (pageNumber: number) => {
    try {
      if (pageNumber === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Fetch ideas as posts
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            user_type
          )
        `)
        .order('created_at', { ascending: false })
        .range(pageNumber * ITEMS_PER_PAGE, (pageNumber + 1) * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      if (data) {
        if (data.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        const formattedPosts: Post[] = data.map((idea: any, index: number) => {
          // Cycle through some types for visual variety in the demo
          const types: Post['type'][] = ['idea', 'educational', 'seeking_partners', 'success_story'];
          const postType = index % 4 === 0 ? 'idea' : (index % 4 === 1 ? 'educational' : (index % 4 === 2 ? 'seeking_partners' : 'success_story'));
          
          return {
            id: idea.id,
            author_id: idea.user_id,
            type: postType,
            content: idea.description || idea.title,
            media_urls: [],
            visibility: 'public',
            created_at: idea.created_at,
            updated_at: idea.created_at,
            author: {
              full_name: idea.profiles?.full_name || 'مستخدم',
              avatar_url: idea.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(idea.profiles?.full_name || 'User')}&background=141517&color=FFD700`,
              user_type: idea.profiles?.user_type || 'founder'
            },
            reactions_count: Math.floor(Math.random() * 50),
            comments_count: Math.floor(Math.random() * 10),
            user_reaction: null
          };
        });

        if (pageNumber === 0) {
          setPosts(formattedPosts);
        } else {
          setPosts(prev => [...prev, ...formattedPosts]);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchPosts(0);
  }, []);

  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchPosts(nextPage);
          return nextPage;
        });
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const handleLike = (postId: string) => {
    // Placeholder for like functionality
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !!post.user_reaction;
        return {
          ...post,
          reactions_count: (post.reactions_count || 0) + (isLiked ? -1 : 1),
          user_reaction: isLiked ? null : 'like'
        };
      }
      return post;
    }));
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert([
          {
            user_id: user.id,
            title: newPostContent.slice(0, 50) + (newPostContent.length > 50 ? '...' : ''), // Title from content
            description: newPostContent,
            sector: 'عام', // Default sector
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Optimistic update or refetch
      // For simplicity, we'll just reload the page or refetch, but here we add to state
      const newPost: Post = {
        id: data.id,
        author_id: user.id,
        type: 'idea',
        content: data.description,
        media_urls: [],
        visibility: 'public',
        created_at: data.created_at,
        updated_at: data.created_at,
        author: {
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'أنت',
          avatar_url: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || 'User')}&background=141517&color=FFD700`,
          user_type: 'founder'
        },
        reactions_count: 0,
        comments_count: 0,
        user_reaction: null
      };

      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto relative">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-[-200px] w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-[-200px] w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="flex items-center justify-between relative z-10">
        <h1 className="text-2xl font-bold">المجتمع</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#FFC000] transition-colors"
        >
          <Plus size={20} /> نشر فكرة
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-white/10 pb-1">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'feed' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          المنشورات
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'reports' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          التقارير والفلوجات
        </button>
      </div>

      {activeTab === 'feed' ? (
        <>
          {/* Create Post Input (Quick) */}
          <div className="p-4 rounded-3xl bg-[#141517] border border-white/10 flex gap-4 items-center cursor-pointer" onClick={() => setIsCreateModalOpen(true)}>
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
              <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'User')}&background=141517&color=FFD700`} alt="Me" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 bg-black/20 rounded-xl px-4 py-2 text-gray-400 text-sm">
              شارك فكرتك أو إنجازك الجديد...
            </div>
            <button className="text-[#FFD700]">
              <ImageIcon size={20} />
            </button>
          </div>

          {/* Feed Content */}
          <div className="space-y-6 mt-6">
            {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="skeleton-line w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="skeleton-line w-1/3 mb-2" />
                    <div className="skeleton-line w-1/4" />
                  </div>
                </div>
                <div className="skeleton-line w-full h-24 mb-4" />
                <div className="skeleton-line w-full h-48 rounded-xl" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-[#141517] rounded-3xl border border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد منشورات بعد</h3>
            <p className="text-gray-400 mb-6">كن أول من يشارك فكرة أو إنجاز مع المجتمع!</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#FFD700] text-black px-6 py-2 rounded-xl font-bold hover:bg-[#FFC000] transition-colors"
            >
              نشر فكرة
            </button>
          </div>
        ) : (
          <>
          <AnimatePresence>
            {posts.map((post, index) => {
              const isLastPost = index === posts.length - 1;
              const getPostTypeTag = (type: Post['type']) => {
                switch(type) {
                  case 'educational': return <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold">تعليمي</span>;
                  case 'seeking_partners': return <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">بحث عن شركاء</span>;
                  case 'success_story': return <span className="bg-[#FFD700]/10 text-[#FFD700] px-2 py-0.5 rounded text-[10px] font-bold">قصة نجاح</span>;
                  default: return <span className="bg-gray-500/10 text-gray-400 px-2 py-0.5 rounded text-[10px] font-bold">فكرة</span>;
                }
              };

              return (
            <motion.div 
              ref={isLastPost ? lastPostRef : null}
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-6 rounded-3xl border transition-colors ${
                post.type === 'success_story' 
                  ? 'bg-gradient-to-br from-[#141517] to-[#1a1b1e] border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]' 
                  : 'bg-[#141517] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => post.type !== 'success_story' && navigate(`/profile/${post.author_id}`)}
                    className={`w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center ${post.type !== 'success_story' ? 'cursor-pointer hover:ring-2 hover:ring-[#FFD700] transition-all' : ''}`}
                  >
                    {post.type === 'success_story' ? (
                        <Trophy className="text-[#FFD700]" size={24} />
                    ) : (
                        <img src={post.author?.avatar_url} alt={post.author?.full_name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div 
                    onClick={() => post.type !== 'success_story' && navigate(`/profile/${post.author_id}`)}
                    className={post.type !== 'success_story' ? "cursor-pointer group" : ""}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold flex items-center gap-2 ${post.type !== 'success_story' ? 'group-hover:text-[#FFD700] transition-colors' : 'text-[#FFD700]'}`}>
                        {post.author?.full_name}
                        {post.author?.user_type === 'investor' && <Sparkles size={14} className="text-[#FFD700]" />}
                      </h3>
                      {getPostTypeTag(post.type)}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-white p-2">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className={`mb-4 whitespace-pre-wrap leading-relaxed ${post.type === 'success_story' ? 'text-white font-medium text-lg' : 'text-gray-200'}`}>
                {post.content}
              </p>

              {post.media_urls && post.media_urls.length > 0 && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-white/5">
                  <img src={post.media_urls[0]} alt="Post content" className="w-full h-auto object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-2 sm:gap-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 text-sm transition-colors p-2 -m-2 sm:p-0 sm:m-0 ${post.user_reaction ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart size={20} fill={post.user_reaction ? "currentColor" : "none"} />
                    <span className="min-w-[1ch]">{post.reactions_count}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FFD700] transition-colors p-2 -m-2 sm:p-0 sm:m-0">
                    <MessageCircle size={20} />
                    <span className="min-w-[1ch]">{post.comments_count}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FFD700] transition-colors p-2 -m-2 sm:p-0 sm:m-0">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
            )})}
          </AnimatePresence>
          
          {loadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-[#FFD700]" size={32} />
            </div>
          )}
        </>
        )}
          </div>
        </>
      ) : (
        <div className="space-y-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">أحدث التقارير والفلوجات</h2>
            <button className="text-sm text-[#FFD700] hover:underline">كتابة تقرير جديد</button>
          </div>
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#141517] rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors cursor-pointer group">
              <div className="aspect-[21/9] relative overflow-hidden bg-gray-800">
                <img src={`https://ui-avatars.com/api/?name=Report+${i}&background=141517&color=FFD700`} alt="Report cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141517] to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <span className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-full">دراسة حالة</span>
                  <span className="text-xs text-gray-300 flex items-center gap-1"><Clock size={12} /> قراءة 5 دقائق</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#FFD700] transition-colors">كيف نجحت شركة X في مضاعفة أرباحها في السوق المصري؟</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  تحليل شامل لقصة نجاح إحدى الشركات الناشئة في مجال التكنولوجيا المالية، وكيف استطاعت التغلب على التحديات الاقتصادية والوصول إلى شريحة واسعة من المستخدمين.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=Author+${i}&background=141517&color=FFD700`} alt="Author" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">أحمد محمود</p>
                      <p className="text-[10px] text-gray-500">محلل أعمال</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-gray-400">
                    <span className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors"><Heart size={14} /> 120</span>
                    <span className="flex items-center gap-1 text-xs hover:text-[#FFD700] transition-colors"><MessageCircle size={14} /> 45</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1C1D20] w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-lg">إنشاء منشور جديد</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="p-4">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                    <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'User')}&background=141517&color=FFD700`} alt="Me" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="بم تفكر؟ شارك فكرتك مع مجتمع رواد..."
                      className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none min-h-[120px]"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <button className="p-2 text-[#FFD700] hover:bg-white/5 rounded-full transition-colors">
                      <ImageIcon size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors">
                      <Sparkles size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="bg-[#FFD700] text-black px-6 py-2 rounded-xl font-bold hover:bg-[#FFC000] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <span>نشر</span>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
