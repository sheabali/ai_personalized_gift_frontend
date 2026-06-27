import RegisterPage from "@/components/module/Auth/SignUp";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center text-neutral-500">Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
};

export default page;
