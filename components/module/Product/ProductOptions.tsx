"use client";

import { useState, useEffect } from "react";
import { Truck, Sparkles, Heart, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductOptionsProps {
  product: any;
  quantity: number;
  setQuantity: (q: number) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  onAddToCart: () => void;
  onBuyItNow: () => void;
  onCustomize: () => void;
  isRedirectingToAi: boolean;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export default function ProductOptions({
  product,
  quantity,
  setQuantity,
  selectedSize,
  setSelectedSize,
  onAddToCart,
  onBuyItNow,
  onCustomize,
  isRedirectingToAi,
  isWishlisted,
  onToggleWishlist,
}: ProductOptionsProps) {
  const [deliveryDate, setDeliveryDate] = useState("");

  // Calculate delivery date dynamically (today + 2 days)
  useEffect(() => {
    const today = new Date();
    const estDate = new Date(today);
    estDate.setDate(today.getDate() + 2);
    
    const formatted = estDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    setDeliveryDate(formatted);
  }, []);

  const sizes = product.sizes || [];

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="flex flex-col gap-6 text-neutral-900">
      {/* Brand/Category and Actions (Wishlist/Share) */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
          {product.category || "GOODYBRO"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleWishlist}
            className={`p-2 rounded-full transition-colors ${
              isWishlisted
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : "hover:bg-neutral-100 text-neutral-400 hover:text-red-500"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
          <button
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Share product"
          >
            <Share2 className="w-5 h-5 text-neutral-400 hover:text-black" />
          </button>
        </div>
      </div>

      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-black leading-tight">
        {product.name}
      </h1>

      {/* Price section */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-medium text-neutral-900">
          Tk {formatPrice(product.discountPrice || product.price)}
        </span>
        {product.discountPrice && (
          <span className="text-lg text-neutral-400 line-through">
            Tk {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* Shipping and Delivery Details */}
      <div className="flex flex-col gap-2.5 border-b border-neutral-150 pb-5 text-[13px] text-neutral-600">
        <div>
          <span className="underline cursor-pointer hover:text-black">Shipping</span> calculated at checkout.
        </div>
        
        {deliveryDate && (
          <div className="flex items-center gap-2 font-medium text-neutral-800">
            <span className="flex items-center justify-center bg-green-50 text-green-700 rounded-full p-1 h-5 w-5 shrink-0">
              <Truck className="w-3.5 h-3.5 fill-current" />
            </span>
            <span>Expect Delivery by <span className="font-bold">{deliveryDate}</span>.</span>
          </div>
        )}

        <div className="text-neutral-500">
          Phone: <span className="font-medium text-neutral-800">09613119911</span> (11am- 11pm)
        </div>
      </div>

      {/* Sizes Section */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Size</span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size: string) => {
              const isActive = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] h-10 px-4 flex items-center justify-center rounded-full text-xs font-medium border transition-all ${
                    isActive
                      ? "bg-black border-black text-white"
                      : "bg-white border-neutral-300 text-black hover:border-black"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Section */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Quantity</span>
        <div className="flex w-32 items-center justify-between border border-neutral-300 rounded-md h-10 overflow-hidden bg-white text-sm">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            &mdash;
          </button>
          <span className="font-semibold text-neutral-800">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            &#43;
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 pt-3">
        {/* Add to Cart */}
        <Button
          onClick={onAddToCart}
          variant="outline"
          className="w-full h-12 rounded-md border border-black text-black bg-white hover:bg-neutral-50 hover:text-black font-semibold text-sm transition-all shadow-none"
        >
          Add to cart
        </Button>

        {/* Buy it Now */}
        <Button
          onClick={onBuyItNow}
          className="w-full h-12 rounded-md bg-[#C25343] hover:bg-[#B04A3C] text-white font-semibold text-sm transition-all shadow-none border-none"
        >
          Buy it now
        </Button>

        {/* Customize & Order in bulk (AI Design integration) */}
        {product.isAiEnabled && (
          <Button
            onClick={onCustomize}
            disabled={isRedirectingToAi}
            className="w-full h-12 rounded-md bg-black hover:bg-neutral-900 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-none"
          >
            {isRedirectingToAi ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Customizing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Customize & Order in bulk</span>
              </div>
            )}
          </Button>
        )}
      </div>

      {/* Description and Highlights */}
      <div className="mt-4 flex flex-col gap-6 border-t border-neutral-100 pt-6">
        {/* Main description paragraph */}
        <p className="text-[14px] text-neutral-600 leading-relaxed">
          {product.description}
        </p>

        {/* Product Highlights */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Product Highlights</h3>
            <ul className="list-disc pl-5 text-[14px] text-neutral-600 space-y-1">
              {product.tags.map((tag: string, index: number) => (
                <li key={index} className="capitalize">{tag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Product Type Details */}
        <div className="text-[13px] text-neutral-500">
          Product Type: <span className="font-semibold text-neutral-700 capitalize">{product.category}</span>
        </div>
      </div>
    </div>
  );
}
