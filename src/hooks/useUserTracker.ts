import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EvolutionEngine } from '../lib/evolutionEngine';

export const useUserTracker = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // تسجيل تغيير الصفحة
    EvolutionEngine.logActivity(
      user?.id,
      'page_view',
      location.pathname,
      { title: document.title }
    );

    // تشغيل محرك التطور بشكل عشوائي (بنسبة 5%) لتقليل استهلاك الـ API
    if (Math.random() < 0.05) {
      EvolutionEngine.analyzeAndEvolve();
    }
  }, [location.pathname, user?.id]);

  // دالة لتسجيل النقرات الهامة
  const trackClick = (elementId: string, metadata: any = {}) => {
    EvolutionEngine.logActivity(
      user?.id,
      'click',
      location.pathname,
      { elementId, ...metadata }
    );
  };

  return { trackClick };
};
