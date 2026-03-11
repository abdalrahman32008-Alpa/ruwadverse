import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Lightbulb, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  // Mock search results
  const results = query.length > 1 ? [
    { id: '1', type: 'idea', title: 'منصة تعليمية بالذكاء الاصطناعي', icon: Lightbulb, path: '/idea/1' },
    { id: '2', type: 'user', title: 'أحمد محمد - مطور واجهات', icon: Users, path: '/profile/user1' },
    { id: '3', type: 'skill', title: 'تطوير تطبيقات React', icon: Briefcase, path: '/marketplace?q=react' },
  ] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#141517] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 border-b border-white/10">
              <Search className="text-gray-400" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن أفكار، مستخدمين، مهارات..."
                className="flex-1 bg-transparent border-none outline-none text-white px-4 py-4 text-lg placeholder-gray-500"
              />
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="mx-auto mb-4 opacity-20" size={48} />
                  <p>اكتب للبحث في مجتمع رواد</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  <div className="text-xs font-bold text-gray-500 px-3 py-2 uppercase tracking-wider">النتائج</div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleNavigate(result.path)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group text-right"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#FFD700] group-hover:border-[#FFD700]/30 transition-colors">
                          <result.icon size={20} />
                        </div>
                        <span className="text-gray-300 group-hover:text-white transition-colors">{result.title}</span>
                      </div>
                      <ArrowLeft size={16} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>لا توجد نتائج لـ "{query}"</p>
                </div>
              )}
            </div>
            
            <div className="px-4 py-3 border-t border-white/5 bg-black/20 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded font-mono">↑</kbd> <kbd className="bg-white/10 px-1.5 py-0.5 rounded font-mono">↓</kbd> للتنقل</span>
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded font-mono">Enter</kbd> للاختيار</span>
              </div>
              <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded font-mono">ESC</kbd> للإغلاق</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
