import React from 'react';
import { Plus } from 'lucide-react';

const STORIES = [
  { id: 1, user: 'أحمد', image: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, user: 'سارة', image: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, user: 'خالد', image: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, user: 'نورة', image: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, user: 'محمد', image: 'https://i.pravatar.cc/150?u=5' },
];

export const StoriesBar = () => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar mb-6">
      <div className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
        <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] p-1 relative">
          <div className="w-full h-full bg-[#141517] rounded-full flex items-center justify-center">
            <Plus className="text-[#FFD700]" />
          </div>
          <div className="absolute bottom-0 right-0 bg-[#FFD700] text-black rounded-full p-0.5 border-2 border-[#0d1117]">
            <Plus size={12} />
          </div>
        </div>
        <span className="text-xs text-gray-400">قصتي</span>
      </div>

      {STORIES.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group">
          <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] p-0.5 group-hover:scale-105 transition-transform">
            <img src={story.image} alt={story.user} className="w-full h-full rounded-full object-cover" />
          </div>
          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{story.user}</span>
        </div>
      ))}
    </div>
  );
};
