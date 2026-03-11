import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lightbulb, Users, DollarSign, ArrowLeft, Target, Calendar, Lock, ShieldCheck, FileText, CheckCircle2, Share2, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { StartupPassport } from '../components/StartupPassport';
import { MarketingKit } from '../components/MarketingKit';
import { EquityCalculator } from '../components/EquityCalculator';
import { SynergyMatrix } from '../components/futuristic/SynergyMatrix';
import { MarketSimulator } from '../components/futuristic/MarketSimulator';
import { RiskOracle } from '../components/futuristic/RiskOracle';
import { useSEO } from '../hooks/useSEO';

interface Idea {
  id: string;
  title: string;
  description: string;
  sector: string;
  funding_needed: number;
  status: string;
  created_at: string;
  raed_score?: number;
  stage?: string;
  owner: {
    name: string;
    avatar_url: string;
  };
}

import { useLanguage } from '../contexts/LanguageContext';

export const IdeaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useSEO(idea?.title || t('projectTitle'), idea?.description?.substring(0, 160));

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
            name: data.owner?.full_name || t('userFallback'),
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
      
      const loadingToast = toast.loading(t('lockingVault'));
      
      try {
          // Simulate blockchain/timestamping delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          setIsLocked(true);
          toast.success(t('lockSuccess'), { id: loadingToast });
      } catch (error) {
          toast.error(t('lockError'), { id: loadingToast });
      }
  };

  const handleAcceptNDA = async () => {
      try {
          setNdaAccepted(true);
          setShowNDAModal(false);
          toast.success(t('ndaSignSuccess'));
      } catch (error) {
          toast.error(t('ndaSignError'));
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
        <h2 className="text-2xl font-bold mb-4">{t('ideaNotFound')}</h2>
        <button onClick={() => navigate('/marketplace')} className="text-[#FFD700] hover:underline">
          {t('backToMarketplace')}
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
          <ArrowLeft size={16} /> {t('backBtn')}
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
                  <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-1 rounded-lg text-xs font-bold border border-green-500/20" title={t('verifiedIdea')}>
                    <ShieldCheck size={14} />
                    <span>{t('verifiedIdea')}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={14} />
                <span>{t('publishedOn')} {new Date(idea.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                <span>•</span>
                <span>{t('byAuthor')} {idea.owner?.name || t('userFallback')}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isOwner && !isLocked && (
                <button 
                  onClick={handleLockIdea}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors text-sm font-bold"
                >
                  <Lock size={16} />
                  {t('lockIdeaVault')}
                </button>
              )}
              <span className="px-4 py-2 rounded-full bg-[#FFD700]/10 text-[#FFD700] font-bold text-sm whitespace-nowrap border border-[#FFD700]/20">
                {idea.sector || t('fallbackSector')}
              </span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-8 relative">
            <h3 className="text-xl font-bold text-white mb-4">{t('projectDescription')}</h3>
            
            {!ndaAccepted && isLocked && !isOwner ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#141517] z-10" />
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap blur-sm select-none">
                  {idea.description.substring(0, 150)}...
                  {t('blurNote')}
                </p>
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                  <div className="bg-[#141517] border border-white/10 p-6 rounded-2xl text-center max-w-md shadow-2xl">
                    <Lock size={48} className="mx-auto text-[#FFD700] mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">{t('protectedContent')}</h4>
                    <p className="text-gray-400 text-sm mb-6">{t('protectedContentDesc')}</p>
                    <button 
                      onClick={() => setShowNDAModal(true)}
                      className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      {t('signNDABtn')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{idea.description}</p>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div whileHover={{ y: -5 }} className="p-6 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-3 bg-[#FFD700]/10 rounded-xl">
                <Target className="text-[#FFD700]" />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">{t('statusLabel')}</p>
                <p className="text-white font-bold capitalize">{idea.status}</p>
              </div>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="p-6 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-3 bg-[#FFD700]/10 rounded-xl">
                <DollarSign className="text-[#FFD700]" />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">{t('fundingNeededLabel')}</p>
                <p className="text-white font-bold">
                  {idea.funding_needed ? `${idea.funding_needed.toLocaleString()} ${t('currencyEGP')}` : t('notSpecified')}
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="p-6 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-3 bg-[#FFD700]/10 rounded-xl">
                <Users className="text-[#FFD700]" />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">{t('projectOwnerLabel')}</p>
                <p className="text-white font-bold">{idea.owner?.name || t('userFallback')}</p>
              </div>
            </motion.div>
          </div>

          {/* Futuristic Features */}
          <div className="mt-8 mb-8 space-y-8">
            {!isOwner ? (
              <>
                <SynergyMatrix 
                  matchScore={85} 
                  dimensions={{
                    vision: 90,
                    execution: 75,
                    riskTolerance: 80,
                    techStack: 95,
                    culture: 85
                  }} 
                />
                <RiskOracle />
              </>
            ) : (
              <MarketSimulator ideaTitle={idea.title} sector={idea.sector || 'Technology'} />
            )}
          </div>

          {/* Deal Room Action */}
          {!isOwner && ndaAccepted && (
            <div className="mt-8 pt-8 border-t border-white/10 flex justify-center">
              <button 
                onClick={() => navigate(`/deal-room/${idea.id}`)}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all flex items-center gap-2 text-lg"
              >
                <Lock size={20} />
                {t('enterDealRoom')}
              </button>
            </div>
          )}
          
          {/* Equity Calculator */}
          {isOwner && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <EquityCalculator ideaId={idea.id} />
            </div>
          )}
        </motion.div>

        {/* Marketing & Growth Tools (Visible to Owner) */}
        {isOwner && (
          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#141517]/80 backdrop-blur-md border border-white/10 rounded-[32px] p-8"
            >
              <StartupPassport 
                idea={{
                  title: idea.title,
                  sector: idea.sector,
                  stage: idea.stage || 'Early Stage',
                  raed_score: idea.raed_score || 85,
                  author_name: idea.owner.name
                }} 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#141517]/80 backdrop-blur-md border border-white/10 rounded-[32px] p-8"
            >
              <MarketingKit 
                idea={{
                  title: idea.title,
                  description: idea.description,
                  sector: idea.sector
                }} 
              />
            </motion.div>
          </div>
        )}
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
                  <h2 className="text-2xl font-bold text-white">{t('ndaTitle')}</h2>
                  <p className="text-gray-400 text-sm">{t('ndaGeneratedBy')}</p>
                </div>
              </div>

              <div className="prose prose-invert prose-sm max-w-none mb-8 text-gray-300 h-64 overflow-y-auto pr-4 custom-scrollbar">
                <p><strong>{t('ndaDate')}:</strong> {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
                <p><strong>{t('ndaParty1')}:</strong> {idea.owner?.name}</p>
                <p><strong>{t('ndaParty2')}:</strong> {user?.user_metadata?.full_name || user?.email}</p>
                
                <h4>{t('ndaPurposeTitle')}</h4>
                <p>{t('ndaPurposeDesc', { title: idea.title })}</p>
                
                <h4>{t('ndaDefinitionTitle')}</h4>
                <p>{t('ndaDefinitionDesc')}</p>
                
                <h4>{t('ndaObligationsTitle')}</h4>
                <ul>
                  <li>{t('ndaObligations1')}</li>
                  <li>{t('ndaObligations2')}</li>
                  <li>{t('ndaObligations3')}</li>
                </ul>
                
                <h4>{t('ndaDigitalSignatureTitle')}</h4>
                <p>{t('ndaDigitalSignatureDesc')}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <button 
                  onClick={() => setShowNDAModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                >
                  {t('cancelBtn')}
                </button>
                <button 
                  onClick={handleAcceptNDA}
                  className="flex-1 px-6 py-3 rounded-xl bg-[#FFD700] text-black font-bold hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  {t('agreeAndPledge')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
