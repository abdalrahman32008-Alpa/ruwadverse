import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, MessageSquare, ThumbsUp, ThumbsDown, Send, Bug, Lightbulb, MessageCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('general');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send to backend
    console.log({ rating, category, text });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setText('');
      onClose();
    }, 2000);
  };

  const categories = [
    { id: 'general', label: 'عام', icon: MessageCircle },
    { id: 'bug', label: 'مشكلة تقنية', icon: Bug },
    { id: 'feature', label: 'اقتراح ميزة', icon: Lightbulb },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative linear-card w-full max-w-md rounded-2xl p-1 shadow-2xl overflow-hidden"
          >
            <div className="bg-[#141517] rounded-xl p-6 relative z-10">
              <button 
                onClick={onClose}
                className="absolute top-4 left-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {!submitted ? (
                <>
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold mb-2 text-white">رأيك يهمنا</h3>
                    <p className="text-[#8A8F98] text-sm">ساعدنا في تحسين تجربة ruwadverse</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category */}
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                            category === cat.id 
                              ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' 
                              : 'bg-[#0B0C0E] border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/5'
                          }`}
                        >
                          <cat.icon size={18} />
                          <span className="text-xs font-medium">{cat.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center gap-2 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110 focus:outline-none group"
                        >
                          <Star 
                            size={28} 
                            className={`transition-colors ${
                              star <= rating 
                                ? "fill-[#FFD700] text-[#FFD700]" 
                                : "text-gray-700 group-hover:text-gray-500"
                            }`} 
                          />
                        </button>
                      ))}
                    </div>

                    {/* Text Area */}
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="أخبرنا المزيد عن تجربتك..."
                      className="w-full bg-[#0B0C0E] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#FFD700]/30 min-h-[120px] resize-none placeholder-gray-600 transition-colors"
                    />

                    <button
                      type="submit"
                      disabled={!rating}
                      className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC000] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FFD700]/10 hover:shadow-[#FFD700]/20"
                    >
                      <Send size={18} />
                      إرسال الملاحظات
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                    <ThumbsUp size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">شكراً لك!</h3>
                  <p className="text-[#8A8F98]">تم استلام ملاحظاتك بنجاح.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
