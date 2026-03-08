import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Filter, Sparkles, Heart, MessageCircle, Share2, MoreHorizontal, X, Image as ImageIcon, Send } from 'lucide-react';
import { Post } from '../types/social';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch ideas as posts
        const { data, error } = await supabase
          .from('ideas')
          .select(`
            *,
            users (
              id,
              name,
              avatar_url,
              role
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedPosts: Post[] = data.map((idea: any) => ({
            id: idea.id,
            author_id: idea.owner_id,
            type: 'idea',
            content: idea.description || idea.title, // Use description or title as content
            media_urls: [], // No media in ideas table yet
            visibility: 'public',
            created_at: idea.created_at,
            updated_at: idea.created_at,
            author: {
              full_name: idea.users?.name || 'مستخدم',
              avatar_url: idea.users?.avatar_url || `https://i.pravatar.cc/150?u=${idea.owner_id}`,
              user_type: idea.users?.role || 'founder'
            },
            reactions_count: 0, // No reactions table yet
            comments_count: 0, // No comments table yet
            user_reaction: null
          }));
          setPosts(formattedPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
            owner_id: user.id,
            title: newPostContent.slice(0, 50) + (newPostContent.length > 50 ? '...' : ''), // Title from content
            description: newPostContent,
            status: 'analyzing'
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
          avatar_url: user.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`,
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
      
      {/* Stories Bar */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 p-0.5 flex items-center justify-center bg-[#141517]">
            <Plus className="text-gray-400" />
          </div>
          <span className="text-xs text-gray-400">قصتك</span>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] p-0.5">
              <img 
                src={`https://i.pravatar.cc/150?u=${i}`} 
                alt={`User ${i}`}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-400">مستخدم {i}</span>
          </div>
        ))}
      </div>

      {/* Create Post Input (Quick) */}
      <div className="p-4 rounded-3xl bg-[#141517] border border-white/10 flex gap-4 items-center cursor-pointer" onClick={() => setIsCreateModalOpen(true)}>
        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
          <img src={user?.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${user?.id}`} alt="Me" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 bg-black/20 rounded-xl px-4 py-2 text-gray-400 text-sm">
          شارك فكرتك أو إنجازك الجديد...
        </div>
        <button className="text-[#FFD700]">
          <ImageIcon size={20} />
        </button>
      </div>

      {/* Feed Content */}
      <div className="space-y-6">
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
          <AnimatePresence>
            {posts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 rounded-3xl bg-[#141517] border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => navigate(`/profile/${post.author_id}`)}
                    className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 cursor-pointer hover:ring-2 hover:ring-[#FFD700] transition-all"
                  >
                    <img src={post.author?.avatar_url} alt={post.author?.full_name} className="w-full h-full object-cover" />
                  </div>
                  <div 
                    onClick={() => navigate(`/profile/${post.author_id}`)}
                    className="cursor-pointer group"
                  >
                    <h3 className="font-bold flex items-center gap-2 group-hover:text-[#FFD700] transition-colors">
                      {post.author?.full_name}
                      {post.author?.user_type === 'investor' && <Sparkles size={14} className="text-[#FFD700]" />}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-white">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className="text-gray-200 mb-4 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>

              {post.media_urls && post.media_urls.length > 0 && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-white/5">
                  <img src={post.media_urls[0]} alt="Post content" className="w-full h-auto object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 text-sm transition-colors ${post.user_reaction ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart size={20} fill={post.user_reaction ? "currentColor" : "none"} />
                    <span>{post.reactions_count}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FFD700] transition-colors">
                    <MessageCircle size={20} />
                    <span>{post.comments_count}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FFD700] transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        )}
      </div>

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
                    <img src={user?.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${user?.id}`} alt="Me" className="w-full h-full object-cover" />
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
