"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Trash2 } from "lucide-react";

interface CouponColumnsProps {
  handleToggleActive: (id: string, currentStatus: boolean) => void;
  handleDelete: (id: string, code: string) => void;
}

export const getCouponColumns = ({
  handleToggleActive,
  handleDelete,
}: CouponColumnsProps): ColumnDef<any>[] => [
  {
    accessorKey: "code",
    header: "Coupon Code",
    cell: ({ row }) => (
      <span className="font-mono bg-rose-50 text-rose-600 font-bold px-3 py-1.5 rounded-lg border border-rose-100 text-sm tracking-wider">
        {row.original.code}
      </span>
    ),
  },
  {
    accessorKey: "discountValue",
    header: "Discount",
    cell: ({ row }) => (
      <span className="font-bold text-neutral-800 text-sm">
        {row.original.discountType === "PERCENTAGE"
          ? `${row.original.discountValue}% Off`
          : `৳${row.original.discountValue} Off`}
      </span>
    ),
  },
  {
    accessorKey: "minOrderValue",
    header: "Min. Spend",
    cell: ({ row }) => (
      <span className="text-neutral-500 text-sm font-medium">
        {row.original.minOrderValue ? `৳${row.original.minOrderValue}` : "No minimum"}
      </span>
    ),
  },
  {
    id: "usage",
    header: "Usage / Limit",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-neutral-800 font-bold text-sm">{row.original.usageCount}</span>
        <span className="text-neutral-400">/</span>
        <span className="text-neutral-500 text-sm font-medium">
          {row.original.maxUsageLimit ?? "∞"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "expiresAt",
    header: "Expiry Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
        <Calendar className="w-4 h-4 text-neutral-400" />
        {row.original.expiresAt
          ? new Date(row.original.expiresAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Never Expires"}
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const coupon = row.original;
      const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) <= new Date();
      const isUsageLimitReached = coupon.maxUsageLimit && coupon.usageCount >= coupon.maxUsageLimit;
      const isValid = coupon.isActive && !isExpired && !isUsageLimitReached;
      return (
        <button
          onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
            isValid
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isValid ? "bg-emerald-500" : "bg-neutral-400"}`} />
          {isValid ? "Active" : isExpired ? "Expired" : isUsageLimitReached ? "Limit Reached" : "Disabled"}
        </button>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <button
          onClick={() => handleDelete(row.original.id, row.original.code)}
          className="p-2 hover:bg-rose-50 hover:text-rose-500 text-neutral-400 rounded-xl transition-all duration-200"
          title="Delete Coupon"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    ),
  },
];
