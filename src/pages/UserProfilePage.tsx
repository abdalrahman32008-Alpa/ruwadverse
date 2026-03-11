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
    // In a real app, fetch from Supabase. For now, mock it if not found.
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
          setProfile(data);
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
                    <li className="flex items-center gap-3 text-sm text-gray-400">
                      <Award size={16} className="text-gray-500" />
                      انضم في {new Date(profile.joined_at || Date.now()).toLocaleDateString('ar-SA')}
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
