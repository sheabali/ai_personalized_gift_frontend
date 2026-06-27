"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Sparkles,
  Loader2,
  Upload,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Link2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { blogFormSchema, BlogFormValues, BLOG_FORM_DEFAULTS, BlogPost } from "./blog.types";
import { useUploadImageMutation } from "@/redux/api/uploadApi";

// ─── Formatting Helpers ───────────────────────────────────────────────────────

const FORMAT_BUTTONS = [
  { tag: "bold",   icon: <Bold className="w-4 h-4" />,    title: "Bold" },
  { tag: "italic", icon: <Italic className="w-4 h-4" />,  title: "Italic" },
  { tag: "h2",     icon: <Heading2 className="w-4 h-4" />, title: "Heading 2" },
  { tag: "h3",     icon: <Heading3 className="w-4 h-4" />, title: "Heading 3" },
  { tag: "list",   icon: <List className="w-4 h-4" />,    title: "List" },
  { tag: "link",   icon: <Link2 className="w-4 h-4" />,   title: "Link" },
  { tag: "image",  icon: <ImageIcon className="w-4 h-4" />, title: "Image" },
] as const;

function buildReplacement(tag: string, selected: string): string {
  const text = selected || "text";
  switch (tag) {
    case "bold":   return `<strong>${text}</strong>`;
    case "italic": return `<em>${text}</em>`;
    case "h2":     return `<h2>${text}</h2>`;
    case "h3":     return `<h3>${text}</h3>`;
    case "link":   return `<a href="https://example.com" class="text-rose-500 underline font-semibold" target="_blank">${text}</a>`;
    case "image":  return `<img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800" alt="Gift" class="my-6 rounded-2xl w-full object-cover" />`;
    case "list":   return `<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>`;
    default:       return text;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EditorToolbar({ onInsert }: { onInsert: (tag: string) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-neutral-50 px-4 py-2.5 rounded-t-xl border border-neutral-200 border-b-0">
      <span className="text-sm font-bold text-neutral-600">Rich Formatting:</span>
      <div className="flex flex-wrap gap-1">
        {FORMAT_BUTTONS.map(({ tag, icon, title }) => (
          <button
            key={tag}
            type="button"
            onClick={() => onInsert(tag)}
            title={title}
            className="p-1.5 hover:bg-neutral-200 rounded-lg text-neutral-700 transition-colors"
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

function PreviewTab({ values }: { values: BlogFormValues }) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {values.thumbnail && (
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-md">
          <Image src={values.thumbnail} alt={values.title || "Preview"} fill className="object-cover" />
        </div>
      )}
      <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
        {values.title || "Untitled Blog Post"}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 border-b border-neutral-100 pb-4">
        <span>By <strong>{values.author || "Author"}</strong></span>
        <span>•</span>
        <span>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
        <span>•</span>
        <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${values.isPublished ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}>
          {values.isPublished ? "Published" : "Draft"}
        </span>
      </div>
      {values.summary && (
        <p className="text-lg text-neutral-500 italic leading-relaxed border-l-4 border-rose-300 pl-4">
          {values.summary}
        </p>
      )}
      <div
        className="prose prose-rose max-w-none text-neutral-800 leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: values.content || "<p class='text-neutral-400 italic'>No content yet.</p>",
        }}
      />
      {values.keywords && (
        <div className="flex flex-wrap gap-2 pt-6 border-t border-neutral-100">
          {values.keywords.split(",").map((tag, i) => (
            <span key={i} className="bg-neutral-100 text-neutral-600 text-xs font-bold px-3 py-1.5 rounded-full">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Blog Form Dialog ─────────────────────────────────────────────────────────

interface BlogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPost?: BlogPost | null;
  onSubmit: (values: BlogFormValues, editId?: string) => Promise<void>;
  isSubmitting: boolean;
}

export function BlogFormDialog({
  open,
  onOpenChange,
  editPost,
  onSubmit,
  isSubmitting,
}: BlogFormDialogProps) {
  const isEditMode = !!editPost;
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema) as never,
    defaultValues: BLOG_FORM_DEFAULTS,
  });

  // Populate form on edit or reset on create
  useEffect(() => {
    if (!open) return;
    if (editPost) {
      reset({
        title: editPost.title,
        content: editPost.content,
        summary: editPost.summary ?? "",
        thumbnail: editPost.thumbnail ?? "",
        metaTitle: editPost.metaTitle ?? "",
        metaDescription: editPost.metaDescription ?? "",
        keywords: editPost.keywords?.join(", ") ?? "",
        isPublished: editPost.isPublished,
        author: editPost.author,
      });
    } else {
      reset(BLOG_FORM_DEFAULTS);
    }
    setActiveTab("edit");
  }, [editPost, open, reset]);

  // Rich text format insertion
  const handleInsertFormat = (tag: string) => {
    const textarea = document.getElementById("blog-content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = buildReplacement(tag, selected);
    const current = watch("content");
    setValue("content", current.substring(0, start) + replacement + current.substring(end), {
      shouldDirty: true,
    });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  // Thumbnail upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await uploadImage(fd).unwrap();
      if (res.success && res.data) {
        setValue("thumbnail", res.data.url, { shouldDirty: true });
        toast.success("Thumbnail uploaded! 📸");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Image upload failed");
    }
  };

  const handleClose = () => {
    reset(BLOG_FORM_DEFAULTS);
    onOpenChange(false);
  };

  const onFormSubmit: SubmitHandler<BlogFormValues> = (values) =>
    onSubmit(values, editPost?.id);

  const thumbnailValue = watch("thumbnail");
  const allValues = watch();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="w-full max-w-5xl h-[90vh] rounded-[2.5rem] flex flex-col overflow-hidden border border-neutral-100 p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-2xl font-extrabold text-neutral-900">
              <Sparkles className="w-6 h-6 text-rose-500" />
              {isEditMode ? "Edit Blog Post" : "Write New Blog Post"}
            </DialogTitle>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-full text-neutral-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Tab Bar */}
        <div className="flex border-b border-neutral-100 bg-neutral-50 px-6 py-2 gap-1 flex-shrink-0">
          {(["edit", "preview"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-rose-600 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab === "edit" ? "Edit Content" : "Real-time Preview"}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === "preview" ? (
            <PreviewTab values={allValues} />
          ) : (
            <form
              id="blog-post-form"
              onSubmit={handleSubmit(onFormSubmit)}
              className="space-y-6"
            >
              {/* Title + Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-neutral-700">
                    Article Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    {...register("title")}
                    placeholder="e.g. Best Gifts for Valentine's Day 2026"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-hidden focus:border-rose-500 font-bold text-neutral-800"
                  />
                  {errors.title && (
                    <p className="text-xs text-rose-500 font-semibold">{errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-neutral-700">Author Name</label>
                  <input
                    {...register("author")}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-hidden focus:border-rose-500 text-neutral-800 font-medium"
                  />
                  {errors.author && (
                    <p className="text-xs text-rose-500 font-semibold">{errors.author.message}</p>
                  )}
                </div>
              </div>

              {/* Thumbnail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-bold text-neutral-700">
                    Featured Image (URL or Upload)
                  </label>
                  <input
                    {...register("thumbnail")}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-hidden focus:border-rose-500 text-neutral-800 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="w-full py-3.5 px-4 bg-rose-50 hover:bg-rose-100 border border-dashed border-rose-200 text-rose-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm">
                    {isUploading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="w-4 h-4" /> Upload Thumbnail</>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Thumbnail preview */}
              {thumbnailValue && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
                  <Image src={thumbnailValue} alt="Thumbnail preview" fill className="object-cover" />
                </div>
              )}

              {/* Summary */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-neutral-700">Summary / Excerpt</label>
                <textarea
                  {...register("summary")}
                  rows={2}
                  placeholder="Brief intro shown on the blog card (100–160 chars recommended)"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-hidden focus:border-rose-500 text-neutral-800 font-medium resize-none text-sm"
                />
              </div>

              {/* Rich HTML Editor */}
              <div>
                <EditorToolbar onInsert={handleInsertFormat} />
                <textarea
                  id="blog-content-textarea"
                  {...register("content")}
                  rows={12}
                  placeholder="Write your article body in HTML — <h2>, <p>, <a>, <ul>/<li>"
                  className="w-full px-4 py-3 rounded-b-xl border border-neutral-200 border-t-0 outline-hidden focus:border-rose-500 text-neutral-800 text-sm font-mono leading-relaxed"
                />
                {errors.content && (
                  <p className="text-xs text-rose-500 font-semibold mt-1">{errors.content.message}</p>
                )}
              </div>

              {/* SEO Section */}
              <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 space-y-4">
                <h4 className="font-extrabold text-neutral-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  Search Engine Optimization (SEO)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Meta Title
                    </label>
                    <input
                      {...register("metaTitle")}
                      placeholder="Defaults to Article Title if blank"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 outline-hidden focus:border-rose-500 text-neutral-800 text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Keywords (comma-separated)
                    </label>
                    <input
                      {...register("keywords")}
                      placeholder="Valentine, Gifts, Custom Art"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 outline-hidden focus:border-rose-500 text-neutral-800 text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Meta Description (150–160 chars)
                  </label>
                  <textarea
                    {...register("metaDescription")}
                    rows={2}
                    placeholder="Shows as the snippet under your link on Google."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 outline-hidden focus:border-rose-500 text-neutral-800 text-sm font-medium resize-none"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="isPublished-switch"
                  {...register("isPublished")}
                  className="w-5 h-5 rounded-md border-neutral-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <label
                  htmlFor="isPublished-switch"
                  className="text-sm font-bold text-neutral-800 select-none cursor-pointer"
                >
                  Publish this article immediately (visible to site visitors)
                </label>
              </div>

              {/* Submit / Cancel */}
              <div className="flex gap-4 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-4 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400 text-white font-bold rounded-xl shadow-xl shadow-rose-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                  ) : isEditMode ? (
                    "Save Changes"
                  ) : (
                    "Create Blog Post"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
