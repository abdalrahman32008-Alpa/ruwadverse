import React, { useState } from 'react';
import { Bookmark, Grid, List, Search, Filter, MoreHorizontal, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_BOOKMARKS = [
  { id: 1, title: 'مشروع الطاقة الشمسية', type: 'project', date: '2024-03-01', image: 'https://picsum.photos/seed/solar/400/300' },
  { id: 2, title: 'فكرة تطبيق توصيل', type: 'idea', date: '2024-02-28', image: 'https://picsum.photos/seed/delivery/400/300' },
  { id: 3, title: 'دورة ريادة الأعمال', type: 'resource', date: '2024-02-25', image: 'https://picsum.photos/seed/course/400/300' },
  { id: 4, title: 'تحليل السوق السعودي', type: 'article', date: '2024-02-20', image: 'https://picsum.photos/seed/market/400/300' },
];

export const BookmarksPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarks, setBookmarks] = useState(MOCK_BOOKMARKS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = bookmarks.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bookmark className="text-[#FFD700]" />
          المحفوظات
        </h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="بحث في المحفوظات..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141517] border border-white/10 rounded-xl py-2 pr-10 pl-4 focus:border-[#FFD700] outline-none transition-colors"
            />
          </div>
          <div className="flex bg-[#141517] rounded-xl p-1 border border-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Bookmark size={48} className="mx-auto mb-4 opacity-20" />
          <p>لا توجد عناصر محفوظة</p>
        </div>
      ) : (
        <motion.div 
          layout
          className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
        >
          <AnimatePresence>
            {filteredBookmarks.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-[#141517] border border-white/10 rounded-3xl overflow-hidden group hover:border-[#FFD700]/50 transition-colors ${
                  viewMode === 'list' ? 'flex items-center p-4 gap-6' : ''
                }`}
              >
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-32 h-24 rounded-xl shrink-0' : 'h-48'}`}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white border border-white/10">
                    {item.type === 'project' ? 'مشروع' : item.type === 'idea' ? 'فكرة' : 'مقال'}
                  </div>
                </div>

                <div className={`flex-1 ${viewMode === 'grid' ? 'p-6' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg group-hover:text-[#FFD700] transition-colors line-clamp-1">{item.title}</h3>
                    <button className="text-gray-400 hover:text-white">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                    تم الحفظ في {item.date}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <button className="text-sm font-bold text-[#FFD700] hover:underline">عرض التفاصيل</button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/5"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
