import React from 'react';

export const LoadingSkeleton = ({ type = 'card' }: { type?: 'card' | 'list' | 'profile' }) => {
  if (type === 'profile') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="w-24 h-24 bg-white/10 rounded-full mx-auto" />
        <div className="h-4 bg-white/10 rounded w-1/2 mx-auto" />
        <div className="h-3 bg-white/10 rounded w-1/3 mx-auto" />
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/10 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 bg-white/10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-[#141517] border border-white/10 rounded-3xl p-6 animate-pulse">
          <div className="w-12 h-12 bg-white/10 rounded-xl mb-4" />
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/2 mb-4" />
          <div className="h-32 bg-white/5 rounded-xl" />
        </div>
      ))}
    </div>
  );
};
