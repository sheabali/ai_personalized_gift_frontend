"use client";

import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { useParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_STEPS = [
  { label: "Order Confirmed", value: "PENDING" }, // Assuming PENDING or PAID is confirmed
  { label: "In process", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "In transit", value: "IN_TRANSIT" }, // Just to match design, though schema might not have IN_TRANSIT
  { label: "Recieved", value: "DELIVERED" },
];

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetMyOrdersQuery({});

  const orders = data?.data?.orders || data?.data || [];
  const order = orders.find((o: any) => o.id === orderId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-[#7E122C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <button onClick={() => router.push("/user")} className="text-primary hover:underline">
          Back to Orders
        </button>
      </div>
    );
  }

  // Assuming first item for display
  const item = order.items?.[0] || {};
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit", month: "2-digit", year: "2-digit"
  });

  // Calculate estimated delivery (e.g., +3 days)
  const estDeliveryDate = new Date(order.createdAt);
  estDeliveryDate.setDate(estDeliveryDate.getDate() + 3);
  const estDeliveryStr = estDeliveryDate.toLocaleDateString("en-GB", {
    day: "2-digit", month: "2-digit", year: "2-digit"
  });

  // Calculate progress
  // Schema enum: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  // We'll map the schema statuses to our UI steps
  let currentStepIndex = 0;
  switch (order.orderStatus) {
    case "PENDING":
    case "PAID":
    case "CONFIRMED":
      currentStepIndex = 0;
      break;
    case "PROCESSING":
      currentStepIndex = 1;
      break;
    case "SHIPPED":
      currentStepIndex = 2; // Also assuming In Transit for 3 if we want to show it progressing
      break;
    case "DELIVERED":
      currentStepIndex = 4;
      break;
    case "CANCELLED":
      currentStepIndex = -1;
      break;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Track Order</h1>

      <div className="space-y-1">
        <p className="text-lg font-bold text-neutral-900">Product Name : {item.product?.name || "Product Name"}</p>
        <p className="text-sm text-neutral-500">Saler Name : Vine</p>
      </div>

      <div className="pt-8">
        <h3 className="text-xl font-bold text-neutral-900 mb-12">Track your order progress</h3>

        {order.orderStatus === "CANCELLED" ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold">
            This order has been cancelled.
          </div>
        ) : (
          <div className="relative">
            {/* Connecting Lines */}
            <div className="absolute top-5 left-8 right-8 flex items-center justify-between -z-10">
              {STATUS_STEPS.map((_, i) => {
                if (i === STATUS_STEPS.length - 1) return null;
                const isCompleted = i < currentStepIndex;
                return (
                  <div
                    key={i}
                    className="h-[2px] flex-1"
                    style={{
                      backgroundColor: isCompleted ? "#7E122C" : "#f5d0d8",
                      opacity: isCompleted ? 1 : 0.5
                    }}
                  />
                );
              })}
            </div>

            {/* Steps */}
            <div className="flex items-center justify-between relative z-10">
              {STATUS_STEPS.map((step, i) => {
                const isCompleted = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;

                return (
                  <div key={i} className="flex flex-col items-center gap-4 w-24">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${isCompleted
                        ? "bg-[#7E122C] text-white shadow-lg shadow-[#7e122c]/20"
                        : "bg-white border-2 border-[#f5d0d8] text-[#7E122C]"
                        }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className="text-[11px] sm:text-xs text-center font-medium text-neutral-600">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="pt-8 mt-12 border-t border-neutral-100 flex flex-col sm:flex-row gap-12">
        <div className="space-y-1">
          <p className="text-sm font-bold text-neutral-900">Order date</p>
          <p className="text-sm font-bold text-neutral-900">{orderDate}</p>
          <p className="text-xs text-neutral-400">8:30 am</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-neutral-900">Estimated Delivery Time</p>
          <p className="text-sm font-bold text-neutral-900">{estDeliveryStr}</p>
          <p className="text-xs text-neutral-400">6:30 am</p>
        </div>
      </div>
    </div>
  );
}
