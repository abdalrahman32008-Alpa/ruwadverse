import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Link as LinkIcon, Calendar, Edit2, Grid, Briefcase, Award, Settings, User as UserIcon, ShieldCheck, Share2, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const TABS = [
  { id: 'posts', label: 'المنشورات', icon: Grid },
  { id: 'projects', label: 'المشاريع', icon: Briefcase },
  { id: 'achievements', label: 'الإنجازات', icon: Award },
];

export const ProfilePage = ({ isMe = false }: { isMe?: boolean }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userIdeas, setUserIdeas] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const profileId = isMe ? user?.id : (id === 'me' ? user?.id : id);
  const isOwnProfile = isMe || (user && profileId === user.id);
  
  // Mock reputation status
  const reputationStatus = 'موثوق'; // Could be 'تحت المراجعة' or 'موقوف' based on reports table
  const referralCode = profileId?.substring(0, 8).toUpperCase() || 'RUWAD26';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('تم نسخ رابط الدعوة بنجاح');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!profileId) return;

    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (userError) {
            // If user not found in public.profiles, try to get from auth if it's own profile
            if (isOwnProfile && user) {
                setProfile({
                    id: user.id,
                    name: user.user_metadata?.full_name || user.email?.split('@')[0],
                    role: user.user_metadata?.user_type || 'عضو',
                    avatar_url: user.user_metadata?.avatar_url,
                    created_at: user.created_at,
                    bio: user.user_metadata?.bio,
                    location: user.user_metadata?.location,
                    website: user.user_metadata?.website,
                    skills: user.user_metadata?.skills,
                    investment_interests: user.user_metadata?.investment_interests,
                    email: user.email,
                    phone: user.user_metadata?.phone,
                    linkedin: user.user_metadata?.linkedin,
                    followers_count: 0,
                    following_count: 0
                });
            } else {
                throw userError;
            }
        } else {
            // Map profiles table fields to expected UI fields
            setProfile({
                ...userData,
                name: userData.full_name || 'مستخدم',
                role: userData.user_type || 'عضو',
                bio: userData.onboarding_data?.quick_pitch || userData.onboarding_data?.superpower || userData.onboarding_data?.value || 'لا توجد نبذة',
                skills: userData.onboarding_data?.skills || [],
                followers_count: 0,
                following_count: 0
            });
        }

        // Fetch user ideas/projects
        const { data: ideasData } = await supabase
          .from('ideas')
          .select('*')
          .eq('user_id', profileId)
          .order('created_at', { ascending: false });

        setUserIdeas(ideasData || []);

      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, isOwnProfile, user]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-20 pt-24 px-4">
        <div className="h-64 rounded-3xl bg-[#161b22] animate-pulse" />
        <div className="px-6">
          <div className="flex justify-between items-end -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-[#141517] bg-[#161b22] animate-pulse" />
            <div className="w-32 h-10 rounded-xl bg-[#161b22] animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="w-1/3 h-8 rounded bg-[#161b22] animate-pulse" />
            <div className="w-1/2 h-4 rounded bg-[#161b22] animate-pulse" />
            <div className="w-2/3 h-4 rounded bg-[#161b22] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <UserIcon size={40} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">المستخدم غير موجود</h2>
        <p className="text-gray-400 mb-6">لم نتمكن من العثور على الملف الشخصي المطلوب.</p>
        <button onClick={() => navigate('/')} className="bg-[#FFD700] text-black px-6 py-2 rounded-xl font-bold">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 pt-24 px-4">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 rounded-3xl overflow-hidden bg-gray-800 relative group">
          <img 
            src={profile.cover_url || 'https://picsum.photos/seed/cover/1200/400'} 
            alt="Cover" 
            className="w-full h-full object-cover" 
          />
          {isOwnProfile && (
            <button className="absolute top-4 left-4 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
              <Edit2 size={18} />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-16 mb-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-[#141517] overflow-hidden bg-gray-700">
                <img 
                  src={profile.avatar_url || `https://i.pravatar.cc/150?u=${profile.id}`} 
                  alt={profile.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              {isOwnProfile && (
                <button className="absolute bottom-0 left-0 bg-[#FFD700] p-2 rounded-full text-black border-4 border-[#141517] hover:bg-[#FFC000] transition-colors">
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            <div className="flex gap-3 mb-2">
              {isOwnProfile ? (
                <button className="bg-[#141517] border border-white/10 text-white px-4 py-2 rounded-xl font-bold hover:bg-white/5 transition-colors flex items-center gap-2">
                  <Settings size={18} />
                  تعديل الملف
                </button>
              ) : (
                <button className="bg-[#FFD700] text-black px-6 py-2 rounded-xl font-bold hover:bg-[#FFC000] transition-colors">
                  متابعة
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {profile.name || 'مستخدم'}
                <span className="bg-[#FFD700]/10 text-[#FFD700] text-xs px-2 py-1 rounded-full border border-[#FFD700]/20">
                  {profile.role || 'عضو'}
                </span>
              </h1>
              {profile.raed_score > 0 && (
                <div className="flex items-center gap-1 bg-[#FFD700]/20 text-[#FFD700] px-2 py-1 rounded-lg text-xs font-bold border border-[#FFD700]/30" title="RAED Score">
                  <Sparkles size={14} />
                  <span>{profile.raed_score}</span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-1 rounded-lg text-xs font-bold border border-green-500/20" title="Reputation Shield">
                <ShieldCheck size={14} />
                <span>{reputationStatus}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">@{profile.email?.split('@')[0] || 'username'}</p>
            <p className="text-gray-300 mb-4 max-w-2xl leading-relaxed">
              {profile.bio || 'لا يوجد نبذة تعريفية بعد.'}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {profile.location}
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon size={16} />
                  <a href={profile.website} target="_blank" rel="noreferrer" className="text-[#FFD700] hover:underline">
                    {profile.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                انضم {new Date(profile.created_at).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
              </div>
            </div>

            <div className="flex gap-6 text-sm mb-6">
              <div className="flex gap-1">
                <span className="font-bold text-white">{profile.followers_count || 0}</span>
                <span className="text-gray-500">متابع</span>
              </div>
              <div className="flex gap-1">
                <span className="font-bold text-white">{profile.following_count || 0}</span>
                <span className="text-gray-500">يتابع</span>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="mb-8 space-y-4">
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">المهارات</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm text-gray-300 hover:border-[#FFD700]/50 transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.investment_interests && profile.investment_interests.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">الاهتمامات الاستثمارية</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.investment_interests.map((interest: string) => (
                      <span key={interest} className="bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] px-3 py-1 rounded-lg text-sm transition-colors cursor-default">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
              <h3 className="text-sm font-bold text-white mb-4">معلومات التواصل</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {profile.email && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <a href={`mailto:${profile.email}`} className="hover:text-[#FFD700] transition-colors">{profile.email}</a>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <a href={`tel:${profile.phone}`} className="hover:text-[#FFD700] transition-colors" dir="ltr">{profile.phone}</a>
                  </div>
                )}
                {profile.linkedin && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </div>
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#FFD700] transition-colors">LinkedIn</a>
                  </div>
                )}
              </div>
              {(!profile.email && !profile.phone && !profile.linkedin) && (
                <p className="text-gray-500 text-sm">لم يقم المستخدم بإضافة معلومات تواصل بعد.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Referral System (Only for own profile) */}
      {isOwnProfile && (
        <div className="bg-[#141517] border border-white/10 rounded-3xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Share2 className="text-[#FFD700]" size={20} />
                برنامج السفراء (Referral)
              </h3>
              <p className="text-sm text-gray-400">ادعُ 3 أصدقاء للتسجيل واحصل على اشتراك Pro مجاناً لمدة شهر.</p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 font-mono flex-1 text-left" dir="ltr">
                {referralLink}
              </div>
              <button 
                onClick={handleCopyReferral}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-colors shrink-0"
                title="نسخ الرابط"
              >
                {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-white/10 flex gap-8 px-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 flex items-center gap-2 transition-colors relative ${
              activeTab === tab.id ? 'text-[#FFD700]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={18} />
            <span className="font-bold">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD700]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6 min-h-[300px]">
        {activeTab === 'posts' && (
          <div className="text-center text-gray-500 py-10">
            <Grid size={48} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد منشورات حتى الآن</p>
          </div>
        )}
        {activeTab === 'projects' && (
          userIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userIdeas.map((idea) => (
                <div key={idea.id} className="bg-[#141517] p-4 rounded-xl border border-white/10">
                  <h3 className="font-bold text-white mb-2">{idea.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{idea.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
              <p>لا توجد مشاريع حتى الآن</p>
              {isOwnProfile && (
                <button onClick={() => navigate('/ideas/new')} className="mt-4 text-[#FFD700] hover:underline">
                  أضف مشروعك الأول
                </button>
              )}
            </div>
          )
        )}
        {activeTab === 'achievements' && (
          <div className="text-center text-gray-500 py-10">
            <Award size={48} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد إنجازات حتى الآن</p>
          </div>
        )}
      </div>
    </div>
  );
};
