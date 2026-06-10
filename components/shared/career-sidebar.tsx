/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  useGetAnalysisHistoryQuery,
  useGetDashboardStatsQuery,
} from "@/redux/api/resumeApi";
import {
  Clock,
  FileSearch,
  History,
  LayoutDashboard,
  LogOut,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Analyzer", url: "/analyzer", icon: FileSearch },
  { title: "History", url: "/history", icon: History },
];

export function CareerSidebar() {
  const pathname = usePathname();
  const { data: stats } = useGetDashboardStatsQuery({});
  const { data: history } = useGetAnalysisHistoryQuery({ page: 1, limit: 3 });

  const dashboardStats = stats?.data;
  const latestAnalyses = history?.data || [];

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-100 bg-white">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-gray-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#6B5FD3] rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-bold text-xl text-gray-800 group-data-[collapsible=icon]:hidden">
            GiftAI
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4 space-y-8">
        {/* Main Nav */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2 group-data-[collapsible=icon]:hidden">
            Menu
          </p>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                    pathname === item.url
                      ? "bg-[#6B5FD3]/10 text-[#6B5FD3]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Link href={item.url}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* Latest Analyses */}
        <div className="space-y-1 group-data-[collapsible=icon]:hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">
            My Analyses
          </p>
          <div className="space-y-1">
            {latestAnalyses.map((analysis: any) => (
              <Link
                key={analysis.id}
                href={`/analyzer/results/${analysis.id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">
                  {analysis.jobTitle || "Untitled"}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Usage Badge */}
        {dashboardStats?.currentPlan === "FREE" && (
          <div className="px-3 group-data-[collapsible=icon]:hidden">
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-900">
                  Analyses Left
                </span>
                <Zap className="w-3 h-3 text-indigo-500 fill-indigo-500" />
              </div>
              <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-[#6B5FD3] transition-all duration-500"
                  style={{
                    width: `${(dashboardStats.creditsRemaining / 3) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-indigo-600 font-medium">
                {dashboardStats.creditsRemaining} of 3 free left
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-gray-50">
        <SidebarMenuButton className="text-gray-500 hover:text-red-500">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
