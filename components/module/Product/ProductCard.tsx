"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, ShoppingCart, Star, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { toast } from "sonner";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { id, name, price, discountPrice, thumbnail, category, isAiEnabled, stock } = product;

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: `${id}-no-ai`,
      productId: id,
      name,
      thumbnail,
      category,
      price: discountPrice || price,
      quantity: 1,
      aiDesignId: null,
      aiDesign: null
    }));
    toast.success(`${name} added to cart!`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="relative overflow-hidden rounded-3xl border-neutral-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {isAiEnabled && (
            <Badge className="bg-primary hover:bg-primary text-white border-none px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Enabled
            </Badge>
          )}
          {discountPrice && (
            <Badge className="bg-red-500 hover:bg-red-500 text-white border-none px-3 py-1 rounded-full">
              Sale
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-neutral-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
          <Heart className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <Link href={`/products/${id}`}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={thumbnail || "/images/placeholder-product.jpg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {stock === 0 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-white font-bold tracking-widest uppercase">Out of Stock</span>
              </div>
            )}
          </div>
        </Link>

        {/* Content Section */}
        <CardContent className="p-5 space-y-2">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            {category}
          </p>
          <Link href={`/products/${id}`}>
            <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
            <span className="text-xs text-neutral-400 ml-1">(4.8)</span>
          </div>

          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-neutral-900">
              ৳{discountPrice || price}
            </span>
            {discountPrice && (
              <span className="text-sm text-neutral-400 line-through mb-0.5">
                ৳{price}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="w-full rounded-xl bg-neutral-900 hover:bg-primary text-white transition-all group-hover:shadow-lg gap-2"
            disabled={stock === 0}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
