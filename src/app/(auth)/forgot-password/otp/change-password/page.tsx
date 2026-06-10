"use client";

import { Button } from "@/components/ui/button";
import NRInput from "@/components/form/NRInput";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { motion } from "framer-motion";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const methods = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      const res = await resetPassword({
        email,
        password: data.confirmPassword,
      }).unwrap() as any;

      if (res.success) {
        toast.success("Password reset successful! Please log in.");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 p-8 md:p-12"
      >
        <div className="max-w-sm mx-auto space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center text-primary shadow-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-neutral-900">New Password</h2>
              <p className="text-neutral-500">Create a secure password for your account.</p>
            </div>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <NRInput
                  name="newPassword"
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  control={methods.control}
                  icon={Lock}
                />
                
                <NRInput
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  control={methods.control}
                  icon={Lock}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-neutral-200"
                >
                  {isLoading ? "Saving..." : "Reset Password"}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </motion.div>
    </div>
  );
}
