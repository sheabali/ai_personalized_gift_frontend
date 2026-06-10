"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function OrderFailPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 pt-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-neutral-100 space-y-8"
      >
        <div className="relative">
           <div className="absolute inset-0 bg-red-500/10 rounded-full blur-3xl"></div>
           <div className="relative w-24 h-24 bg-red-500 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl -rotate-12">
              <AlertCircle className="w-12 h-12 rotate-12" />
           </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">Payment Failed</h1>
          <p className="text-neutral-500 text-lg">
            We couldn&apos;t process your payment. Don&apos;t worry, your cart items are still safe.
          </p>
          <div className="inline-block px-4 py-2 bg-neutral-50 rounded-full border border-neutral-100">
             <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
               Reference ID: <span className="text-neutral-900">{transactionId}</span>
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button asChild className="h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-lg gap-2">
            <Link href="/checkout">
              <RefreshCcw className="w-5 h-5" />
              Try Again
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-14 rounded-2xl font-bold text-lg gap-2">
            <Link href="/support">
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </Link>
          </Button>
        </div>

        <Button asChild variant="ghost" className="text-neutral-500 hover:text-neutral-900 gap-2">
          <Link href="/">
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
