"use client";

import LoginForm from "./LoginForm";
import LoginBrandPanel from "./LoginBrandPanel";
import { useLogin } from "@/hooks/useLogin";

/**
 * Login page shell.
 * Composes the form panel and brand panel sub-components.
 * All logic (form state, social auth, redirect) is delegated to `useLogin`.
 */
export default function LoginPage() {
  const { methods, onSubmit, isLoading, isSocialLoading, sessionStatus } = useLogin();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100">
        {/* Left: Interactive form panel */}
        <LoginForm
          methods={methods}
          onSubmit={onSubmit}
          isLoading={isLoading}
          isSocialLoading={isSocialLoading}
          sessionStatus={sessionStatus}
        />
        {/* Right: Static branding panel */}
        <LoginBrandPanel />
      </div>
    </div>
  );
}