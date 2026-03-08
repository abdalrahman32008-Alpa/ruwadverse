import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Link as LinkIcon, Calendar, Edit2, Grid, Briefcase, Award, Settings, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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

  const profileId = isMe ? user?.id : id;
  const isOwnProfile = isMe || (user && id === user.id);

  useEffect(() => {
    if (!profileId) return;

    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('users') // Assuming 'users' table based on schema
          .select('*')
          .eq('id', profileId)
          .single();

        if (userError) {
            // If user not found in public.users, try to get from auth if it's own profile
            if (isOwnProfile && user) {
                setProfile({
                    id: user.id,
                    name: user.user_metadata?.full_name || user.email?.split('@')[0],
                    role: 'Founder', // Default
                    avatar_url: user.user_metadata?.avatar_url,
                    created_at: user.created_at
                });
            } else {
                throw userError;
            }
        } else {
            setProfile(userData);
        }

        // Fetch user ideas/projects
        const { data: ideasData } = await supabase
          .from('ideas')
          .select('*')
          .eq('owner_id', profileId)
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
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {profile.name || 'مستخدم'}
              <span className="bg-[#FFD700]/10 text-[#FFD700] text-xs px-2 py-1 rounded-full border border-[#FFD700]/20">
                {profile.role || 'عضو'}
              </span>
            </h1>
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

            {/* Skills */}
            {profile.skills && (
              <div className="flex flex-wrap gap-2 mb-8">
                {profile.skills.map((skill: string) => (
                  <span key={skill} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm text-gray-300 hover:border-[#FFD700]/50 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
