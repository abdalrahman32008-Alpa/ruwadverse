import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: string;
  partnerName: string;
}

export const ReviewModal = ({ isOpen, onClose, partnerId, partnerName }: ReviewModalProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !user) return;

    setLoading(true);
    const { error } = await supabase.from('reviews').insert({
      reviewer_id: user.id,
      reviewed_id: partnerId,
      rating,
      comment
    });

    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setRating(0);
        setComment('');
      }, 2000);
    } else {
      console.error('Error submitting review:', error);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#141517] border border-white/10 rounded-2xl p-8 w-full max-w-md relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {!success ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2 text-center">قيم تجربتك</h2>
                <p className="text-gray-400 text-center mb-6">كيف كانت تجربتك مع {partnerName}؟</p>

                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-transform hover:scale-110 ${rating >= star ? 'text-[#FFD700]' : 'text-gray-600'}`}
                    >
                      <Star fill={rating >= star ? '#FFD700' : 'none'} />
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="اكتب تعليقاً (اختياري)..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#FFD700] h-32 mb-6 resize-none"
                ></textarea>

                <button
                  onClick={handleSubmit}
                  disabled={!rating || loading}
                  className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span> : 'إرسال التقييم'}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <Check size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">شكراً لك!</h3>
                <p className="text-gray-400">تم إرسال تقييمك بنجاح.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
