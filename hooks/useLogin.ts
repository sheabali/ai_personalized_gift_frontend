import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoginMutation, useSocialAuthMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

// ─── Validation Schema ─────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

/**
 * Custom hook encapsulating all logic for the Login page:
 * - Email/password form submission
 * - Google SSO effect triggered via next-auth session
 * - Role-based redirect after successful authentication
 */
export function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [socialAuth, { isLoading: isSocialLoading }] = useSocialAuthMutation();
  const { data: session, status } = useSession();
  const { token } = useAppSelector((state) => state.auth);

  // Guard ref to prevent the social auth effect from firing multiple times
  const hasCalledSocialAuth = useRef(false);

  /** Redirect to the appropriate dashboard based on role. */
  const redirectByRole = (role: string) => {
    router.push(role === "ADMIN" ? "/admin/dashboard" : "/");
  };

  // ─── Google SSO Effect ───────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email && !token && !hasCalledSocialAuth.current) {
      hasCalledSocialAuth.current = true;

      const handleSocialLogin = async () => {
        try {
          const referredBy = localStorage.getItem("gift_ai_referred_by") || undefined;
          const res = await socialAuth({
            email: session.user!.email,
            name: session.user!.name || "Google User",
            avatar: session.user!.image || null,
            googleId: (session as any).providerAccountId || null,
            referredBy,
          }).unwrap() as any;

          if (res.success) {
            dispatch(setUser({ token: res.data.accessToken, user: res.data.user }));
            toast.success("Welcome back! Logged in with Google.");
            localStorage.removeItem("gift_ai_referred_by");
            redirectByRole(res.data.user?.role);
          }
        } catch (error: any) {
          const errMsg =
            error?.data?.message ||
            error?.data?.errorMessages?.[0]?.message ||
            "Google authentication failed.";
          toast.error(errMsg);
          hasCalledSocialAuth.current = false;
        }
      };

      handleSocialLogin();
    }
  }, [status, session, token, socialAuth, dispatch, router]);

  // ─── Form Setup ──────────────────────────────────────────────────────────────
  const methods = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  /** Handle standard email/password login submission. */
  const onSubmit = async (data: LoginValues) => {
    try {
      const res = await login(data).unwrap() as any;
      if (res.success) {
        dispatch(setUser({ token: res.data.accessToken, user: res.data.user }));
        toast.success("Welcome back!");
        redirectByRole(res.data.user?.role);
      }
    } catch (error: any) {
      const errMsg =
        error?.data?.message ||
        error?.data?.errorMessages?.[0]?.message ||
        "Login failed. Please check your credentials.";
      toast.error(errMsg);
    }
  };

  return {
    methods,
    onSubmit,
    isLoading,
    isSocialLoading,
    sessionStatus: status,
  };
}
