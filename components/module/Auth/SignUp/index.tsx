"use client";

import { Button } from "@/components/ui/button";
import NRInput from "@/components/form/NRInput";
import { useRegisterMutation } from "@/redux/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Phone, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm your password"),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegistrationValues = z.infer<typeof registrationSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const methods = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = async (data: RegistrationValues) => {
    try {
      const { confirmPassword, ...payload } = data;
      const res = await registerUser(payload).unwrap() as any;

      if (res.success) {
        toast.success("Account created successfully! Please log in.");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100">

        {/* Left Side: Illustration & Branding */}
        <div className="hidden md:flex md:w-1/2 bg-neutral-900 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {/* Decorative pattern or gradient could go here */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
              <Gift className="w-8 h-8 text-primary" />
              <span>GiftAI</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Create magic with <span className="text-primary">AI-personalized</span> gifts.
            </h1>
            <p className="text-neutral-400 text-lg">
              Join thousands of users turning photos into unique anime and cartoon portraits for the perfect gift.
            </p>
          </div>

          <div className="relative z-10">
            <p className="text-sm text-neutral-500">
              © 2024 GiftAI. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 bg-white">
          <div className="max-w-sm mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-neutral-900">Create account</h2>
              <p className="text-neutral-500">Fill in your details to get started.</p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                  <NRInput
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    control={methods.control}
                  />

                  <NRInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    control={methods.control}
                  />

                  <NRInput
                    name="phone"
                    label="Phone Number (Optional)"
                    placeholder="+8801700000000"
                    control={methods.control}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NRInput
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      control={methods.control}
                    />
                    <NRInput
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      control={methods.control}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all font-semibold"
                  >
                    {isLoading ? "Creating account..." : "Sign up"}
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
              <Button variant="outline" className="h-11 rounded-xl border-neutral-200">
                <Image src="/images/google.svg" alt="Google" width={20} height={20} className="mr-2" />
                Google
              </Button>
              <Button variant="outline" className="h-11 rounded-xl border-neutral-200">
                <Image src="/images/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
                Facebook
              </Button>
            </div>

            <p className="text-center text-sm text-neutral-500">
              Already have an account?{" "}
              <Link href="/login" className="text-neutral-900 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
