"use client";

import { useMemo } from "react";
import { FileText, AlertCircle, Search } from "lucide-react";
import { BlogPost, BlogMeta } from "./blog.types";
import { getBlogColumns } from "./BlogColumns";
import { NRTable } from "@/components/ui/core/NRTable";
import TablePagination from "@/components/ui/core/NRTable/TablePagination";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Search & Filter Bar ─────────────────────────────────────────────────────

interface BlogSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function BlogSearchBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: BlogSearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-neutral-100 shadow-xs">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by title, content..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 outline-hidden focus:border-rose-500 font-medium text-neutral-800 text-sm transition-colors"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-4 py-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 outline-hidden focus:border-rose-500 text-sm font-bold text-neutral-700 cursor-pointer"
      >
        <option value="all">All Statuses</option>
        <option value="published">Published Only</option>
        <option value="draft">Drafts Only</option>
      </select>
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function BlogTableSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xs overflow-hidden p-6 space-y-4">
      {/* Header row */}
      <div className="grid grid-cols-6 gap-4 pb-3 border-b border-neutral-100">
        {["Article", "Slug", "Author", "Date", "Status", "Actions"].map((h) => (
          <Skeleton key={h} className="h-4 w-16" />
        ))}
      </div>
      {/* 5 data rows */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-4 py-4 items-center border-b border-neutral-50 last:border-none">
          <div className="flex items-center gap-3">
            <Skeleton className="w-16 h-12 rounded-xl flex-shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-xl ml-auto" />
        </div>
      ))}
    </div>
  );
}

// ─── Pagination Wrapper ───────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  meta: BlogMeta;
  onPageChange: (page: number) => void;
}

export function BlogPagination({ page, meta, onPageChange }: PaginationProps) {
  const totalPage = Math.ceil(meta.total / meta.limit);
  if (totalPage <= 1) return null;
  return (
    <TablePagination
      totalPage={totalPage}
      currentPage={page}
      onPageChange={onPageChange}
    />
  );
}

// ─── Main Table Component ─────────────────────────────────────────────────────

interface BlogPostTableProps {
  posts: BlogPost[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onTogglePublish: (post: BlogPost) => void;
}

export function BlogPostTable({
  posts,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onTogglePublish,
}: BlogPostTableProps) {
  // Memoize column definitions — only recomputed when action handlers change
  const columns = useMemo(
    () => getBlogColumns({ onEdit, onDelete, onTogglePublish }),
    [onEdit, onDelete, onTogglePublish]
  );

  if (isLoading) return <BlogTableSkeleton />;

  if (isError) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xs flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
        <AlertCircle className="w-10 h-10" />
        <p className="font-bold">Failed to load articles</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xs flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="p-6 bg-rose-50 text-rose-500 rounded-full mb-4">
          <FileText className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900">No Articles Found</h3>
        <p className="text-neutral-500 max-w-sm mt-2 font-medium">
          Start writing high-value articles to attract visitors via search engines.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xs overflow-hidden px-6">
      <NRTable
        columns={columns}
        data={posts}
        emptyMessage="No blog articles found."
      />
    </div>
  );
}
