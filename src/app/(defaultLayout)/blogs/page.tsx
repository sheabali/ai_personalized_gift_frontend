"use client";

import { useState } from "react";
import { useGetAllBlogPostsQuery } from "@/redux/api/blogPostApi";
import { Search, Calendar, User, ArrowRight, Loader2, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const { data: response, isLoading, isError } = useGetAllBlogPostsQuery({
    isPublished: true,
    search: search || undefined
  });

  const blogPosts = response?.data || [];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      {/* Premium Hero Banner */}
      <section className="relative overflow-hidden bg-radial from-rose-500/10 via-transparent to-transparent py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 font-bold px-4 py-1.5 rounded-full text-xs"
          >
            <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
            Gift Inspiration & Guides
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight"
          >
            Perfect Gift Guides For <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-600">
              Every Special Occasion
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Explore our curated guides to discover unique, personalized AI-generated art gifts that your loved ones will cherish forever.
          </motion.p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-white rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/50 p-2 flex items-center">
            <div className="flex-1 flex items-center pl-3">
              <Search className="w-5 h-5 text-neutral-400 mr-2" />
              <input
                type="text"
                placeholder="Search articles (e.g. Valentine, Boyfriend)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-hidden text-neutral-800 font-medium text-sm focus:ring-0 placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            <p className="text-neutral-500 font-bold">Fetching gift guides...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-rose-500">
            <p className="font-bold">Failed to load articles. Please try again later.</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="p-5 bg-rose-50 text-rose-500 rounded-full mb-4">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">No Articles Found</h3>
            <p className="text-neutral-500 max-w-sm mt-1 font-medium">
              We couldn't find any articles matching your search criteria. Try different keywords!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post: any, idx: number) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-neutral-100/80 shadow-xs hover:shadow-xl transition-all duration-300 h-full"
              >
                {/* Thumbnail */}
                <Link href={`/blogs/${post.slug}`} className="relative aspect-video w-full overflow-hidden bg-neutral-100 block">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Excerpt Meta info */}
                    <div className="flex items-center gap-3 text-xs text-neutral-400 font-semibold">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })
                          : "Draft"}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </div>
                    </div>

                    <h3 className="font-extrabold text-neutral-900 text-lg md:text-xl leading-tight group-hover:text-rose-500 transition-colors duration-200">
                      <Link href={`/blogs/${post.slug}`} className="line-clamp-2">
                        {post.title}
                      </Link>
                    </h3>

                    {post.summary && (
                      <p className="text-neutral-500 text-sm leading-relaxed font-medium line-clamp-3">
                        {post.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Read Full Guide
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
