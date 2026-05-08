"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Home,
  LayoutDashboard,
  LogIn,
  Mail,
  UserPlus,
} from "lucide-react";

import loadingAnimation from "@/components/lottieAnimations/loading-animation.json";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center overflow-hidden bg-background dark:bg-background/90">
      {/* Decorative background grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Floating gradient orb */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-48 w-48 rounded-full bg-destructive/10 blur-3xl animate-pulse delay-1000" />

      <div className="space-y-8 max-w-xl relative">
        {/* 404 with gradient text */}
        <div className="space-y-2">
          <h1 className="text-8xl font-extrabold tracking-tighter md:text-9xl">
            <span className="bg-linear-to-r from-primary via-destructive to-primary bg-clip-text text-transparent">
              404
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="h-px w-8 bg-border" />
            <span className="text-sm font-medium uppercase tracking-widest">
              Page Not Found
            </span>
            <div className="h-px w-8 bg-border" />
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-4">
          <p className="text-xl font-semibold tracking-tight text-foreground">
            Looks like this page took a wrong turn in the AI analysis.
          </p>
          <p className="text-base text-muted-foreground max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist, may have been
            moved, or is taking a break. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Animation */}
        <div className="mx-auto">
          <Lottie
            animationData={loadingAnimation}
            loop
            autoplay
            className="w-full max-w-[280px] md:max-w-[360px] mx-auto"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="group">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="group"
            onClick={() => router.back()}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </span>
          </Button>
          <Button asChild variant="outline" size="lg" className="group">
            <Link
              href="mailto:support@example.com"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Report Issue
            </Link>
          </Button>
        </div>

        {/* Helpful links */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3">Popular pages</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Home", href: "/", icon: Home },
              { label: "Login", href: "/login", icon: LogIn },
              { label: "Sign Up", href: "/register", icon: UserPlus },
              { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
              >
                <link.icon className="h-3 w-3" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
