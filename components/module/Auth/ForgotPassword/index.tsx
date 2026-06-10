"use client";

import { Button } from "@/components/ui/button";
import NRInput from "@/components/form/NRInput";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Gift, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const methods = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const res = await forgotPassword(data).unwrap() as any;
      if (res.success) {
        toast.success(res.message || "OTP sent to your email!");
        router.push(`/forgot-password/otp?email=${data.email}`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send reset code.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 p-8 md:p-12">
        <div className="max-w-sm mx-auto space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center text-primary shadow-xl">
              <Gift className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-neutral-900">Forgot Password</h2>
              <p className="text-neutral-500">Enter your email and we&apos;ll send you a code to reset your password.</p>
            </div>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <NRInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                control={methods.control}
                icon={Mail}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2"
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                  {!isLoading && <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="pt-4 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
