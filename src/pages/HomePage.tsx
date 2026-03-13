import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, Users, Lightbulb, ArrowUpRight, Activity, Target, Sparkles, ChevronLeft, Flame, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SectorIntelligence } from '../components/SectorIntelligence';
import { STARTUP_ROADMAP } from '../constants/roadmap';

export const HomePage = () => {
  const { user, subscriptionTier } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    profileViews: 0,
    interactions: 0,
    partnerships: 0
  });

  const [recommendedProjects, setRecommendedProjects] = useState<any[]>([]);
  const [trendingIdeas, setTrendingIdeas] = useState<any[]>([]);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true);
  const [roadmapProgress, setRoadmapProgress] = useState({
    currentStageId: STARTUP_ROADMAP[0].id,
    completedStages: [] as string[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check onboarding status and roadmap progress
        if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('skills, bio, current_stage_id, completed_stages')
              .eq('id', user.id)
              .single();
            
            if (profile) {
              if (!profile.skills || profile.skills.length === 0 || !profile.bio) {
                setIsOnboardingComplete(false);
              }
              setRoadmapProgress({
                currentStageId: profile.current_stage_id || STARTUP_ROADMAP[0].id,
                completedStages: profile.completed_stages || []
              });
            }
        }

        // Fetch stats (using real counts where possible, or placeholders for specific user metrics not yet tracked)
        // For now, we'll use global stats as placeholders for "profile views" etc to show activity
        const [usersCount, ideasCount, investorsCount] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('ideas').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('user_type', 'investor')
        ]);

        setStats({
          profileViews: usersCount.count || 0, // Using total users as a proxy for "reach"
          interactions: ideasCount.count || 0, // Using total ideas as proxy for activity
          partnerships: investorsCount.count || 0 // Using total investors as proxy for opportunities
        });

        // Fetch recommended projects (latest ideas)
        const { data: ideas } = await supabase
          .from('ideas')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (ideas) {
          setRecommendedProjects(ideas.map(idea => ({
            id: idea.id,
            title: idea.title,
            sector: idea.sector,
            role: t('coFounderRole') // Default role
          })));
        }

        // Fetch Trending Ideas (simulated by random selection for now)
        const { data: trending } = await supabase
          .from('ideas')
          .select('id, title, sector, funding_needed')
          .limit(4);
          
        if (trending) {
            setTrendingIdeas(trending);
        }

      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, t]);

  const statCards = [
    { 
      label: t('startupProgressLabel'), 
      value: `${Math.round((roadmapProgress.completedStages.length / STARTUP_ROADMAP.length) * 100)}%`, 
      icon: Target, 
      color: 'text-[#FFD700]', 
      bg: 'bg-[#FFD700]/10' 
    },
    { 
      label: t('profileStrengthLabel'), 
      value: `${isOnboardingComplete ? '100%' : '60%'}`, 
      icon: Users, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10' 
    },
    { 
      label: t('activeOpportunitiesLabel'), 
      value: stats.partnerships, 
      icon: Sparkles, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-24 pb-24 px-4 relative overflow-hidden w-full">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Onboarding Progress Bar */}
        {!isOnboardingComplete && user && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#141517] border border-[#FFD700]/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-[#FFD700]/5"
            >
                <div className="flex-1 w-full">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-white">{t('profileIncomplete')} (60%)</span>
                        <span className="text-[#FFD700]">{t('completeProfileToUnlock')}</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-2">
                        <div className="bg-[#FFD700] h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/settings')}
                    className="shrink-0 bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors border border-[#FFD700]/20"
                >
                    {t('completeProfileNow')}
                </button>
            </motion.div>
        )}

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141517] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2 flex flex-wrap items-center gap-2">
              {t('welcomeBackHome')} <span className="text-[#FFD700]">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('userFallback')}</span>
              {subscriptionTier !== 'free' && (
                <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-xs px-2 py-1 rounded-full font-bold">PRO</span>
              )}
              👋
            </h1>
            <p className="text-gray-400">{t('startupOsReady')}</p>
          </div>
          <button 
            onClick={() => navigate('/ideas/new')}
            className="relative z-10 flex items-center gap-2 bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors shadow-lg shadow-[#FFD700]/20"
          >
            <PlusIcon size={20} />
            {t('addNewProject')}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card h-32">
                <div className="skeleton-line w-1/4 mb-4" />
                <div className="skeleton-line w-1/2 h-8 mb-2" />
                <div className="skeleton-line w-1/3" />
              </div>
            ))
          ) : (
            statCards.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#141517] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Startup Roadmap Summary */}
        {!loading && user && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141517] rounded-3xl border border-white/5 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[#FFD700] mb-2">
                  <Target size={20} />
                  <span className="text-sm font-bold uppercase tracking-wider">{t('roadmapProgress')}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">{t('yourStartupJourney')}</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
                  {STARTUP_ROADMAP.map((stage, idx) => {
                    const isCompleted = roadmapProgress.completedStages.includes(stage.id);
                    const isCurrent = roadmapProgress.currentStageId === stage.id;
                    
                    return (
                      <div key={stage.id} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted ? 'bg-[#FFD700] border-[#FFD700] text-black' : 
                          isCurrent ? 'bg-white/10 border-[#FFD700] text-[#FFD700]' : 
                          'bg-white/5 border-white/10 text-gray-600'
                        }`}>
                          {isCompleted ? <CheckCircle2 size={20} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                        </div>
                        <span className={`text-[10px] text-center font-medium ${isCurrent ? 'text-[#FFD700]' : 'text-gray-500'}`}>
                          {language === 'ar' ? stage.title : stage.titleEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <button 
                  onClick={() => navigate('/workspace')}
                  className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-400 font-medium">{t('currentStage')}</span>
                    <span className="text-[#FFD700] group-hover:text-white transition-colors">
                      {STARTUP_ROADMAP.find(s => s.id === roadmapProgress.currentStageId)?.title}
                    </span>
                  </div>
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommended Projects or Smart Empty State */}
          <div className="bg-[#141517] rounded-3xl border border-white/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex flex-wrap items-center gap-2">
                <Sparkles className="text-[#FFD700]" size={20} />
                {recommendedProjects.length > 0 ? t('recommendedForYou') : t('trendingIdeas')}
              </h2>
              <button onClick={() => navigate('/marketplace')} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                {t('viewAll')} <ChevronLeft size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-line w-3/4" />
                    <div className="skeleton-line w-1/2" />
                  </div>
                ))
              ) : recommendedProjects.length === 0 ? (
                <div className="space-y-4">
                  {trendingIdeas.map((idea) => (
                    <div key={idea.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer" onClick={() => navigate(`/idea/${idea.id}`)}>
                      <div>
                        <h3 className="font-bold text-white mb-1">{idea.title}</h3>
                        <p className="text-xs text-gray-400">{t('sectorLabel')} <span className="text-gray-300">{idea.sector || t('generalFallback')}</span></p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                          <Flame size={12} /> {t('trendingNow')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                recommendedProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer" onClick={() => navigate(`/idea/${project.id}`)}>
                    <div>
                      <h3 className="font-bold text-white mb-1">{project.title}</h3>
                      <p className="text-xs text-gray-400">{t('sectorLabel')} <span className="text-gray-300">{project.sector || t('generalFallback')}</span></p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded-lg">
                        {t('viewDetails')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions / RAED AI */}
          <div className="bg-gradient-to-br from-[#141517] to-[#1a1b1e] rounded-3xl border border-white/5 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-purple-500" />
            <h2 className="text-xl font-bold mb-2">{t('chatWithRaedHome')}</h2>
            <p className="text-gray-400 text-sm mb-6">{t('raedHomeDesc')}</p>
            
            <div className="space-y-3 mb-6">
              <button onClick={() => navigate('/raed')} className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300 border border-white/5`}>
                {t('raedPrompt1')}
              </button>
              <button onClick={() => navigate('/raed')} className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300 border border-white/5`}>
                {t('raedPrompt2')}
              </button>
            </div>

            <button onClick={() => navigate('/raed')} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold text-white flex items-center justify-center gap-2">
              {t('startNewChat')}
            </button>
          </div>
        </div>

        {/* Sector Intelligence */}
        <div className="mt-8">
          <SectorIntelligence />
        </div>

      </div>
    </div>
  );
};

const PlusIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
