import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const NotFoundPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-bold text-[#FFD700] mb-4">404</h1>
      <p className="text-white text-2xl mb-8">الصفحة غير موجودة</p>
      <Link 
        to={user ? '/feed' : '/'} 
        className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#FFC000] transition-colors"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
};
