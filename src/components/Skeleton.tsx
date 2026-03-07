import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height 
}) => {
  const baseClasses = 'relative overflow-hidden bg-[#1f2937] rounded-xl';
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-[#141517] border border-white/5 rounded-2xl p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="text" width="100%" height={60} />
    <div className="flex gap-2">
      <Skeleton variant="rectangular" width={60} height={24} />
      <Skeleton variant="rectangular" width={60} height={24} />
    </div>
    <div className="flex justify-between pt-4 border-t border-white/5">
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="30%" />
    </div>
    <Skeleton variant="rectangular" width="100%" height={40} />
  </div>
);
