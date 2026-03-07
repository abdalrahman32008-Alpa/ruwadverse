import React from 'react';

export const NotificationsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الإشعارات</h1>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 rounded-xl bg-[#141517] border border-white/10">
            إشعار جديد رقم {i}
          </div>
        ))}
      </div>
    </div>
  );
};
