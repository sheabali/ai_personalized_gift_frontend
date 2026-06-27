"use client";

import React, { useState, useEffect } from "react";
import { useGetReferralStatsQuery } from "@/redux/api/referralApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Share2,
  Gift,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Ticket,
  TrendingUp,
  Sparkles,
  Loader2,
  Info
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function UserReferralsPage() {
  const { data: statsRes, isLoading, refetch } = useGetReferralStatsQuery(undefined);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const stats = statsRes?.data || {
    referralCode: "",
    totalReferrals: 0,
    totalShares: 0,
    referrals: [],
    shares: [],
    coupons: [],
  };

  const referralLink = stats.referralCode ? `${origin}/register?ref=${stats.referralCode}` : "";

  const handleCopyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCoupon(code);
      toast.success(`Coupon code ${code} copied!`);
      setTimeout(() => setCopiedCoupon(null), 2000);
    } catch (err) {
      toast.error("Failed to copy coupon code");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter coupons
  const activeCoupons = stats.coupons.filter((c: any) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date()) && c.usageCount < (c.maxUsageLimit || 1));
  const inactiveCoupons = stats.coupons.filter((c: any) => !activeCoupons.includes(c));

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Gradient Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-800 to-rose-950 text-white rounded-3xl p-8 md:p-12 shadow-xl border border-neutral-800">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-rose-500 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            GiftAI Rewards Program
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-sora tracking-tight leading-tight">
            Invite Friends & <span className="text-rose-400">Earn Discounts</span>
          </h1>
          <p className="text-neutral-300 md:text-lg">
            Share the magic of AI-personalized gifting. Get <strong>5% OFF</strong> for every friend who signs up, and give them <strong>10% OFF</strong>. Or share your designs for an instant <strong>10% coupon</strong>!
          </p>
        </div>
      </div>

      {/* Referral Link & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Link Card */}
        <Card className="lg:col-span-2 overflow-hidden border-neutral-100 shadow-sm rounded-2xl bg-white flex flex-col justify-between">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xl font-bold font-sora flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Your Personal Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6 flex-grow flex flex-col justify-between">
            <p className="text-neutral-500 text-sm">
              Copy this link and send it to your friends. When they register using this link, they get a welcome coupon and you get a referral coupon instantly!
            </p>
            
            <div className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 w-full mt-2">
              <span className="text-neutral-700 text-sm font-medium px-2 truncate flex-grow select-all select-none">
                {referralLink || "Generating link..."}
              </span>
              <Button
                onClick={handleCopyLink}
                disabled={!referralLink}
                className="rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white shrink-0 shadow-sm flex items-center gap-1.5"
                size="sm"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? "Copied" : "Copy"}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2">
              <Info className="w-3.5 h-3.5" />
              <span>Valid for unlimited uses. Coupons generated expire after 30 days.</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary Column */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="border-neutral-100 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Friends Referred</p>
                <p className="text-3xl font-bold text-neutral-900 font-sora mt-0.5">{stats.totalReferrals}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-100 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Designs Shared</p>
                <p className="text-3xl font-bold text-neutral-900 font-sora mt-0.5">{stats.totalShares}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-100 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Coupons Earned</p>
                <p className="text-3xl font-bold text-neutral-900 font-sora mt-0.5">{stats.coupons.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Earned Coupons Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-sora text-neutral-900 flex items-center gap-2">
          <Ticket className="w-6 h-6 text-primary" />
          My Reward Coupons
        </h2>

        {stats.coupons.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center">
            <p className="text-neutral-500">You haven't earned any coupons yet. Share an AI design or refer a friend to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Active Coupons */}
            {activeCoupons.map((coupon: any) => (
              <div
                key={coupon.id}
                className="relative bg-white rounded-2xl border-2 border-dashed border-rose-200 p-6 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Decorative side circles to look like a ticket */}
                <div className="absolute top-1/2 left-[-10px] transform -translate-y-1/2 w-5 h-5 bg-neutral-50 border-r border-rose-200 rounded-full"></div>
                <div className="absolute top-1/2 right-[-10px] transform -translate-y-1/2 w-5 h-5 bg-neutral-50 border-l border-rose-200 rounded-full"></div>
                
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-none font-semibold px-2.5 py-0.5">
                      {coupon.source}
                    </Badge>
                    <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none font-semibold px-2 py-0.5">
                      Active
                    </Badge>
                  </div>

                  <div>
                    <span className="text-3xl font-extrabold text-neutral-900 font-sora">
                      {coupon.discountValue}
                      {coupon.discountType === "PERCENTAGE" ? "%" : "৳"}
                    </span>
                    <span className="text-neutral-400 font-bold ml-1 text-sm uppercase">OFF</span>
                  </div>

                  <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 mt-2">
                    <span className="font-mono font-bold text-neutral-800 tracking-wider text-base">
                      {coupon.code}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className="h-8 w-8 p-0 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                    >
                      {copiedCoupon === coupon.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="border-t border-dashed border-neutral-100 mt-5 pt-3 flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Expires: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}
                  </span>
                  <span>1 time use</span>
                </div>
              </div>
            ))}

            {/* Inactive / Used / Expired Coupons */}
            {inactiveCoupons.map((coupon: any) => {
              const isUsed = coupon.usageCount >= (coupon.maxUsageLimit || 1);
              const statusText = isUsed ? "Used" : "Expired";
              return (
                <div
                  key={coupon.id}
                  className="relative bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 p-6 flex flex-col justify-between overflow-hidden opacity-60"
                >
                  <div className="absolute top-1/2 left-[-10px] transform -translate-y-1/2 w-5 h-5 bg-neutral-50 border-r border-neutral-200 rounded-full"></div>
                  <div className="absolute top-1/2 right-[-10px] transform -translate-y-1/2 w-5 h-5 bg-neutral-50 border-l border-neutral-200 rounded-full"></div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-neutral-100 text-neutral-500 border-none font-semibold px-2 py-0.5">
                        {coupon.source}
                      </Badge>
                      <Badge className="bg-neutral-200 text-neutral-600 border-none font-semibold px-2 py-0.5">
                        {statusText}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-3xl font-extrabold text-neutral-600 font-sora">
                        {coupon.discountValue}
                        {coupon.discountType === "PERCENTAGE" ? "%" : "৳"}
                      </span>
                      <span className="text-neutral-400 font-bold ml-1 text-sm uppercase">OFF</span>
                    </div>

                    <div className="flex items-center justify-between bg-neutral-100/50 p-2.5 rounded-xl border border-neutral-200/40 mt-2">
                      <span className="font-mono font-bold text-neutral-500 tracking-wider text-base line-through">
                        {coupon.code}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-neutral-200 mt-5 pt-3 flex items-center justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {isUsed ? "Redeemed" : `Expired: ${coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "N/A"}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Friends & Shared Designs Lists Tabs/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Referred Friends List */}
        <Card className="border-neutral-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="p-6 border-b border-neutral-100">
            <CardTitle className="text-lg font-bold font-sora flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Referred Friends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.referrals.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-sm">
                No friends joined yet. Copy your link above and share it!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-400 font-semibold border-b border-neutral-100">
                      <th className="p-4 pl-6">Friend Details</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 pr-6 text-right">Coupon Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.referrals.map((ref: any, idx: number) => (
                      <tr key={idx} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <p className="font-bold text-neutral-800">{ref.friendName}</p>
                          <p className="text-xs text-neutral-400">{ref.friendEmail}</p>
                        </td>
                        <td className="p-4 text-neutral-500">
                          {new Date(ref.friendDate || ref.signupDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 pr-6 text-right font-mono font-semibold text-xs text-rose-500">
                          {ref.couponCode || "Pending"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shared Designs List */}
        <Card className="border-neutral-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="p-6 border-b border-neutral-100">
            <CardTitle className="text-lg font-bold font-sora flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Shared AI Designs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.shares.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-sm">
                You haven't shared any designs yet. Go to your AI Designs tab to share!
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {stats.shares.map((share: any, idx: number) => (
                  <div key={idx} className="p-4 px-6 flex items-center justify-between hover:bg-neutral-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                        <Image
                          src={share.thumbnail}
                          alt={share.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-neutral-800 text-sm line-clamp-1">{share.productName}</p>
                        <p className="text-xs text-neutral-400 capitalize">Shared to {share.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">{new Date(share.shareDate).toLocaleDateString()}</p>
                      <p className="font-mono text-xs text-rose-500 font-semibold mt-0.5">{share.couponCode}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
