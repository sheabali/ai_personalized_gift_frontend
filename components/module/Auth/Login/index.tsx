"use client";

import { Button } from "@/components/ui/button";
import NRInput from "@/components/form/NRInput";
import { useLoginMutation, useSocialAuthMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Gift, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [socialAuth, { isLoading: isSocialLoading }] = useSocialAuthMutation();
  const { data: session, status } = useSession();
  const { token } = useAppSelector((state) => state.auth);
  const hasCalledSocialAuth = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email && !token && !hasCalledSocialAuth.current) {
      hasCalledSocialAuth.current = true;

      const email = session.user.email;
      const name = session.user.name || "Google User";
      const avatar = session.user.image || null;
      const googleId = (session as any).providerAccountId || null;

      const handleSocialLogin = async () => {
        try {
          const referredBy = localStorage.getItem("gift_ai_referred_by") || undefined;
          const res = await socialAuth({
            email,
            name,
            avatar,
            googleId,
            referredBy,
          }).unwrap() as any;

          if (res.success) {
            dispatch(
              setUser({
                token: res.data.accessToken,
                user: res.data.user,
              })
            );

            toast.success("Welcome back! Logged in with Google.");
            localStorage.removeItem("gift_ai_referred_by");

            if (res.data.user?.role === "ADMIN") {
              router.push("/admin/dashboard");
            } else {
              router.push("/");
            }
          }
        } catch (error: any) {
          toast.error(error?.data?.message || "Google authentication failed.");
          hasCalledSocialAuth.current = false;
        }
      };

      handleSocialLogin();
    }
  }, [status, session, token, socialAuth, dispatch, router]);

  const methods = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      const res = await login(data).unwrap() as any;

      if (res.success) {
        dispatch(
          setUser({
            token: res.data.accessToken,
            user: res.data.user,
          })
        );

        toast.success("Welcome back!");

        if (res.data.user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100">

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 bg-white">
          <div className="max-w-sm mx-auto space-y-8">
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter mb-8 md:hidden">
                <Gift className="w-8 h-8 text-primary" />
                <span>GiftAI</span>
              </Link>
              <h2 className="text-3xl font-bold text-neutral-900">Welcome back</h2>
              <p className="text-neutral-500">Sign in to your account to continue.</p>
            </div>

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
                      <Link href="/forgot-password" hidden className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-100"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-neutral-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-neutral-200"
                onClick={() => signIn("google")}
                disabled={status === "loading" || isSocialLoading}
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

            <p className="text-center text-sm text-neutral-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-neutral-900 font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Visual & Branding */}
        <div className="hidden md:flex md:w-1/2 bg-neutral-900 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          </div>

          <div className="relative z-10 flex justify-end">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
              <Gift className="w-8 h-8 text-primary" />
              <span>GiftAI</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-6 text-right">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Personalized gifts <br /> <span className="text-primary text-3xl lg:text-4xl">powered by intelligence.</span>
            </h1>
            <p className="text-neutral-400 text-lg ml-auto max-w-[300px]">
              Access your saved designs and orders from anywhere.
            </p>
          </div>

          <div className="relative z-10 flex justify-end">
            <p className="text-sm text-neutral-500">
              © 2024 GiftAI.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}