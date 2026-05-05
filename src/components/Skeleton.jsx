import React from "react";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/6 rounded-xl ${className}`} />
);

export const MovieCardSkeleton = () => (
  <div className="h-72 w-48 rounded-2xl overflow-hidden shrink-0 relative">
    <div className="h-full w-full bg-white/6 animate-pulse rounded-2xl" />
    {/* shimmer sweep */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.6s_infinite] rounded-2xl" />
  </div>
);

export const HeroSkeleton = () => (
  <div className="h-[92vh] w-full relative bg-black overflow-hidden">
    <div className="absolute inset-0 bg-white/4 animate-pulse" />
    <div className="absolute bottom-0 left-0 px-16 pb-16 max-w-2xl space-y-4">
      <Skeleton className="w-28 h-6 rounded-full" />
      <Skeleton className="w-3/4 h-14" />
      <Skeleton className="w-1/2 h-4" />
      <Skeleton className="w-full h-16" />
      <div className="flex gap-3">
        <Skeleton className="w-36 h-12 rounded-full" />
        <Skeleton className="w-32 h-12 rounded-full" />
        <Skeleton className="w-28 h-12 rounded-full" />
      </div>
    </div>
  </div>
);

export const MovieDetailsSkeleton = () => (
  <div className="h-screen w-screen bg-black flex items-center justify-center px-16 relative">
    <div className="flex gap-8 items-center w-[90%] lg:w-[58%] z-20">
      <Skeleton className="h-[360px] w-64 shrink-0" />
      <div className="flex-1 space-y-5">
        <Skeleton className="w-3/4 h-12" />
        <div className="flex gap-4">
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-20 h-6" />
        </div>
        <Skeleton className="w-full h-28" />
        <div className="flex gap-4">
          <Skeleton className="w-32 h-10 rounded-3xl" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
    <div className="absolute inset-0 z-0">
      <Skeleton className="w-full h-full opacity-10" />
    </div>
  </div>
);

export default Skeleton;
