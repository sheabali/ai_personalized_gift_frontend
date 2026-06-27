"use client";

import { useState } from "react";
import { FileText, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import {
  useGetAllBlogPostsQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} from "@/redux/api/blogPostApi";

import { BlogFormValues, BlogPost } from "@/components/module/blogs/blog.types";
import { BlogStatsGrid } from "@/components/module/blogs/BlogStatsGrid";
import {
  BlogPostTable,
  BlogSearchBar,
  BlogPagination,
} from "@/components/module/blogs/BlogPostTable";
import { BlogFormDialog } from "@/components/module/blogs/BlogFormDialog";
import { DeleteAlertDialog } from "@/components/module/blogs/DeleteAlertDialog";

export default function AdminBlogsPage() {
  // ── List state ─────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // ── Dialog state ───────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  // ── API ────────────────────────────────────────────────────────────────────
  const { data: response, isLoading, isError } = useGetAllBlogPostsQuery({
    search: search || undefined,
    isPublished:
      statusFilter === "all" ? undefined : statusFilter === "published",
    page,
    limit: 10,
  });

  const blogPosts: BlogPost[] = response?.data ?? [];
  const meta = response?.meta ?? { total: 0, page: 1, limit: 10 };

  const [createBlogPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
  const [updateBlogPost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
  const [deleteBlogPost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    setEditPost(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditPost(post);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: BlogFormValues, editId?: string) => {
    const keywords = values.keywords
      ? values.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
      : [];

    const payload = {
      title: values.title.trim(),
      content: values.content.trim(),
      summary: values.summary?.trim() || null,
      thumbnail: values.thumbnail?.trim() || null,
      metaTitle: values.metaTitle?.trim() || null,
      metaDescription: values.metaDescription?.trim() || null,
      keywords,
      isPublished: values.isPublished,
      author: values.author.trim(),
    };

    try {
      if (editId) {
        const res = await updateBlogPost({ id: editId, ...payload }).unwrap();
        if (res.success) {
          toast.success("Blog post updated! 🎉");
          setIsFormOpen(false);
        }
      } else {
        const res = await createBlogPost(payload).unwrap();
        if (res.success) {
          toast.success("Blog post published! 🚀");
          setIsFormOpen(false);
        }
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBlogPost(deleteTarget.id).unwrap();
      toast.success("Blog post deleted!");
      setDeleteTarget(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete post");
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const res = await updateBlogPost({
        id: post.id,
        isPublished: !post.isPublished,
      }).unwrap();
      if (res.success) {
        toast.success(post.isPublished ? "Post changed to draft!" : "Post published!");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20">
              <FileText className="w-6 h-6" />
            </span>
            Blogs &amp; Gift Guides
          </h1>
          <p className="text-neutral-500 mt-1.5 font-medium">
            Publish SEO articles and gift collections to generate organic traffic.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/20 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Create Blog Post
        </motion.button>
      </div>

      {/* Stats */}
      <BlogStatsGrid posts={blogPosts} total={meta.total} isLoading={isLoading} />

      {/* Search & Filter */}
      <BlogSearchBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Table */}
      <BlogPostTable
        posts={blogPosts}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleOpenEdit}
        onDelete={setDeleteTarget}
        onTogglePublish={handleTogglePublish}
      />

      {/* Pagination */}
      <BlogPagination page={page} meta={meta} onPageChange={setPage} />

      {/* Create / Edit Dialog */}
      <BlogFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editPost={editPost}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Delete Confirmation */}
      <DeleteAlertDialog
        open={!!deleteTarget}
        onOpenChange={(open: boolean) => { if (!open) setDeleteTarget(null); }}
        title={deleteTarget?.title ?? ""}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
