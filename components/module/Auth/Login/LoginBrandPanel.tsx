"use client";

import { Gift } from "lucide-react";
import Link from "next/link";

/**
 * Right-side branding panel for the Login page.
 * Pure presentational component — contains zero logic.
 */
export default function LoginBrandPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-neutral-900 p-12 flex-col justify-between text-white relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex justify-end">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
          <Gift className="w-8 h-8 text-primary" />
          <span>GiftAI</span>
        </Link>
      </div>

      {/* Tagline */}
      <div className="relative z-10 space-y-6 text-right">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
          Personalized gifts <br />
          <span className="text-primary text-3xl lg:text-4xl">powered by intelligence.</span>
        </h1>
        <p className="text-neutral-400 text-lg ml-auto max-w-[300px]">
          Access your saved designs and orders from anywhere.
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex justify-end">
        <p className="text-sm text-neutral-500">© 2024 GiftAI.</p>
      </div>
    </div>
  );
}
