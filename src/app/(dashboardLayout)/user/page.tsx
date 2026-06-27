"use client";

import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { Button } from "@/components/ui/button";
import { Package, RefreshCw, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const STATUS_CONFIG: Record<string, { label: string, colorClass: string, actionText: string, actionHref: (order: any, item: any) => string }> = {
  PENDING: {
    label: "Pending",
    colorClass: "bg-gray-100 text-gray-700",
    actionText: "View Details",
    actionHref: (order) => `/user/track/${order.id}`,
  },
  PAID: {
    label: "Paid",
    colorClass: "bg-blue-50 text-blue-600",
    actionText: "Track Order",
    actionHref: (order) => `/user/track/${order.id}`,
  },
  PROCESSING: {
    label: "In process",
    colorClass: "bg-orange-50 text-orange-600",
    actionText: "Track Order",
    actionHref: (order) => `/user/track/${order.id}`,
  },
  SHIPPED: {
    label: "In transit",
    colorClass: "bg-green-50 text-green-600",
    actionText: "Track Order",
    actionHref: (order) => `/user/track/${order.id}`,
  },
  DELIVERED: {
    label: "Recieved", // Matching the typo in the design image or intentional
    colorClass: "bg-yellow-50 text-yellow-600",
    actionText: "Give a Review",
    actionHref: (order, item) => `/user/review/${item.product?.id || item.productId}`,
  },
  CANCELLED: {
    label: "Cancelled",
    colorClass: "bg-red-50 text-red-600",
    actionText: "View Details",
    actionHref: (order) => `/user/track/${order.id}`,
  },
};

export default function UserOrderHistoryPage() {
  const { data, isLoading, refetch } = useGetMyOrdersQuery({});
  const orders = data?.data?.orders || data?.data || [];

  // Flatten items for the new design
  const items = orders.flatMap((order: any) => 
    (order.items || []).map((item: any) => ({
      order,
      item
    }))
  ).sort((a: any, b: any) => new Date(b.order.createdAt).getTime() - new Date(a.order.createdAt).getTime());

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Order History</h1>
          <p className="text-sm text-neutral-500 mt-1">Recent Orders</p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="rounded-xl gap-2 h-10 px-4 border-neutral-200 bg-white"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-[#7E122C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f8f9fa] rounded-2xl flex flex-col items-center justify-center py-24 space-y-4"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <ShoppingBag className="w-8 h-8 text-neutral-300" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-neutral-900">No orders yet</h3>
            <p className="text-sm text-neutral-500">Start shopping to create personalized gifts!</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {items.map(({ order, item }: any, index: number) => {
            const statusConfig = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.PENDING;
            const orderDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit", month: "2-digit", year: "2-digit"
            });

            return (
              <motion.div
                key={`${order.id}-${item.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#f8f9fa] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {item.product?.name || "Product Name"}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.colorClass}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500">Saler Name : Vine</p>
                    <p className="text-sm text-neutral-500">Order Date : {orderDate}</p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Button asChild className="bg-[#7E122C] hover:bg-[#5f0d21] text-white rounded-full px-8 py-6 h-auto text-sm font-medium transition-colors">
                    <Link href={statusConfig.actionHref(order, item)}>
                      {statusConfig.actionText}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
