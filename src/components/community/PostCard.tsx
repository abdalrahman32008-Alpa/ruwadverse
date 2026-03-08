import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PostProps {
  post: {
    id: string;
    user: { name: string; avatar: string; role: string };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;
    time: string;
    type: 'idea' | 'skill' | 'investment' | 'general';
  };
}

export const PostCard = ({ post }: PostProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#141517] border border-white/10 rounded-2xl p-4 mb-4 hover:border-white/20 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h4 className="font-bold text-sm hover:underline cursor-pointer">{post.user.name}</h4>
            <p className="text-xs text-gray-400">{post.user.role} • {post.time}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <p className="text-gray-300 mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.image && (
        <div className="mb-4 rounded-xl overflow-hidden border border-white/5">
          <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-96" />
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group">
          <Heart size={20} className="group-hover:fill-red-500" />
          <span className="text-sm">{post.likes}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-[#FFD700] transition-colors">
          <MessageCircle size={20} />
          <span className="text-sm">{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors">
          <Share2 size={20} />
          <span className="text-sm">{post.shares}</span>
        </button>
        <button className="text-gray-400 hover:text-[#FFD700] transition-colors">
          <Bookmark size={20} />
        </button>
      </div>
    </div>
  );
};
