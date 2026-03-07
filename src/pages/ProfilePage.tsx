import React from 'react';
import { useParams } from 'react-router-dom';

export const ProfilePage = () => {
  const { id } = useParams();
  return (
    <div className="space-y-6">
      <div className="h-48 bg-gray-800 rounded-3xl" />
      <div className="p-6 rounded-3xl bg-[#141517] border border-white/10">
        <h1 className="text-2xl font-bold">ملف المستخدم {id}</h1>
        <p className="text-gray-400">نبذة عن المستخدم...</p>
      </div>
    </div>
  );
};
