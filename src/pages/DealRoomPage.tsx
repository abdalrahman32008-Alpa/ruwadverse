import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, CheckCircle2, Lock, FileSignature, Upload, Download, Users, Loader2, ArrowRight, MessageSquare, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface Idea {
  id: string;
  title: string;
  user_id: string;
  owner: {
    full_name: string;
    avatar_url: string;
  };
}

export const DealRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'documents' | 'terms' | 'signatures'>('documents');
  const [creatingContract, setCreatingContract] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [terms, setTerms] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'system', text: string }[]>([
    { role: 'system', text: 'مرحباً بك في غرفة الصفقات الآمنة. يمكنك هنا مناقشة الشروط ومشاركة الملفات.' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!id) {
        setLoading(false);
        return;
    }

    const fetchIdea = async () => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select('*, owner:user_id(full_name, avatar_url)')
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

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim()) return;
      
      setMessages(prev => [...prev, { role: 'user', text: newMessage }]);
      setNewMessage('');
      
      // Simulate AI response or just keep it as a log
      setTimeout(() => {
          setMessages(prev => [...prev, { role: 'system', text: 'تم تسجيل رسالتك في سجل المفاوضات المشفر.' }]);
      }, 1000);
  };

  const handleCreateContract = async () => {
    if (!idea || !user) return;
    setCreatingContract(true);
    
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          founder_id: idea.user_id,
          investor_id: user.id,
          idea_id: idea.id,
          parties: [
            { name: idea.owner?.full_name || 'المؤسس', role: 'Founder', percentage: '90%' },
            { name: user.user_metadata?.full_name || 'المستثمر', role: 'Investor', percentage: '10%' }
          ],
          terms: terms || '1. استثمار مبلغ متفق عليه مقابل حصة 10%.\n2. الالتزام بجدول زمني للتطوير.\n3. تقارير شهرية عن الأداء.',
          signed: false,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('تم إنشاء مسودة العقد بنجاح! يمكنك الآن مراجعتها وتوقيعها.');
      navigate('/contracts');
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error('حدث خطأ أثناء إنشاء العقد.');
    } finally {
      setCreatingContract(false);
    }
  };

  const handleLegalReview = async () => {
    setIsReviewing(true);
    setReviewResult(null);
    
    // Simulate AI Legal Analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results = [
      "✅ جميع المستندات الأساسية (Pitch Deck, Financials) موجودة ومكتملة.",
      "⚠️ يوصى بتوضيح شروط الخروج (Exit Strategy) في مسودة العقد.",
      "✅ نسبة الحصة المعروضة (10%) تتماشى مع معايير السوق لمرحلة Seed.",
      "✅ تم التحقق من هوية المؤسس (KYC) بنجاح."
    ];
    
    setReviewResult(results.join('\n'));
    setIsReviewing(false);
    toast.success('اكتملت المراجعة القانونية الذكية');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] pt-24 flex justify-center">
        <Loader2 className="animate-spin text-[#FFD700]" size={40} />
      </div>
    );
  }

  if (!id || !idea) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] pt-24 px-4 flex flex-col items-center justify-center text-center">
        <Shield size={64} className="text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-white">غرفة الصفقات غير موجودة</h2>
        <p className="text-gray-400 mb-6">يرجى الدخول من صفحة المشروع بعد توقيع NDA.</p>
        <button onClick={() => navigate('/marketplace')} className="text-[#FFD700] hover:underline flex items-center gap-2">
          <ArrowRight size={16} /> العودة للسوق
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-[#141517] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">غرفة الصفقات: {idea.title}</h1>
                <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Lock size={12} /> مشفرة بالكامل
                </span>
              </div>
              <p className="text-gray-400">مساحة آمنة لمشاركة المستندات، مناقشة الشروط، وتوقيع العقود.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                  <img src={idea.owner?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(idea.owner?.full_name || 'Founder')}&background=141517&color=FFD700`} alt="Founder" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden -ml-4 border-2 border-[#141517]">
                  <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'Investor')}&background=141517&color=FFD700`} alt="Investor" />
                </div>
                <span className="text-sm text-gray-300 mr-2">مؤسس ومستثمر</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('documents')}
            className={`pb-4 px-4 font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'documents' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} /> المستندات السرية
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('terms')}
            className={`pb-4 px-4 font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'terms' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={18} /> مناقشة الشروط
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('signatures')}
            className={`pb-4 px-4 font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'signatures' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <FileSignature size={18} /> التوقيع الإلكتروني
            </div>
          </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'documents' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141517] rounded-3xl border border-white/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">المستندات المرفوعة</h2>
                  <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 border border-white/10">
                    <Upload size={16} /> رفع مستند
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Pitch Deck.pdf</p>
                        <p className="text-xs text-gray-500">2.4 MB • تم الرفع بواسطة المؤسس</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                      <Download size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Financial Projections.xlsx</p>
                        <p className="text-xs text-gray-500">1.1 MB • تم الرفع بواسطة المؤسس</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'terms' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141517] rounded-3xl border border-white/10 p-6 flex flex-col h-[500px]">
                 <h2 className="text-xl font-bold mb-6 text-white">سجل المفاوضات</h2>
                 <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#FFD700] text-black rounded-tr-none' : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                 </div>
                 <form onSubmit={handleSendMessage} className="relative">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-16 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                    />
                    <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-[#FFD700] text-black rounded-xl hover:bg-[#FFC000] transition-colors">
                        <Send size={18} />
                    </button>
                 </form>
              </motion.div>
            )}

            {activeTab === 'signatures' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141517] rounded-3xl border border-white/10 p-8 text-center">
                <div className="w-20 h-20 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileSignature size={40} className="text-[#FFD700]" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">إنشاء العقد النهائي</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    بمجرد الاتفاق على الشروط، سيقوم RAED AI بإنشاء عقد ذكي (Smart Contract) لضمان حقوق الطرفين.
                </p>
                
                <div className="mb-8 text-right">
                    <label className="block text-sm font-bold text-gray-400 mb-2">الشروط المتفق عليها (اختياري)</label>
                    <textarea 
                        value={terms}
                        onChange={(e) => setTerms(e.target.value)}
                        placeholder="اكتب الشروط هنا أو اتركها لـ RAED..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white h-32 focus:outline-none focus:border-[#FFD700]/50"
                    />
                </div>

                <button 
                  onClick={handleCreateContract}
                  disabled={creatingContract}
                  className="w-full bg-[#FFD700] text-black font-bold px-8 py-4 rounded-2xl hover:bg-[#FFC000] transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                >
                  {creatingContract ? <Loader2 className="animate-spin" /> : <FileSignature size={20} />}
                  إنشاء العقد وتوجيهه للتوقيع
                </button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#141517] rounded-3xl border border-white/10 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-white">
                <Shield className="text-green-500" size={18} />
                حالة الأمان
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 size={16} className="text-green-500" /> NDA موقع من الطرفين
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 size={16} className="text-green-500" /> تشفير End-to-End
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 size={16} className="text-green-500" /> هويات موثقة (KYC)
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#141517] to-[#1a1b1e] rounded-3xl border border-[#FFD700]/20 p-6">
              <h3 className="font-bold mb-2 text-[#FFD700]">مستشار RAED القانوني</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                يقوم RAED بتحليل المستندات المرفوعة للتأكد من خلوها من الثغرات القانونية ومطابقتها لمعايير السوق.
              </p>
              
              {reviewResult && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-black/20 p-3 rounded-xl border border-white/5 mb-4 text-[10px] text-gray-300 whitespace-pre-line"
                >
                  {reviewResult}
                </motion.div>
              )}

              <button 
                onClick={handleLegalReview}
                disabled={isReviewing}
                className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-sm transition-colors border border-white/10 flex items-center justify-center gap-2"
              >
                {isReviewing ? <Loader2 className="animate-spin" size={14} /> : <Shield size={14} />}
                {isReviewing ? 'جاري المراجعة...' : 'طلب مراجعة العقد'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
