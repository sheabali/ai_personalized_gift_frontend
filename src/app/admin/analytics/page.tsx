"use client";

import { useGetAdminStatsQuery } from "@/redux/api/analyticsApi";
import RevenueChart from "@/components/module/Admin/RevenueChart";
import DashboardStats from "@/components/module/Admin/DashboardStats";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAnalyticsPage() {
  const { data, isLoading, refetch } = useGetAdminStatsQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.data;

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-neutral-500">Unable to load analytics. Please try again.</p>
        <Button onClick={() => refetch()} className="rounded-xl">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Analytics</h1>
          <p className="text-neutral-500 font-medium">Platform overview & performance metrics</p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="rounded-xl gap-2 h-11 px-6 border-neutral-100 bg-white"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Revenue Overview</h2>
        <RevenueChart data={stats?.chartData || []} />
      </div>
    </div>
  );
}
