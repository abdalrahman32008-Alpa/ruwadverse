import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Link as LinkIcon, Calendar, Edit2, Grid, Briefcase, Award, Settings } from 'lucide-react';

const MOCK_USER = {
  id: '1',
  name: 'أحمد محمد',
  username: '@ahmed_dev',
  bio: 'مطور برمجيات شغوف ببناء منتجات تقنية مبتكرة. مؤسس منصة "تعلم".',
  location: 'الرياض، السعودية',
  website: 'ahmed.dev',
  joinDate: 'يناير 2024',
  followers: 1205,
  following: 450,
  avatar: 'https://i.pravatar.cc/150?u=1',
  cover: 'https://picsum.photos/seed/cover/1200/400',
  skills: ['React', 'Node.js', 'AI Integration', 'Product Management'],
  role: 'Founder'
};

const TABS = [
  { id: 'posts', label: 'المنشورات', icon: Grid },
  { id: 'projects', label: 'المشاريع', icon: Briefcase },
  { id: 'achievements', label: 'الإنجازات', icon: Award },
];

export const ProfilePage = ({ isMe = false }: { isMe?: boolean }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const isOwnProfile = isMe || id === 'me'; // Mock check or use auth context

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 rounded-3xl overflow-hidden bg-gray-800 relative group">
          <img src={MOCK_USER.cover} alt="Cover" className="w-full h-full object-cover" />
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
                <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="w-full h-full object-cover" />
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
              {MOCK_USER.name}
              <span className="bg-[#FFD700]/10 text-[#FFD700] text-xs px-2 py-1 rounded-full border border-[#FFD700]/20">
                {MOCK_USER.role}
              </span>
            </h1>
            <p className="text-gray-500 text-sm mb-4">{MOCK_USER.username}</p>
            <p className="text-gray-300 mb-4 max-w-2xl leading-relaxed">{MOCK_USER.bio}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                {MOCK_USER.location}
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon size={16} />
                <a href={`https://${MOCK_USER.website}`} target="_blank" rel="noreferrer" className="text-[#FFD700] hover:underline">
                  {MOCK_USER.website}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                انضم {MOCK_USER.joinDate}
              </div>
            </div>

            <div className="flex gap-6 text-sm mb-6">
              <div className="flex gap-1">
                <span className="font-bold text-white">{MOCK_USER.followers}</span>
                <span className="text-gray-500">متابع</span>
              </div>
              <div className="flex gap-1">
                <span className="font-bold text-white">{MOCK_USER.following}</span>
                <span className="text-gray-500">يتابع</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {MOCK_USER.skills.map(skill => (
                <span key={skill} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm text-gray-300 hover:border-[#FFD700]/50 transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
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
          <div className="text-center text-gray-500 py-10">
            <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد مشاريع حتى الآن</p>
          </div>
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
