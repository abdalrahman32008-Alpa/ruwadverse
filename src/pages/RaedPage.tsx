import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RaedStudio } from '../components/RaedStudio';

export const RaedPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const context = searchParams.get('context');
  const userId = searchParams.get('userId');

  const initialMessage = context === 'profile' && userId 
    ? `أريد أن أسألك عن المستخدم الذي يحمل المعرف ${userId}. هل يمكنك مساعدتي في فهم مهاراته وكيف يمكننا التعاون؟`
    : undefined;

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-20 pb-24">
      <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] px-4">
        <RaedStudio initialMessage={initialMessage} />
      </div>
    </div>
  );
};
