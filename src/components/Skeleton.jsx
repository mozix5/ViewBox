import React from "react";

const Skeleton = ({ className }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
  </div>
);

export const MovieCardSkeleton = () => (
  <div className="h-72 w-48 rounded-2xl overflow-hidden shrink-0">
    <Skeleton className="h-full w-full rounded-2xl" />
  </div>
);

export const HeroSkeleton = () => (
  <div className="h-[92vh] w-full relative bg-black overflow-hidden">
    <Skeleton className="absolute inset-0 opacity-40" />
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

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <Skeleton className="w-36 h-36 rounded-full shrink-0" />
        <div className="flex-1 space-y-4 w-full">
          <Skeleton className="w-1/2 h-10" />
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-1/4 h-3" />
          <div className="flex gap-3">
            <Skeleton className="w-32 h-12 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="flex justify-between mb-4">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-16 h-4" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-24 h-36 shrink-0" />
        ))}
      </div>
    </div>
  </div>
);

export const ReviewSkeleton = () => (
  <div className="flex flex-col gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex gap-5">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-1/6 h-3" />
          </div>
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-2/3 h-3" />
          <Skeleton className="w-24 h-8 rounded-full mt-2" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
