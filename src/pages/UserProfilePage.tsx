import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, MapPin, Briefcase, Star, MessageSquare, ArrowLeft, Shield, Award, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (id === 'me' || !id) {
          // Handled by ProfileRedirect usually, but just in case
          navigate('/profile/me');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
          setProfile({
            ...data,
            name: data.full_name || 'مستخدم',
            role: data.user_type || 'عضو',
            bio: data.onboarding_data?.quick_pitch || data.onboarding_data?.superpower || data.onboarding_data?.value || '',
            skills: data.onboarding_data?.skills || [],
            location: data.onboarding_data?.location || '',
            website: data.onboarding_data?.website || '',
            phone: data.onboarding_data?.phone || '',
            linkedin: data.onboarding_data?.linkedin || '',
          });
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">المستخدم غير موجود</h1>
        <button onClick={() => navigate(-1)} className="text-[#FFD700] hover:underline">العودة</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-24 pb-24 px-4 relative overflow-hidden">
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

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>العودة</span>
        </button>

        {/* Profile Card */}
        <div className="bg-[#141517] rounded-3xl border border-white/5 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-[#FFD700]/20 to-purple-500/20" />
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-[#141517] p-1 border border-white/10">
                <img 
                  src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=FFD700&color=000`} 
                  alt={profile.full_name} 
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  {profile.full_name}
                  {profile.user_type === 'investor' && <Shield size={18} className="text-[#FFD700]" />}
                </h1>
                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <Briefcase size={16} />
                  {profile.user_type === 'founder' ? 'مؤسس' : profile.user_type === 'investor' ? 'مستثمر' : 'صاحب مهارة'}
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => navigate(`/raed?context=profile&userId=${profile.id}`)}
                  className="flex-1 md:flex-none bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} className="text-[#FFD700]" />
                  اسأل RAED AI
                </button>
                <button className="flex-1 md:flex-none bg-[#FFD700] text-black px-6 py-2 rounded-xl font-bold hover:bg-[#FFC000] transition-colors flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  مراسلة
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">نبذة</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {profile.bio || 'لا توجد نبذة تعريفية حتى الآن.'}
                  </p>
                </div>

                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">المهارات</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <h3 className="font-bold text-white mb-4">معلومات</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-gray-400">
                      <MapPin size={16} className="text-gray-500" />
                      {profile.location || 'غير محدد'}
                    </li>
                    {profile.website && (
                      <li className="flex items-center gap-3 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD700] transition-colors truncate">
                          {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                      </li>
                    )}
                    {profile.phone && (
                      <li className="flex items-center gap-3 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <a href={`tel:${profile.phone}`} className="hover:text-[#FFD700] transition-colors" dir="ltr">
                          {profile.phone}
                        </a>
                      </li>
                    )}
                    {profile.linkedin && (
                      <li className="flex items-center gap-3 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD700] transition-colors truncate">
                          LinkedIn
                        </a>
                      </li>
                    )}
                    <li className="flex items-center gap-3 text-sm text-gray-400">
                      <Award size={16} className="text-gray-500" />
                      انضم في {new Date(profile.created_at || Date.now()).toLocaleDateString('ar-SA')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
