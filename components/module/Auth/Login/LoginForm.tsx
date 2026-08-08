"use client";

import { Button } from "@/components/ui/button";
import NRInput from "@/components/form/NRInput";
import { ArrowRight, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { signIn } from "next-auth/react";
import { LoginValues } from "@/hooks/useLogin";

// ─── Props ──────────────────────────────────────────────────────────────────────
interface LoginFormProps {
  /** React Hook Form methods object passed from the parent via useLogin hook */
  methods: UseFormReturn<LoginValues>;
  /** Called on valid form submission */
  onSubmit: (data: LoginValues) => Promise<void>;
  /** True while the email/password login request is in-flight */
  isLoading: boolean;
  /** True while the social (Google) auth request is in-flight */
  isSocialLoading: boolean;
  /** Current next-auth session status */
  sessionStatus: "loading" | "authenticated" | "unauthenticated";
}

/**
 * Login form UI — pure presentational component.
 * All logic (submission, social auth, redirect) lives in the `useLogin` hook.
 */
export default function LoginForm({
  methods,
  onSubmit,
  isLoading,
  isSocialLoading,
  sessionStatus,
}: LoginFormProps) {
  return (
    <div className="w-full md:w-1/2 p-8 lg:p-12 bg-white">
      <div className="max-w-sm mx-auto space-y-8">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="space-y-2">
          {/* Mobile logo — hidden on desktop where brand panel shows */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter mb-8 md:hidden">
            <Gift className="w-8 h-8 text-primary" />
            <span>GiftAI</span>
          </Link>
          <h2 className="text-3xl font-bold text-neutral-900">Welcome back</h2>
          <p className="text-neutral-500">Sign in to your account to continue.</p>
        </div>

        {/* ── Email / Password Form ─────────────────────────────────────── */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <NRInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                control={methods.control}
              />
              <div className="space-y-1">
                <NRInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  control={methods.control}
                />
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    hidden
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2"
              >
                {isLoading ? "Signing in..." : "Sign in"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </form>
        </FormProvider>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-neutral-400">Or continue with</span>
          </div>
        </div>

        {/* ── Social Auth Buttons ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-neutral-200"
            onClick={() => signIn("google")}
            disabled={sessionStatus === "loading" || isSocialLoading}
          >
            {isSocialLoading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <Image src="/images/google.svg" alt="Google" width={20} height={20} className="mr-2" />
                Google
              </>
            )}
          </Button>
          <Button type="button" variant="outline" className="h-11 rounded-xl border-neutral-200" disabled>
            <Image src="/images/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
            Facebook
          </Button>
        </div>

        {/* ── Register Link ─────────────────────────────────────────────── */}
        <p className="text-center text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-neutral-900 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
