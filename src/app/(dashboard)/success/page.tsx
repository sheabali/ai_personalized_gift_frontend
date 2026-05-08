'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetDashboardStatsQuery } from '@/redux/api/resumeApi';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  // Refresh stats to show new plan immediately
  const { refetch } = useGetDashboardStatsQuery({});

  useEffect(() => {
    if (sessionId) {
      refetch();
      
      // Auto-redirect after 5 seconds
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [sessionId, router, refetch]);

  if (!sessionId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl p-8 text-center space-y-6">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-500 text-4xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Invalid Session</h1>
          <p className="text-gray-500">We couldn't verify your payment session. Please check your dashboard.</p>
          <Button onClick={() => router.push('/dashboard')} className="w-full bg-[#6B5FD3] rounded-xl py-6">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-green-500/20 animate-ping" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payment Successful!</h1>
          <p className="text-gray-600 font-medium">
            Thank you for your purchase. Your account has been upgraded and your new credits are active.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-[#6B5FD3]" />
            Redirecting to dashboard...
          </div>
          <Button 
            onClick={() => router.push('/dashboard')}
            className="w-full h-12 bg-[#6B5FD3] hover:bg-[#5A4FC1] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            Go to Dashboard Now <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
