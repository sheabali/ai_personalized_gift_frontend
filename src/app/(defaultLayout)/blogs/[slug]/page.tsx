"use client";

import { useGetBlogPostBySlugQuery, useGetAllBlogPostsQuery } from "@/redux/api/blogPostApi";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  User,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Gift,
  Heart,
  TrendingUp,
  FileText,
  Clock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function BlogPostDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();

  // Queries
  const { data: response, isLoading, isError } = useGetBlogPostBySlugQuery(slug as string);
  const { data: suggestionsResponse } = useGetAllBlogPostsQuery({
    isPublished: true,
    limit: 3
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-500 font-bold">Loading guide...</p>
      </div>
    );
  }

  const post = response?.data;
  const suggestions = suggestionsResponse?.data?.filter((p: any) => p.slug !== slug).slice(0, 3) || [];

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-neutral-800">Article not found</h2>
        <p className="text-neutral-500 mt-2">The article you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/blogs")} className="mt-6 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl px-6 py-3">
          Back to Gift Guides
        </Button>
      </div>
    );
  }

  // Reading time calculator helper (average reading speed: 200 words per minute)
  const calculateReadingTime = (text: string) => {
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumbs & Back */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 font-medium overflow-x-auto no-scrollbar py-1">
            <Link href="/" className="hover:text-neutral-900 whitespace-nowrap transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link href="/blogs" className="hover:text-neutral-900 whitespace-nowrap transition-colors">Blogs</Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-neutral-900 font-bold whitespace-nowrap truncate max-w-xs">{post.title}</span>
          </nav>

          <button
            onClick={() => router.push("/blogs")}
            className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Reading Column */}
          <div className="lg:col-span-8 space-y-8 bg-white p-6 md:p-10 rounded-3xl border border-neutral-100 shadow-xs">

            {/* Title & Metadata */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400 font-semibold border-b border-neutral-100 pb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "Unpublished"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span>{calculateReadingTime(post.content)}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.thumbnail && (
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-50 shadow-md">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* HTML Content Body */}
            <div
              className="prose prose-rose max-w-none text-neutral-700 text-base md:text-lg leading-relaxed space-y-6 
                         prose-headings:font-extrabold prose-headings:text-neutral-900 prose-headings:tracking-tight
                         prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                         prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                         prose-p:mb-6
                         prose-a:text-rose-500 prose-a:underline prose-a:font-bold hover:prose-a:text-rose-600
                         prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                         prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                         prose-li:text-neutral-700
                         prose-img:rounded-2xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* SEO Keywords */}
            {post.keywords && post.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-8 border-t border-neutral-100">
                {post.keywords.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-none px-3.5 py-1.5 rounded-full text-xs font-bold font-mono">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Right Conversion Sidebar */}
          <div className="lg:col-span-4 space-y-8">

            {/* AI Custom Gift Call-to-Action Widget */}
            <div className="relative overflow-hidden bg-radial from-rose-500/20 via-rose-500/5 to-transparent border border-rose-100 rounded-3xl p-8 space-y-6 shadow-xl shadow-rose-500/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-5 -mt-5"></div>

              <div className="flex items-center gap-3 text-rose-500">
                <Sparkles className="w-7 h-7 animate-pulse" />
                <h3 className="text-xl font-extrabold text-neutral-900">Make it Personal</h3>
              </div>

              <p className="text-neutral-600 text-sm font-medium leading-relaxed">
                Turn your favorite photo into an amazing custom AI art masterpiece printed on mugs, canvas framing, phone cases, and sweaters!
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/ai-design")}
                  className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Try AI Designer Now
                </Button>
                <Button
                  onClick={() => router.push("/products")}
                  variant="outline"
                  className="w-full h-12 border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-xl flex items-center justify-center gap-2 text-sm"
                >
                  <Gift className="w-4 h-4" />
                  Browse Products Shop
                </Button>
              </div>
            </div>

            {/* Popular Suggested Articles list */}
            {suggestions.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs space-y-5">
                <h4 className="font-extrabold text-neutral-900 text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-500" />
                  Suggested Reading
                </h4>

                <div className="divide-y divide-neutral-100 space-y-4">
                  {suggestions.map((sug: any, idx: number) => (
                    <div key={sug.id} className={`pt-4 first:pt-0 flex items-start gap-4 group`}>
                      {sug.thumbnail && (
                        <Link href={`/blogs/${sug.slug}`} className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                          <Image src={sug.thumbnail} alt={sug.title} fill className="object-cover" />
                        </Link>
                      )}
                      <div className="min-w-0">
                        <Link href={`/blogs/${sug.slug}`}>
                          <h5 className="font-bold text-neutral-800 text-sm group-hover:text-rose-500 transition-colors line-clamp-2 leading-snug">
                            {sug.title}
                          </h5>
                        </Link>
                        <span className="text-xs text-neutral-400 font-semibold block mt-1">
                          {sug.publishedAt
                            ? new Date(sug.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : "Draft"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
