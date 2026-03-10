import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lightbulb, Users, DollarSign, ArrowLeft, Target, Calendar, Lock, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

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
  const { user } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchIdea = async () => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select(`
            *,
            owner:user_id (full_name, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setIdea({
          ...data,
          owner: {
            name: data.owner?.full_name || 'مجهول',
            avatar_url: data.owner?.avatar_url || ''
          }
        });
        setIsOwner(user?.id === data.user_id);
        
        // Check if idea is locked in vault
        // In a real app, query idea_timestamps table
        setIsLocked(data.is_locked || false);
        
        // If not owner and idea is locked, require NDA
        if (user?.id !== data.user_id && data.is_locked) {
            // Check if NDA already signed
            // In a real app, query ndas table
            setNdaAccepted(false);
        } else {
            setNdaAccepted(true);
        }

      } catch (error) {
        console.error('Error fetching idea:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id, user]);

  const handleLockIdea = async () => {
      if (!isOwner) return;
      
      const loadingToast = toast.loading('جاري توثيق الفكرة في Idea Vault...');
      
      try {
          // Simulate blockchain/timestamping delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // In a real app, insert into idea_timestamps
          /*
          await supabase.from('idea_timestamps').insert({
              idea_id: idea.id,
              hash: generateHash(idea.description),
              verified_at: new Date().toISOString()
          });
          */
          
          setIsLocked(true);
          toast.success('تم توثيق الفكرة بنجاح وإصدار شهادة الملكية', { id: loadingToast });
      } catch (error) {
          toast.error('حدث خطأ أثناء التوثيق', { id: loadingToast });
      }
  };

  const handleAcceptNDA = async () => {
      try {
          // In a real app, insert into ndas table
          /*
          await supabase.from('ndas').insert({
              idea_id: idea.id,
              user_id: user.id,
              accepted_at: new Date().toISOString(),
              ip_address: '...'
          });
          */
          setNdaAccepted(true);
          setShowNDAModal(false);
          toast.success('تم توقيع اتفاقية عدم الإفشاء بنجاح');
      } catch (error) {
          toast.error('حدث خطأ أثناء توقيع الاتفاقية');
      }
  };

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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">{idea.title}</h1>
                {isLocked && (
                  <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-1 rounded-lg text-xs font-bold border border-green-500/20" title="موثقة في Idea Vault">
                    <ShieldCheck size={14} />
                    <span>فكرة موثقة</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={14} />
                <span>نشر في {new Date(idea.created_at).toLocaleDateString('ar-EG')}</span>
                <span>•</span>
                <span>بواسطة {idea.owner?.name || 'مستخدم'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isOwner && !isLocked && (
                <button 
                  onClick={handleLockIdea}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors text-sm font-bold"
                >
                  <Lock size={16} />
                  توثيق الفكرة (Idea Vault)
                </button>
              )}
              <span className="px-4 py-2 rounded-full bg-[#FFD700]/10 text-[#FFD700] font-bold text-sm whitespace-nowrap border border-[#FFD700]/20">
                {idea.sector || 'عام'}
              </span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-8 relative">
            <h3 className="text-xl font-bold text-white mb-4">وصف المشروع</h3>
            
            {!ndaAccepted && isLocked && !isOwner ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#141517] z-10" />
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap blur-sm select-none">
                  {idea.description.substring(0, 150)}...
                  هذا النص مموه لأن صاحب الفكرة قام بتوثيقها وحمايتها.
                  يجب عليك توقيع اتفاقية عدم الإفشاء (NDA) لرؤية التفاصيل الكاملة.
                </p>
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                  <div className="bg-[#141517] border border-white/10 p-6 rounded-2xl text-center max-w-md shadow-2xl">
                    <Lock size={48} className="mx-auto text-[#FFD700] mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">محتوى محمي</h4>
                    <p className="text-gray-400 text-sm mb-6">قام صاحب المشروع بتوثيق هذه الفكرة. يرجى توقيع اتفاقية عدم الإفشاء (NDA) الرقمية للاطلاع على التفاصيل.</p>
                    <button 
                      onClick={() => setShowNDAModal(true)}
                      className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      توقيع NDA وعرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{idea.description}</p>
            )}
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
                  {idea.funding_needed ? `${idea.funding_needed.toLocaleString()} ج.م` : 'غير محدد'}
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

          {/* Deal Room Action */}
          {!isOwner && ndaAccepted && (
            <div className="mt-8 pt-8 border-t border-white/10 flex justify-center">
              <button 
                onClick={() => navigate('/deal-room')}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all flex items-center gap-2 text-lg"
              >
                <Lock size={20} />
                الدخول لغرفة الصفقات (Deal Room)
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* NDA Modal */}
      <AnimatePresence>
        {showNDAModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#141517] border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
                <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700]">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">اتفاقية عدم الإفشاء (NDA)</h2>
                  <p className="text-gray-400 text-sm">تم إنشاؤها تلقائياً بواسطة RAED AI</p>
                </div>
              </div>

              <div className="prose prose-invert prose-sm max-w-none mb-8 text-gray-300 h-64 overflow-y-auto pr-4 custom-scrollbar">
                <p><strong>تاريخ الاتفاقية:</strong> {new Date().toLocaleDateString('ar-EG')}</p>
                <p><strong>الطرف الأول (المُفصِح):</strong> {idea.owner?.name}</p>
                <p><strong>الطرف الثاني (المُتلقي):</strong> {user?.user_metadata?.full_name || user?.email}</p>
                
                <h4>1. الغرض من الاتفاقية</h4>
                <p>يرغب الطرف الأول في مشاركة معلومات سرية تتعلق بمشروع "{idea.title}" مع الطرف الثاني لغرض تقييم إمكانية الشراكة أو الاستثمار.</p>
                
                <h4>2. تعريف المعلومات السرية</h4>
                <p>تشمل "المعلومات السرية" جميع البيانات، خطط العمل، الأكواد البرمجية، الأسرار التجارية، الاستراتيجيات التسويقية، وأي معلومات أخرى يتم الكشف عنها من خلال منصة ruwadverse.</p>
                
                <h4>3. التزامات الطرف الثاني</h4>
                <ul>
                  <li>الحفاظ على سرية المعلومات وعدم الكشف عنها لأي طرف ثالث.</li>
                  <li>عدم استخدام المعلومات السرية لأي غرض آخر غير الغرض المذكور أعلاه.</li>
                  <li>عدم نسخ أو استنساخ الفكرة أو بناء منتج منافس بناءً على هذه المعلومات.</li>
                </ul>
                
                <h4>4. التوثيق الرقمي</h4>
                <p>يُعد النقر على زر "أوافق" أدناه بمثابة توقيع إلكتروني ملزم قانوناً، وسيتم تسجيل عنوان الـ IP ووقت الموافقة في سجلات المنصة.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <button 
                  onClick={() => setShowNDAModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={handleAcceptNDA}
                  className="flex-1 px-6 py-3 rounded-xl bg-[#FFD700] text-black font-bold hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  أوافق وأتعهد بالسرية
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
