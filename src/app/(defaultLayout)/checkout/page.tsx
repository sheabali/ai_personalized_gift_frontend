"use client";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import { clearCart } from "@/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import NRInput from "@/components/form/NRInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import {
  ShieldCheck,
  MapPin,
  Phone,
  User,
  CreditCard,
  ChevronLeft,
  Lock,
  Truck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";

const checkoutSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(11, "Valid phone number is required"),
  address: z.string().min(5, "Shipping address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(4, "Zip code is required"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

  const methods = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
    },
  });

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const onSubmit = async (data: CheckoutValues) => {
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          aiDesignId: item.aiDesignId || null,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: `${data.address}, ${data.city}, ${data.zipCode}`,
        totalAmount: totalAmount,
        guestInfo: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
          country: "Bangladesh"
        }
      };

      const res = await createOrder(orderData).unwrap();

      if (res.success && res.data.paymentUrl) {
        toast.success("Redirecting to payment gateway...");
        // In a real app, we might clear cart here OR after payment confirmation
        // dispatch(clearCart()); 
        window.location.href = res.data.paymentUrl;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Checkout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Checkout Form */}
          <div className="flex-1 space-y-8">
            <div className="space-y-2">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Cart
              </button>
              <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Checkout</h1>
              <p className="text-neutral-500 font-medium">Complete your shipping and payment details.</p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">

                {/* Shipping Info Section */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100 space-y-6">
                  <div className="flex items-center gap-3 text-neutral-900 mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold">Shipping Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NRInput name="name" label="Full Name" placeholder="John Doe" control={methods.control} />
                    <NRInput name="email" label="Email Address" type="email" placeholder="john@example.com" control={methods.control} />
                    <NRInput name="phone" label="Phone Number" placeholder="+8801700000000" control={methods.control} />
                    <NRInput name="zipCode" label="Zip Code" placeholder="1212" control={methods.control} />
                  </div>
                  <NRInput name="address" label="Street Address" placeholder="123 Street Name" control={methods.control} />
                  <NRInput name="city" label="City" placeholder="Dhaka" control={methods.control} />
                </div>

                {/* Payment Method Section */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100 space-y-6">
                  <div className="flex items-center gap-3 text-neutral-900 mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold">Payment Method</h3>
                  </div>

                  <div className="p-6 border-2 border-primary bg-primary/5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Image src="/images/sslcommerz.png" alt="SSLCommerz" width={32} height={32} />
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">Online Payment</p>
                        <p className="text-xs text-neutral-500">Pay securely via SSLCOMMERZ gateway</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border-4 border-primary bg-white"></div>
                  </div>

                  <p className="text-xs text-neutral-400 flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    Your payment information is encrypted and processed securely.
                  </p>
                </div>

                <div className="md:hidden">
                    <Button
                      type="submit"
                      disabled={isOrdering || user?.role === "ADMIN"}
                      className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-neutral-200 disabled:opacity-50"
                    >
                      {user?.role === "ADMIN" ? "Admins cannot order" : isOrdering ? "Processing..." : `Pay ৳${totalAmount.toFixed(2)}`}
                    </Button>
                </div>
              </form>
            </FormProvider>
          </div>

          {/* Right Sidebar: Order Summary */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-neutral-100 sticky top-24 space-y-8">
              <h3 className="text-2xl font-bold text-neutral-900">Your Order</h3>

              <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-neutral-50 flex-shrink-0">
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-neutral-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-neutral-900 mt-1">৳{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-neutral-100">
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 font-bold">৳{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex justify-between items-end">
                  <span className="text-lg font-bold text-neutral-900">Total Due</span>
                  <span className="text-3xl font-extrabold text-neutral-900">৳{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="hidden md:block">
                <Button
                  onClick={methods.handleSubmit(onSubmit)}
                  disabled={isOrdering || user?.role === "ADMIN"}
                  className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-neutral-200 gap-3 disabled:opacity-50"
                >
                  {user?.role === "ADMIN" ? "Admins cannot place orders" : isOrdering ? "Processing..." : `Confirm & Pay Now`}
                  <ShieldCheck className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2">
                <Truck className="w-10 h-10 text-neutral-100" />
                <ShieldCheck className="w-10 h-10 text-neutral-100" />
                <CreditCard className="w-10 h-10 text-neutral-100" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
