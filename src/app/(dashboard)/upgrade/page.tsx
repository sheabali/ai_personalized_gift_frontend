'use client';

import React from 'react';
import { useCreateCheckoutSessionMutation } from '@/redux/api/resumeApi';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Zap,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function UpgradePage() {
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();

  const handleUpgrade = async (planType: 'PRO' | 'PAY_PER_REPORT') => {
    try {
      const response = await createCheckoutSession({ planType }).unwrap();

      if (response.data.url) {
        window.location.assign(response.data.url);
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      toast.error(error.data?.message || 'Failed to initiate checkout. Please try again.');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-4 text-center">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-[#6B5FD3] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#6B5FD3] to-[#8B7FF3] bg-clip-text text-transparent">
          Supercharge Your Career
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get advanced AI insights, unlimited analyses, and professional cover letters to land your dream job faster.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Single Report */}
        <Card className="border-2 border-gray-100 hover:border-indigo-200 transition-all shadow-sm flex flex-col rounded-3xl overflow-hidden group">
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl font-bold text-gray-800">Single Report</CardTitle>
              <Badge variant="outline" className="text-gray-500 font-semibold px-3">One-time</Badge>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900">$2</span>
              <span className="text-muted-foreground font-medium">/ analysis</span>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 flex-grow">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-600">
                <div className="bg-green-100 p-1 rounded-full"><Check className="w-4 h-4 text-green-600" /></div>
                Full ATS Score Analysis
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <div className="bg-green-100 p-1 rounded-full"><Check className="w-4 h-4 text-green-600" /></div>
                Target Keyword Optimization
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <div className="bg-green-100 p-1 rounded-full"><Check className="w-4 h-4 text-green-600" /></div>
                Detailed Improvement Tips
              </li>
              <li className="flex items-center gap-3 text-gray-400 line-through decoration-gray-300">
                AI Cover Letter Generation
              </li>
            </ul>
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Button
              onClick={() => handleUpgrade('PAY_PER_REPORT')}
              disabled={isLoading}
              variant="outline"
              className="w-full h-14 text-lg font-bold border-2 border-gray-200 hover:border-[#6B5FD3] hover:text-[#6B5FD3] rounded-2xl group-hover:bg-indigo-50/50 transition-all"
            >
              Buy One Credit
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative border-2 border-[#6B5FD3] shadow-xl shadow-indigo-100 flex flex-col rounded-3xl overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#6B5FD3] text-white px-6 py-2 rounded-bl-3xl font-bold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Recommended
          </div>
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl font-bold text-[#6B5FD3]">Pro Plan</CardTitle>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900">$5</span>
              <span className="text-muted-foreground font-medium">/ month</span>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 flex-grow">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <div className="bg-indigo-100 p-1 rounded-full"><Zap className="w-4 h-4 text-[#6B5FD3] fill-[#6B5FD3]" /></div>
                Unlimited AI Analyses
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <div className="bg-indigo-100 p-1 rounded-full"><Zap className="w-4 h-4 text-[#6B5FD3] fill-[#6B5FD3]" /></div>
                Unlimited Cover Letters
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <div className="bg-indigo-100 p-1 rounded-full"><Zap className="w-4 h-4 text-[#6B5FD3] fill-[#6B5FD3]" /></div>
                Advanced Keyword Insights
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <div className="bg-indigo-100 p-1 rounded-full"><Zap className="w-4 h-4 text-[#6B5FD3] fill-[#6B5FD3]" /></div>
                Priority AI Processing
              </li>
            </ul>
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Button
              onClick={() => handleUpgrade('PRO')}
              disabled={isLoading}
              className="w-full h-14 text-lg font-bold bg-[#6B5FD3] hover:bg-[#5A4FC1] rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95"
            >
              Get Unlimited Access
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Trust Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-muted-foreground py-8 opacity-70">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-sm font-medium">Secure Payment by Stripe</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          <span className="text-sm font-medium">Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
}
