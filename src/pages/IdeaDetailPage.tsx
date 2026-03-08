import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lightbulb, Users, DollarSign, ArrowLeft, Target, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

interface Idea {
  id: string;
  title: string;
  description: string;
  sector: string;
  funding_needed: number;
  status: string;
  created_at: string;
  owner: {
    name: string;
    avatar_url: string;
  };
}

export const IdeaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchIdea = async () => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select(`
            *,
            owner:owner_id (name, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setIdea(data);
      } catch (error) {
        console.error('Error fetching idea:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto">
        <div className="skeleton-card h-96" />
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">المشروع غير موجود</h2>
        <button onClick={() => navigate('/marketplace')} className="text-[#FFD700] hover:underline">
          العودة للسوق
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto relative overflow-hidden pb-20">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> العودة
        </button>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="linear-card p-8 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{idea.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={14} />
                <span>نشر في {new Date(idea.created_at).toLocaleDateString('ar-EG')}</span>
                <span>•</span>
                <span>بواسطة {idea.owner?.name || 'مستخدم'}</span>
              </div>
            </div>
            <span className="px-4 py-2 rounded-full bg-[#FFD700]/10 text-[#FFD700] font-bold text-sm whitespace-nowrap border border-[#FFD700]/20">
              {idea.sector || 'عام'}
            </span>
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <h3 className="text-xl font-bold text-white mb-4">وصف المشروع</h3>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{idea.description}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} className="p-6 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-3 bg-[#FFD700]/10 rounded-xl">
                <Target className="text-[#FFD700]" />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">الحالة</p>
                <p className="text-white font-bold capitalize">{idea.status}</p>
              </div>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="p-6 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-3 bg-[#FFD700]/10 rounded-xl">
                <DollarSign className="text-[#FFD700]" />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">التمويل المطلوب</p>
                <p className="text-white font-bold">
                  {idea.funding_needed ? `$${idea.funding_needed.toLocaleString()}` : 'غير محدد'}
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="p-6 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-3 bg-[#FFD700]/10 rounded-xl">
                <Users className="text-[#FFD700]" />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">صاحب المشروع</p>
                <p className="text-white font-bold">{idea.owner?.name || 'مجهول'}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
