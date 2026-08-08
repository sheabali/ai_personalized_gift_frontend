"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function UserTableSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden p-6 space-y-4">
      {/* Table Header Row */}
      <div className="grid grid-cols-6 gap-4 pb-4 border-b border-neutral-100">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* 6 User Row Skeletons */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 gap-4 py-5 border-b border-neutral-50 last:border-none items-center"
        >
          {/* User cell */}
          <div className="flex items-center gap-3 col-span-1">
            <Skeleton className="h-10 w-10 rounded-2xl flex-shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
