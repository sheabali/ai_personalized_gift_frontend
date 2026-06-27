"use client";

import { useGetMyWishlistQuery, useToggleWishlistMutation } from "@/redux/api/wishlistApi";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Trash2, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function UserWishlistPage() {
  const { data, isLoading } = useGetMyWishlistQuery(undefined);
  const [toggleWishlist] = useToggleWishlistMutation();
  const dispatch = useAppDispatch();

  const wishlists = data?.data || [];

  const handleRemove = async (productId: string) => {
    try {
      const res = await toggleWishlist({ productId }).unwrap();
      if (res.success) {
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleBuyNow = (product: any) => {
    dispatch(addToCart({
      id: `${product.id}-no-ai`,
      productId: product.id,
      name: product.name,
      thumbnail: product.thumbnail,
      category: product.category,
      price: product.discountPrice || product.price,
      quantity: 1,
      aiDesignId: null,
      aiDesign: null
    }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Wishlist</h1>
        <p className="text-sm text-neutral-500 mt-1">My Watch List</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-[#7E122C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : wishlists.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f8f9fa] rounded-2xl flex flex-col items-center justify-center py-24 space-y-4"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Heart className="w-8 h-8 text-neutral-300" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-neutral-900">Your wishlist is empty</h3>
            <p className="text-sm text-neutral-500">Save items you love here to easily find them later!</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {wishlists.map((item: any, index: number) => {
            const product = item.product;
            if (!product) return null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#f8f9fa] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                {/* Product Info & Image */}
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0 bg-neutral-100 rounded-xl overflow-hidden">
                    <Image
                      src={product.thumbnail || "/images/placeholder-product.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link href={`/products/${product.id}`} className="hover:underline">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xl font-bold text-neutral-900">
                      ৳{product.discountPrice || product.price}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 ml-auto">
                  <button 
                    onClick={() => handleRemove(product.id)}
                    className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-neutral-600 hover:text-red-600" />
                  </button>
                  <Button 
                    onClick={() => handleBuyNow(product)}
                    className="bg-[#7E122C] hover:bg-[#5f0d21] text-white rounded-full px-8 h-10 text-sm font-medium transition-colors"
                  >
                    Buy Now
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
