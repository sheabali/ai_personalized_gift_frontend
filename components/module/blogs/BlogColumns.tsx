"use client";

import Image from "next/image";
import { Calendar, Eye, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { BlogPost } from "./blog.types";

interface BlogColumnsProps {
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onTogglePublish: (post: BlogPost) => void;
}

/**
 * Returns NRTable-compatible column definitions for the Blog Posts table.
 */
export function getBlogColumns({
  onEdit,
  onDelete,
  onTogglePublish,
}: BlogColumnsProps): ColumnDef<BlogPost>[] {
  return [
    // ── Article (thumbnail + title + summary) ─────────────────────────────
    {
      accessorKey: "title",
      header: "Article",
      cell: ({ row }) => {
        const post = row.original;
        return (
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
        );
      },
    },

    // ── Slug ──────────────────────────────────────────────────────────────
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100 text-neutral-600 block max-w-xs truncate">
          {row.original.slug}
        </span>
      ),
    },

    // ── Author ────────────────────────────────────────────────────────────
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <span className="text-neutral-600 text-sm font-medium">{row.original.author}</span>
      ),
    },

    // ── Publish Date ──────────────────────────────────────────────────────
    {
      accessorKey: "publishedAt",
      header: "Publish Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
          <Calendar className="w-4 h-4 text-neutral-400" />
          {row.original.publishedAt
            ? new Date(row.original.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Unpublished"}
        </div>
      ),
    },

    // ── Status (toggle button) ─────────────────────────────────────────────
    {
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ row }) => {
        const post = row.original;
        return (
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
        );
      },
    },

    // ── Row Actions (view / edit / delete) ────────────────────────────────
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const post = row.original;
        return (
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
        );
      },
    },
  ];
}
