import React from "react";

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-md ${className}`}></div>
  );
};

export const MovieCardSkeleton = () => {
  return (
    <div className="h-80 w-56 rounded-xl relative">
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="h-[80vh] w-full relative bg-black px-16">
      <div className="absolute top-[30%] w-[35%] space-y-6 z-20">
        <Skeleton className="w-3/4 h-12" />
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
      <div className="absolute inset-0 z-0">
         <Skeleton className="w-full h-full opacity-20" />
      </div>
    </div>
  );
};

export const MovieDetailsSkeleton = () => {
  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center px-16 relative">
      <div className="flex gap-6 items-center w-[90%] lg:w-[58%] z-20">
        <Skeleton className="h-[360px] w-64 rounded-xl shrink-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="w-3/4 h-12" />
          <div className="flex gap-4">
             <Skeleton className="w-20 h-6" />
             <Skeleton className="w-20 h-6" />
          </div>
          <Skeleton className="w-full h-32" />
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
};

export default Skeleton;
