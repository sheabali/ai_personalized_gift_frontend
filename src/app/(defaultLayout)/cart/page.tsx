"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart
} from "@/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Minus,
  Plus,
  Sparkles,
  Gift,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, subTotal, totalAmount } = useAppSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-xl border border-neutral-100 space-y-6"
        >
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-300">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-neutral-900">Your cart is empty</h2>
            <p className="text-neutral-500">Looks like you haven&apos;t added any gifts yet.</p>
          </div>
          <Button
            onClick={() => router.push("/products")}
            className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-lg gap-2"
          >
            Go Shopping
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Cart Items List */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Shopping Bag</h1>
              <span className="text-neutral-500 font-medium">{items.length} items</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-all"
                  >
                    <div className="relative w-32 h-40 rounded-2xl overflow-hidden bg-neutral-50 flex-shrink-0">
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      {item.aiDesignId && (
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-primary/90 text-[10px] text-white border-none py-0.5 px-2 rounded-full flex items-center gap-1 shadow-lg">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI Design
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary transition-colors">{item.name}</h3>
                          <p className="text-sm text-neutral-400 font-medium uppercase tracking-wider">{item.category}</p>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden h-10 w-fit">
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                            className="px-3 hover:bg-neutral-50 transition-colors border-r border-neutral-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-5 text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            className="px-3 hover:bg-neutral-50 transition-colors border-l border-neutral-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xl font-bold text-neutral-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Link href="/products" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors font-bold">
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-neutral-100 sticky top-24 space-y-8">
              <div className="flex items-center gap-2 text-neutral-900">
                <Gift className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">Order Summary</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-neutral-900">${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Tax</span>
                  <span className="text-neutral-900">$0.00</span>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex justify-between items-end">
                  <span className="text-lg font-bold text-neutral-900">Total Amount</span>
                  <span className="text-3xl font-extrabold text-neutral-900">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => router.push("/checkout")}
                  className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-neutral-200 gap-3"
                >
                  Checkout Now
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-center text-xs text-neutral-400 font-medium">
                  Secure checkout with SSLCOMMERZ. <br /> All major cards accepted.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </div>
  );
}
