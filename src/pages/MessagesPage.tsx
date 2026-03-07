import React from 'react';

export const MessagesPage = () => {
  return (
    <div className="h-[calc(100vh-120px)] rounded-3xl bg-[#141517] border border-white/10 flex">
      <div className="w-1/3 border-l border-white/10 p-4">
        <h2 className="font-bold mb-4">المحادثات</h2>
        {[1, 2, 3].map(i => <div key={i} className="p-3 hover:bg-white/5 rounded-xl">محادثة {i}</div>)}
      </div>
      <div className="flex-1 p-4">
        <h2 className="font-bold mb-4">المحادثة النشطة</h2>
        <div className="h-full flex items-center justify-center text-gray-500">اختر محادثة للبدء</div>
      </div>
    </div>
  );
};
