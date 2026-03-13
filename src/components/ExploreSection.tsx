import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, MapPin, Code, TrendingUp, Users, Sparkles, Flame, Award, Shield, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateMatchScore, UserProfile } from '../utils/gamification';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ExploreProps {
  type: 'projects' | 'cofounders';
}

export const ExploreSection = ({ type }: ExploreProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  const industries = ['All', 'EdTech', 'FinTech', 'HealthTech', 'E-commerce', 'AI', 'Logistics', 'PropTech', 'AgriTech', 'Sustainability', 'Tourism', 'Cybersecurity', 'Other'];
  const skills = ['All', 'Tech Lead', 'Marketing', 'Product', 'Sales', 'Operations'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileData) {
            setCurrentUserProfile({
              id: profileData.id,
              userType: profileData.user_type || 'idea',
              skills: profileData.skills || [],
              interests: profileData.interests || [],
              experience: profileData.experience_years || 0,
              endorsements: 0
            });
          }
        }

        if (type === 'projects') {
          const { data, error } = await supabase
            .from('ideas')
            .select('*, owner:user_id(full_name, avatar_url)')
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            setItems(data.map(idea => ({
              id: idea.id,
              title: idea.title,
              industry: idea.sector || 'عام',
              location: 'السعودية', // Default or from profile
              stage: idea.status || 'فكرة',
              valuation: idea.funding_needed ? `${idea.funding_needed} SAR` : 'غير محدد',
              desc: idea.description,
              skills: [idea.sector || 'عام'],
              enthusiasm: Math.floor(Math.random() * 30) + 70, // Simulated for now
              confidence: Math.floor(Math.random() * 40) + 60, // Simulated for now
            })));
          } else {
            setItems([]);
          }
        } else {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_type', 'skill')
            .limit(10);
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            setItems(data.map(profile => ({
              id: profile.id,
              name: profile.full_name || 'مستخدم',
              role: profile.role || 'مستقل',
              skills: profile.skills || ['عام'],
              location: profile.location || 'عن بعد',
              experience: profile.experience_years || 2,
              endorsements: 0,
              userType: 'skill',
              level: (profile.experience_years || 2) > 5 ? 'Expert' : 'Intermediate'
            })));
          } else {
            setItems([]);
          }
        }
      } catch (error) {
        console.error('Error fetching explore data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  // Current User for matching
  const currentUser: UserProfile = currentUserProfile || {
    id: user?.id || 'me',
    userType: user?.user_metadata?.user_type || 'idea',
    skills: [],
    interests: [],
    experience: 0,
    endorsements: 0
  };

  const getMatchScore = (item: any) => {
    // Map item to UserProfile format for calculation
    const otherUser: UserProfile = {
      id: item.id.toString(),
      userType: type === 'projects' ? 'investor' : 'skill', // simplified assumption
      skills: item.skills || [],
      interests: [],
      experience: item.experience || (item.stage === 'Seed' ? 2 : 5),
      endorsements: item.endorsements || 0
    };
    return calculateMatchScore(currentUser, otherUser);
  };

  const filteredData = items.filter(item => {
    if (type === 'projects') {
      return (selectedIndustry === 'All' || item.industry === selectedIndustry) &&
             item.title.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return (selectedSkill === 'All' || item.role === selectedSkill || (item.skills && item.skills.includes(selectedSkill))) &&
             item.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#FFD700]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4" role="search">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 rtl:right-3 rtl:left-auto" size={20} aria-hidden="true" />
          <input 
            type="text" 
            aria-label={type === 'projects' ? t('searchProjects') : t('searchCofounders')}
            placeholder={type === 'projects' ? t('searchProjects') || 'Search projects...' : t('searchCofounders') || 'Search co-founders...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141517] border border-white/10 rounded-xl py-3 px-10 text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none transition-colors"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <div className="relative">
            <select 
              aria-label={t('filterByIndustry') || "Filter by Industry"}
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="appearance-none bg-[#141517] border border-white/10 rounded-xl py-3 px-4 pr-10 text-white focus:border-[#FFD700] focus:outline-none cursor-pointer min-w-[140px]"
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>
                  {ind === 'All' ? t('filterAll') : t(`opt_${ind.toLowerCase()}`)}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none rtl:left-3 rtl:right-auto" size={16} aria-hidden="true" />
          </div>

          {type === 'cofounders' && (
            <div className="relative">
              <select 
                aria-label={t('filterBySkill') || "Filter by Skill"}
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="appearance-none bg-[#141517] border border-white/10 rounded-xl py-3 px-4 pr-10 text-white focus:border-[#FFD700] focus:outline-none cursor-pointer min-w-[140px]"
              >
                {skills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
              </select>
              <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none rtl:left-3 rtl:right-auto" size={16} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {type === 'projects' ? (
          filteredData.map((item: any, index: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id} 
              className="linear-card p-6 rounded-2xl hover:border-[#FFD700]/30 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] group-hover:scale-110 transition-transform">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-[#FFD700] transition-colors">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.industry} • {item.stage}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#FFD700] bg-[#FFD700]/5 px-2 py-1 rounded border border-[#FFD700]/10">
                  {item.valuation}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2 relative z-10">{item.desc}</p>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${item.enthusiasm > 80 ? 'text-orange-500' : 'text-gray-500'}`}>
                    <Flame size={14} className={item.enthusiasm > 80 ? 'animate-pulse' : ''} />
                    <span>{item.enthusiasm}% {t('founderEnthusiasm')}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${item.confidence > 80 ? 'text-blue-400' : 'text-gray-500'}`}>
                    <Shield size={14} />
                    <span>{item.confidence}% {t('investorConfidence')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                  <Sparkles size={12} />
                  <span>{getMatchScore(item)}% Match</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          filteredData.map((item: any, index: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id} 
              className="linear-card p-6 rounded-2xl hover:border-[#FFD700]/30 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/5 group-hover:border-[#FFD700]/50 group-hover:text-[#FFD700] transition-colors">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-[#FFD700] transition-colors">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                  {item.experience} exp
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                {item.skills.map((skill: string) => (
                  <span key={skill} className="text-[10px] bg-[#141517] border border-white/10 px-2 py-1 rounded-full text-gray-300 group-hover:border-white/20 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#FFD700]">
                    <Award size={14} />
                    <span>{item.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                  <Sparkles size={12} />
                  <span>{getMatchScore(item)}% Match</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
