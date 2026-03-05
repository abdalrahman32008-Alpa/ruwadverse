import React, { useState } from 'react';
import { Search, Filter, Briefcase, MapPin, Code, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ExploreProps {
  type: 'projects' | 'cofounders';
}

export const ExploreSection = ({ type }: ExploreProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');

  const industries = ['All', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI'];
  const skills = ['All', 'Tech Lead', 'Marketing', 'Product', 'Sales', 'Operations'];

  // Mock Data
  const projects = [
    { id: 1, title: 'PayFast', industry: 'FinTech', location: 'Riyadh', stage: 'Seed', valuation: '5M SAR', desc: 'Seamless payments for SMEs in MENA.' },
    { id: 2, title: 'MedConnect', industry: 'HealthTech', location: 'Dubai', stage: 'Pre-Seed', valuation: '2M SAR', desc: 'Telemedicine platform connecting patients with specialists.' },
    { id: 3, title: 'LearnAI', industry: 'EdTech', location: 'Cairo', stage: 'Series A', valuation: '15M SAR', desc: 'AI-powered personalized learning paths for students.' },
    { id: 4, title: 'ShopEasy', industry: 'E-commerce', location: 'Jeddah', stage: 'Seed', valuation: '4M SAR', desc: 'Social commerce platform for local artisans.' },
  ];

  const cofounders = [
    { id: 1, name: 'Omar H.', role: 'Tech Lead', skills: ['React', 'Node.js', 'AWS'], location: 'Remote', experience: '5 years' },
    { id: 2, name: 'Layla M.', role: 'Marketing', skills: ['SEO', 'Growth', 'Content'], location: 'Riyadh', experience: '3 years' },
    { id: 3, name: 'Youssef K.', role: 'Product', skills: ['Product Strategy', 'UX', 'Agile'], location: 'Dubai', experience: '7 years' },
    { id: 4, name: 'Sara A.', role: 'Sales', skills: ['B2B Sales', 'Negotiation', 'CRM'], location: 'Cairo', experience: '4 years' },
  ];

  const filteredData = type === 'projects' 
    ? projects.filter(p => 
        (selectedIndustry === 'All' || p.industry === selectedIndustry) &&
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cofounders.filter(c => 
        (selectedSkill === 'All' || c.role === selectedSkill || c.skills.includes(selectedSkill)) &&
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
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
          filteredData.map((item: any) => (
            <div key={item.id} className="linear-card p-6 rounded-2xl hover:border-[#FFD700]/30 transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700]">
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
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.desc}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={14} />
                <span>{item.location}</span>
              </div>
            </div>
          ))
        ) : (
          filteredData.map((item: any) => (
            <div key={item.id} className="linear-card p-6 rounded-2xl hover:border-[#FFD700]/30 transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/5">
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
              <div className="flex flex-wrap gap-2 mb-4">
                {item.skills.map((skill: string) => (
                  <span key={skill} className="text-[10px] bg-[#141517] border border-white/10 px-2 py-1 rounded-full text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={14} />
                <span>{item.location}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
