"use client";

import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, RefreshCw, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_STEPS = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function UserOrderHistoryPage() {
  const { data, isLoading, refetch } = useGetMyOrdersQuery({});
  const orders = data?.data?.orders || data?.data || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">My Orders</h1>
          <p className="text-neutral-500 font-medium">
            Track all your gift orders
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="rounded-xl gap-2 h-11 px-6 border-neutral-100 bg-white"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center justify-center py-24 space-y-6"
        >
          <div className="w-20 h-20 bg-neutral-50 rounded-3xl flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-neutral-300" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-neutral-900">No orders yet</h3>
            <p className="text-neutral-400">Start shopping to create personalized gifts!</p>
          </div>
          <Button asChild className="rounded-xl gap-2 h-12 px-8">
            <Link href="/products">
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any, index: number) => {
            const currentStep = STATUS_STEPS.indexOf(order.orderStatus);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 space-y-6"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">
                        Order #{order.id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-neutral-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-BD", {
                          day: "2-digit", month: "long", year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-extrabold text-neutral-900">
                      ৳{order.totalAmount?.toLocaleString()}
                    </p>
                    <Badge className={`${STATUS_COLORS[order.orderStatus] || "bg-neutral-100"} rounded-full text-xs font-semibold border`}>
                      {order.orderStatus}
                    </Badge>
                  </div>
                </div>

                {/* Progress Tracker */}
                {order.orderStatus !== "CANCELLED" && (
                  <div className="relative">
                    <div className="flex items-center justify-between relative z-10">
                      {STATUS_STEPS.map((step, i) => (
                        <div key={step} className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                            i <= currentStep
                              ? "bg-neutral-900 border-neutral-900 text-white"
                              : "bg-white border-neutral-200 text-neutral-400"
                          }`}>
                            {i < currentStep ? "✓" : i + 1}
                          </div>
                          <span className={`text-[10px] font-semibold text-center hidden sm:block ${
                            i <= currentStep ? "text-neutral-900" : "text-neutral-400"
                          }`}>
                            {step}
                          </span>
                          {/* Connector line */}
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`absolute top-4 left-0 right-0 h-0.5 -z-10`}
                              style={{
                                left: `${(i / (STATUS_STEPS.length - 1)) * 100}%`,
                                width: `${100 / (STATUS_STEPS.length - 1)}%`,
                                background: i < currentStep ? "#171717" : "#e5e7eb"
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-3">
                  {(order.orderItems || []).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
                      {item.product?.thumbnail && (
                        <img
                          src={item.product.thumbnail}
                          alt={item.product?.name}
                          className="w-14 h-14 object-cover rounded-xl"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 text-sm truncate">
                          {item.product?.name || "Product"}
                        </p>
                        {item.aiDesign && (
                          <p className="text-xs text-primary font-medium">✨ AI Personalized</p>
                        )}
                        <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-neutral-900 text-sm">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="pt-2 border-t border-neutral-50">
                    <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">Shipping To</p>
                    <p className="text-sm text-neutral-600">
                      <span className="font-semibold text-neutral-800">{typeof order.shippingAddress.fullName === 'string' ? order.shippingAddress.fullName : 'Guest'}</span> ({typeof order.shippingAddress.phone === 'string' ? order.shippingAddress.phone : 'N/A'}) <br/>
                      {typeof order.shippingAddress.address === 'string' ? order.shippingAddress.address : 'N/A'}, {typeof order.shippingAddress.city === 'string' ? order.shippingAddress.city : 'N/A'} - {typeof order.shippingAddress.zipCode === 'string' ? order.shippingAddress.zipCode : ''}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
