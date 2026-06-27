"use client";

import Image from "next/image";
import {
  FileText,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import { BlogPost, BlogMeta } from "./blog.types";

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

// ─── Table Row ────────────────────────────────────────────────────────────────

interface BlogTableRowProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onTogglePublish: (post: BlogPost) => void;
}

function BlogTableRow({ post, onEdit, onDelete, onTogglePublish }: BlogTableRowProps) {
  return (
    <tr className="hover:bg-neutral-50/50 transition-colors duration-150">
      <td className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
            {post.thumbnail ? (
              <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0 max-w-xs">
            <h4 className="font-bold text-neutral-800 text-sm truncate">{post.title}</h4>
            <p className="text-xs text-neutral-400 truncate mt-0.5">
              {post.summary || "No summary added"}
            </p>
          </div>
        </div>
      </td>

      <td className="p-6">
        <span className="font-mono text-xs bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100 text-neutral-600 block max-w-xs truncate">
          {post.slug}
        </span>
      </td>

      <td className="p-6">
        <span className="text-neutral-600 text-sm font-medium">{post.author}</span>
      </td>

      <td className="p-6">
        <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
          <Calendar className="w-4 h-4 text-neutral-400" />
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Unpublished"}
        </div>
      </td>

      <td className="p-6">
        <button
          onClick={() => onTogglePublish(post)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            post.isPublished
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              post.isPublished ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          {post.isPublished ? "Published" : "Draft"}
        </button>
      </td>

      <td className="p-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <a
            href={`/blogs/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-neutral-50 text-neutral-400 hover:text-neutral-700 rounded-xl transition-all duration-200"
            title="View Live"
          >
            <Eye className="w-5 h-5" />
          </a>
          <button
            onClick={() => onEdit(post)}
            className="p-2 hover:bg-neutral-50 text-neutral-400 hover:text-rose-500 rounded-xl transition-all duration-200 cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(post)}
            className="p-2 hover:bg-rose-50 text-neutral-400 hover:text-rose-500 rounded-xl transition-all duration-200 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  meta: BlogMeta;
  onPageChange: (page: number) => void;
}

export function BlogPagination({ page, meta, onPageChange }: PaginationProps) {
  if (meta.total <= meta.limit) return null;
  return (
    <div className="flex justify-center gap-2 pt-4">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 border border-neutral-200 rounded-xl font-bold text-sm bg-white hover:bg-neutral-50 disabled:opacity-50 transition-colors cursor-pointer"
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page * meta.limit >= meta.total}
        className="px-4 py-2 border border-neutral-200 rounded-xl font-bold text-sm bg-white hover:bg-neutral-50 disabled:opacity-50 transition-colors cursor-pointer"
      >
        Next
      </button>
    </div>
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
  if (isLoading) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xs flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
        <p className="text-neutral-500 font-medium">Loading articles...</p>
      </div>
    );
  }

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

  const COLUMNS = ["Article", "Slug", "Author", "Publish Date", "Status", "Actions"];

  return (
    <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100">
              {COLUMNS.map((col, i) => (
                <th
                  key={col}
                  className={`p-6 text-sm font-bold text-neutral-500 uppercase tracking-wider ${
                    i === COLUMNS.length - 1 ? "text-right" : ""
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {posts.map((post) => (
              <BlogTableRow
                key={post.id}
                post={post}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePublish={onTogglePublish}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
