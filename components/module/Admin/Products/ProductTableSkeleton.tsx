"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductTableSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden p-6">
      {/* Table Header Row Skeleton */}
      <div className="grid grid-cols-7 gap-4 py-3 border-b border-neutral-100 pb-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12 ml-auto" />
      </div>

      {/* 5 Row Skeletons */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="grid grid-cols-7 gap-4 py-5 border-b border-neutral-50 last:border-none items-center"
        >
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full ml-auto" />
        </div>
      ))}
    </div>
  );
}
