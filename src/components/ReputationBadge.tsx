import React from 'react';
import { Star } from 'lucide-react';

export const ReputationBadge = ({ points }: { points: number }) => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700]">
      <Star size={14} fill="currentColor" />
      <span className="text-xs font-bold">{points} REP</span>
    </div>
  );
};
