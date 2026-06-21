"use client";

import { useGetProductByIdQuery } from "@/redux/api/productApi";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Sparkles, 
  Star, 
  Heart, 
  Share2, 
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetProductByIdQuery(id as string);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isRedirectingToAi, setIsRedirectingToAi] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const product = data?.data;

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button onClick={() => router.push("/products")} className="mt-4">Back to Shop</Button>
      </div>
    );
  }

  const dispatch = useAppDispatch();
  const images = [product.thumbnail, ...(product.images || [])];

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: `${product.id}-no-ai`,
      productId: product.id,
      name: product.name,
      thumbnail: product.thumbnail,
      category: product.category,
      price: product.discountPrice || product.price,
      quantity: quantity,
      aiDesignId: null,
      aiDesign: null
    }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8 overflow-x-auto no-scrollbar pb-2">
          <button onClick={() => router.push("/")} className="hover:text-neutral-900 whitespace-nowrap">Home</button>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <button onClick={() => router.push("/products")} className="hover:text-neutral-900 whitespace-nowrap">Products</button>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-neutral-900 font-medium whitespace-nowrap truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              layoutId="main-image"
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-neutral-50 shadow-2xl"
            >
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.isAiEnabled && (
                <div className="absolute top-6 left-6">
                  <Badge className="bg-primary hover:bg-primary text-white border-none px-4 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-md bg-opacity-90">
                    <Sparkles className="w-4 h-4" />
                    AI Customizable
                  </Badge>
                </div>
              )}
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? "border-primary scale-95" : "border-transparent hover:border-neutral-200"
                  }`}
                >
                  <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary border-primary rounded-full px-3">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><Heart className="w-5 h-5 text-neutral-400" /></button>
                  <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><Share2 className="w-5 h-5 text-neutral-400" /></button>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-neutral-900">
                ৳{product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-xl text-neutral-400 line-through mb-1">
                  ৳{product.price}
                </span>
              )}
            </div>

            <p className="text-neutral-500 text-lg leading-relaxed max-w-lg">
              {product.description}
            </p>

            {/* AI Call to Action */}
            {product.isAiEnabled && (
              <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Sparkles className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Personalize with AI</h3>
                </div>
                <p className="text-sm text-neutral-600">
                  Use our AI magic to turn your photo into a stunning cartoon or anime portrait for this {product.name.toLowerCase()}.
                </p>
                <Button 
                  onClick={() => {
                    setIsRedirectingToAi(true);
                    setTimeout(() => {
                      router.push(`/ai-design?productId=${product.id}`);
                    }, 1000);
                  }}
                  disabled={isRedirectingToAi}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20"
                >
                  {isRedirectingToAi ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Magic in progress...
                    </div>
                  ) : (
                    "Start Designing Now"
                  )}
                </Button>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden h-12">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 hover:bg-neutral-50 transition-colors border-r border-neutral-200"
                  >
                    -
                  </button>
                  <span className="px-6 font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 hover:bg-neutral-50 transition-colors border-l border-neutral-200"
                  >
                    +
                  </button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl gap-2 font-bold transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
                  <Truck className="w-4 h-4 text-primary" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
                  <RotateCcw className="w-4 h-4 text-primary" />
                  30-Day Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
