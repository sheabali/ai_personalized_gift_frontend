"use client";

import { useGetAdminStatsQuery } from "@/redux/api/analyticsApi";
import DashboardStats from "@/components/module/Admin/DashboardStats";
import RevenueChart from "@/components/module/Admin/RevenueChart";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingCart, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { data, isLoading, refetch } = useGetAdminStatsQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.data;
  
  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-neutral-500 font-medium">Unable to load statistics. Please try again later.</p>
        <Button onClick={() => refetch()} className="rounded-xl">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-neutral-500 font-medium">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          className="rounded-xl gap-2 h-11 px-6 border-neutral-100 bg-white"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueChart data={stats?.chartData || []} />
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-neutral-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>

          <div className="flex-1 space-y-6">
            {(stats?.recentOrders || []).map((order: any) => (
              <div key={order.id} className="flex items-center gap-4 group">
                <Avatar className="h-12 w-12 rounded-2xl shadow-sm border border-neutral-50">
                  <AvatarImage src={order.user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {order.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900 line-clamp-1">{order.user.name}</p>
                  <p className="text-xs text-neutral-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-neutral-900">${order.totalAmount}</p>
                  <Badge className="bg-green-500/10 text-green-600 border-none rounded-full text-[10px] px-2">
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <Button asChild className="w-full h-12 bg-neutral-50 hover:bg-neutral-100 text-neutral-900 rounded-2xl font-bold border-none shadow-none group">
            <Link href="/admin/orders">
              Manage All Orders
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
