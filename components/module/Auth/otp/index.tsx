"use client";

import { Button } from "@/components/ui/button";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/redux/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const otpSchema = z.object({
  otp: z.array(z.string().length(1).regex(/^[A-Za-z0-9]$/, "Must be alphanumeric")).length(4),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function Otp() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(4).fill(""));

  const { handleSubmit, formState: { errors }, setValue, trigger } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: Array(4).fill(""),
    },
  });

  const handleResend = async () => {
    if (!email) return toast.error("Email not found");
    try {
      const res = await resendOtp({ email }).unwrap() as any;
      if (res.success) toast.success(res.message || "New code sent!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend code.");
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const chars = value.split("").slice(0, 4 - index);
      const newOtpValues = [...otpValues];
      chars.forEach((char, i) => {
        if (index + i < 4) {
          newOtpValues[index + i] = char;
          setValue(`otp.${index + i}`, char);
        }
      });
      setOtpValues(newOtpValues);
      inputRefs.current[Math.min(index + chars.length, 3)]?.focus();
    } else if (/^[A-Za-z0-9]$/.test(value) || value === "") {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      setValue(`otp.${index}`, value);
      if (value && index < 3) inputRefs.current[index + 1]?.focus();
    }
    trigger("otp");
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    if (!email) return toast.error("Email not found");
    try {
      const res = await verifyOtp({ email, otp: Number(data.otp.join("")) }).unwrap() as any;
      if (res.success) {
        toast.success("Code verified!");
        router.push(`/forgot-password/otp/change-password?email=${email}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired code.");
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-neutral-900">Verify Code</h2>
              <p className="text-neutral-500 text-sm">
                We sent a 4-digit code to <span className="font-semibold text-neutral-900">{email}</span>.
                Enter it below to continue.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between gap-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={otpValues[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-16 text-center text-2xl font-bold bg-neutral-50 border-2 border-neutral-100 rounded-2xl focus:border-neutral-900 focus:bg-white outline-none transition-all"
                />
              ))}
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={isVerifying || otpValues.some((v) => !v)}
                className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all font-semibold shadow-lg shadow-neutral-200"
              >
                {isVerifying ? "Verifying..." : "Verify & Continue"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-sm font-medium text-neutral-500 hover:text-neutral-900 flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
                  {isResending ? "Resending..." : "Resend code"}
                </button>
              </div>
            </div>
          </form>

          <div className="pt-4 text-center">
            <Link href="/forgot-password" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Use a different email
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
