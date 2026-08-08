"use client";

import { Ticket, CheckCircle, XCircle } from "lucide-react";

interface CouponStatsProps {
  stats: {
    totalCoupons: number;
    activeCoupons: number;
    expiredCoupons: number;
  };
  isLoading: boolean;
}

export default function CouponStats({ stats, isLoading }: CouponStatsProps) {
  const statItems = [
    { label: "Total Coupons", value: stats.totalCoupons, icon: Ticket, color: "rose", bg: "bg-rose-50", text: "text-rose-500", glow: "bg-rose-500/5" },
    { label: "Active & Valid", value: stats.activeCoupons, icon: CheckCircle, color: "emerald", bg: "bg-emerald-50", text: "text-emerald-500", glow: "bg-emerald-500/5" },
    { label: "Expired", value: stats.expiredCoupons, icon: XCircle, color: "amber", bg: "bg-amber-50", text: "text-amber-500", glow: "bg-amber-500/5" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map(({ label, value, icon: Icon, bg, text, glow }) => (
        <div
          key={label}
          className="relative overflow-hidden bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center gap-5"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 ${glow} rounded-full blur-2xl -mr-5 -mt-5`} />
          <div className={`p-4 ${bg} ${text} rounded-2xl`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">{label}</p>
            <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">
              {isLoading ? "..." : value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
