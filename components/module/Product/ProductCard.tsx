"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGetMyWishlistQuery, useToggleWishlistMutation } from "@/redux/api/wishlistApi";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";

interface ProductCardProps {
  product: any;
  aiDesignId?: string | null;
}

export default function ProductCard({ product, aiDesignId }: ProductCardProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { id, name, price, discountPrice, thumbnail, isAiEnabled, stock } = product;

  const { data: wishlistData } = useGetMyWishlistQuery(undefined, {
    skip: !user,
  });
  const [toggleWishlist] = useToggleWishlistMutation();

  const isWishlisted = wishlistData?.data?.some((item: any) => item.productId === id);

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    try {
      const res = await toggleWishlist({ productId: id }).unwrap();
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col space-y-3"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-50 shadow-sm border border-neutral-100/50">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {isAiEnabled && (
            <Badge className="bg-primary/90 hover:bg-primary text-white border-none px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              AI Enabled
            </Badge>
          )}
          {discountPrice && discountPrice < price && (
            <Badge className="bg-red-500/90 hover:bg-red-500 text-white border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Sale
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleToggleWishlist();
          }}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all shadow-sm ${isWishlisted
            ? 'bg-red-50 text-red-500 hover:bg-red-100'
            : 'bg-white/80 backdrop-blur-md text-neutral-400 hover:text-red-500 hover:bg-white'
            }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Image link */}
        <Link href={`/products/${id}${aiDesignId ? `?aiDesignId=${aiDesignId}` : ""}`} className="block w-full h-full">
          <Image
            src={thumbnail || "/images/placeholder-product.jpg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-white font-bold tracking-widest uppercase text-xs">Out of Stock</span>
            </div>
          )}
        </Link>
      </div>

      {/* Info Section */}
      <div className="flex flex-col space-y-1 px-1">
        <Link href={`/products/${id}${aiDesignId ? `?aiDesignId=${aiDesignId}` : ""}`} className="block">
          <h3 className="text-sm font-medium text-neutral-900 group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-relaxed tracking-tight">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-md font-bold text-neutral-900">
            Tk {(discountPrice || price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {discountPrice && discountPrice < price && (
            <span className="text-xs text-neutral-400 line-through">
              Tk {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Link href={`/products/${id}${aiDesignId ? `?aiDesignId=${aiDesignId}` : ""}`} className="block w-full">
          <Button
            variant="outline"
            className="w-full h-12 rounded-none border border-black bg-white hover:bg-black text-black hover:text-white transition-all duration-300 font-medium text-sm"
            disabled={stock === 0}
          >
            Choose options
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
