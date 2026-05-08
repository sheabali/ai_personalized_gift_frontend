'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetAnalysisHistoryQuery } from '@/redux/api/resumeApi';
import { Card } from '@/components/ui/card';
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
  ChevronLeft, 
  ChevronRight, 
  Search,
  History,
  ArrowLeft
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const { data: history, isLoading } = useGetAnalysisHistoryQuery({ page, limit });

  const getScoreBadge = (score: number) => {
    if (score >= 87) return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Excellent ({score})</Badge>;
    if (score >= 50) return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Good ({score})</Badge>;
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Needs Work ({score})</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full max-w-md rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const analysisHistory = history?.data || [];
  const meta = history?.meta || { total: 0, page: 1, limit: 10 };
  const totalPages = Math.ceil(meta.total / limit);

  // Client-side filtering for simplicity since backend search isn't implemented yet
  const filteredHistory = analysisHistory.filter((item: any) => 
    (item.jobTitle?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (item.targetCompany?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-[#6B5FD3] flex items-center gap-1 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-[#6B5FD3]" />
            <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
          </div>
          <p className="text-muted-foreground">Manage and review all your previous resume assessments.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center max-w-md relative">
        <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Search by job title or company..." 
          className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#6B5FD3] focus:ring-[#6B5FD3] shadow-sm bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* History Table */}
      <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
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
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-semibold text-gray-900">
                    {item.jobTitle || 'Untitled Analysis'}
                  </TableCell>
                  <TableCell className="text-gray-600">{item.targetCompany || '—'}</TableCell>
                  <TableCell>{getScoreBadge(item.atsScore)}</TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/analyzer/results/${item.id}`}>
                      <Button variant="outline" size="sm" className="border-[#6B5FD3] text-[#6B5FD3] hover:bg-[#6B5FD3] hover:text-white font-semibold rounded-lg px-4">
                        View Results
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  {search ? "No matches found for your search." : "No analysis history available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg h-9 w-9 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                  className={`rounded-lg h-9 w-9 p-0 ${page === i + 1 ? 'bg-[#6B5FD3] hover:bg-[#5A4FC1]' : ''}`}
                >
                  {i + 1}
                </Button>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg h-9 w-9 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
