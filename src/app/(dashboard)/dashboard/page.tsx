'use client';

import React from 'react';
import Link from 'next/link';
import { 
  useGetDashboardStatsQuery, 
  useGetAnalysisHistoryQuery 
} from '@/redux/api/resumeApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart3, 
  FileText, 
  History, 
  Plus, 
  Rocket, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery({});
  const { data: history, isLoading: historyLoading } = useGetAnalysisHistoryQuery({ page: 1, limit: 5 });

  const getScoreBadge = (score: number) => {
    if (score >= 87) return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Excellent ({score})</Badge>;
    if (score >= 50) return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Good ({score})</Badge>;
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Needs Work ({score})</Badge>;
  };

  if (statsLoading || historyLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const dashboardStats = stats?.data;
  const analysisHistory = history?.data || [];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & New Analysis CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
          <p className="text-muted-foreground mt-1">Track your career progress and AI analysis history.</p>
        </div>
        <Link href="/analyzer">
          <Button className="bg-[#6B5FD3] hover:bg-[#5A4FC1] gap-2 shadow-lg shadow-indigo-100 px-6 py-6 rounded-xl text-lg">
            <Plus className="w-5 h-5" />
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Upgrade Banner */}
      {dashboardStats?.currentPlan === 'FREE' && (
        <div className="bg-gradient-to-r from-[#6B5FD3] to-[#8B7FF3] rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-indigo-100 border border-white/20">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Upgrade to Pro</h3>
              <p className="text-indigo-50/90">
                You've used {dashboardStats.totalAnalyses} of 3 free analyses. Get unlimited access and advanced features.
              </p>
            </div>
          </div>
          <Button variant="secondary" className="bg-white text-[#6B5FD3] hover:bg-indigo-50 font-bold px-8 py-6 rounded-xl transition-all hover:scale-105">
            Upgrade — $5/mo
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Analyses</CardTitle>
            <BarChart3 className="w-5 h-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats?.totalAnalyses || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime career assessments</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Best ATS Score</CardTitle>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats?.bestAtsScore || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">Your highest career match</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cover Letters</CardTitle>
            <FileText className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats?.totalCoverLetters || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">AI-generated applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent History Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-bold">Recent Analyses</h2>
          </div>
          <Link href="/history" className="text-sm font-medium text-[#6B5FD3] hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Resume / Role</TableHead>
                <TableHead>Target Company</TableHead>
                <TableHead>ATS Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisHistory.length > 0 ? (
                analysisHistory.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium">
                      {item.jobTitle || 'Untitled Analysis'}
                    </TableCell>
                    <TableCell>{item.targetCompany || '—'}</TableCell>
                    <TableCell>{getScoreBadge(item.atsScore)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/analyzer/results/${item.id}`}>
                        <Button variant="ghost" size="sm" className="text-[#6B5FD3] hover:text-[#5A4FC1] hover:bg-indigo-50 font-medium">
                          View Results
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No analyses found. Start by uploading your resume!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
