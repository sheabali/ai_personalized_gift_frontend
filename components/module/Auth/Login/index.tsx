/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setCookie } from "@/src/utils/cookies";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type LoginFormValues = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation() as any;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();

      console.log("Login Response:", res);

      if (res?.success) {
        const token = res?.data?.accessToken;
        const user = res?.data?.user;

        // Save user in redux
        dispatch(
          setUser({
            token,
            user,
          })
        );

        toast.success(res?.message || "Login successful!");

        // Redirect based on role
        if (user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      console.error("Login Error:", error);

      toast.error(
        error?.data?.message ||
        error?.message ||
        (error?.status === "FETCH_ERROR" ? "Cannot connect to server. Is the backend running?" : "Something went wrong")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex w-full max-w-6xl items-center gap-28 px-4">

        {/* Left Side Image */}
        <div className="hidden md:flex flex-1 items-center justify-center rounded-lg min-h-[90vh]">
          <Image
            src="/images/otp.jpg"
            alt="Login Image"
            width={800}
            height={800}
            className="object-cover rounded-lg"
            priority
          />
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <Link href="/">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="mx-auto mb-4 rounded-2xl"
            />
          </Link>

          <h1 className="text-center text-2xl font-semibold">
            Welcome Back
          </h1>

          <p className="mb-6 mt-3 text-center text-sm text-gray-600">
            Sign in to your account
          </p>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <PHInput
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
              />

              <PHInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 font-semibold"
              >
                {isLoading ? "Loading..." : "Sign In"}
              </Button>
            </form>
          </FormProvider>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-black hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;