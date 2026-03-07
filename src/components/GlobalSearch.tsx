import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, User, Lightbulb, Briefcase, TrendingUp, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const GlobalSearch = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // This logic is handled by parent, but good to have
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Search in multiple tables (simplified for demo)
      const [profiles, ideas, posts] = await Promise.all([
        supabase.from('profiles').select('id, full_name, user_type').ilike('full_name', `%${query}%`).limit(3),
        supabase.from('ideas').select('id, title').ilike('title', `%${query}%`).limit(3),
        supabase.from('posts').select('id, content, type').ilike('content', `%${query}%`).limit(3)
      ]);

      const combined = [
        ...(profiles.data?.map(p => ({ ...p, type: 'profile' })) || []),
        ...(ideas.data?.map(i => ({ ...i, type: 'idea' })) || []),
        ...(posts.data?.map(p => ({ ...p, type: 'post' })) || [])
      ];
      setResults(combined);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    onClose();
    if (item.type === 'profile') navigate(`/profile/${item.id}`);
    else if (item.type === 'idea') navigate('/marketplace');
    else if (item.type === 'post') navigate('/feed');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-[#141517] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center gap-4">
              <Search className="text-gray-500" size={20} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن رواد، أفكار، أو منشورات... (Ctrl+K)"
                className="flex-grow bg-transparent border-none outline-none text-white text-lg placeholder-gray-600"
              />
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {loading ? (
                <div className="p-8 text-center text-gray-500">جاري البحث...</div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group text-start"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FFD700] transition-colors">
                          {item.type === 'profile' ? <User size={20} /> : item.type === 'idea' ? <Lightbulb size={20} /> : <MessageSquare size={20} />}
                        </div>
                        <div>
                          <div className="text-white font-medium">{item.full_name || item.title || item.content.substring(0, 40) + '...'}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-widest">
                            {item.type === 'profile' ? 'مستخدم' : item.type === 'idea' ? 'فكرة' : 'منشور'}
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              ) : query.length > 2 ? (
                <div className="p-8 text-center text-gray-500">لا توجد نتائج لـ "{query}"</div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-sm">ابدأ الكتابة للبحث في ruwadverse</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-500">#أفكار</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-500">#مستثمرين</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-500">#تقنية</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600 uppercase tracking-widest">
              <span>استخدم الأسهم للتنقل</span>
              <span>اضغط Enter للاختيار</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
