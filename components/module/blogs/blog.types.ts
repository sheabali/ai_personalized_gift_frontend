import { z } from "zod";

export const blogFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  summary: z.string().default(""),
  thumbnail: z.string().default(""),
  metaTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  keywords: z.string().default(""),
  isPublished: z.boolean().default(false),
  author: z.string().min(1, "Author is required").default("AI Personalized Gift Team"),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string | null;
  thumbnail?: string | null;
  slug: string;
  author: string;
  isPublished: boolean;
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[];
}

export interface BlogMeta {
  total: number;
  page: number;
  limit: number;
}

export const BLOG_FORM_DEFAULTS: BlogFormValues = {
  title: "",
  content: "",
  summary: "",
  thumbnail: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  isPublished: false,
  author: "AI Personalized Gift Team",
};
