"use client";

import React from 'react';
import { CareerSidebar } from "@/components/shared/career-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Download, Zap } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F9FAFB]">
        <CareerSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-[6px]"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-[#6B5FD3] hover:bg-[#5A4FC1] text-white rounded-[6px]"
              >
                <Zap className="w-4 h-4 fill-current" />
                Upgrade Pro
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
