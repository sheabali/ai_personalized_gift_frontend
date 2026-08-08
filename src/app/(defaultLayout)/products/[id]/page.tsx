"use client";

import { useGetProductByIdQuery } from "@/redux/api/productApi";
import { useGetMyWishlistQuery, useToggleWishlistMutation } from "@/redux/api/wishlistApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { ChevronRight } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ProductReviews from "@/components/module/Product/ProductReviews";
import ProductImageGallery from "@/components/module/Product/ProductImageGallery";
import ProductOptions from "@/components/module/Product/ProductOptions";
import SupportBubble from "@/components/module/Product/SupportBubble";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const aiDesignId = searchParams.get("aiDesignId");
  const { data, isLoading } = useGetProductByIdQuery(id as string);
  
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isRedirectingToAi, setIsRedirectingToAi] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: wishlistData } = useGetMyWishlistQuery(undefined, {
    skip: !user,
  });
  const [toggleWishlist] = useToggleWishlistMutation();

  const product = data?.data;

  // Set default selected size once product is loaded
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button 
          onClick={() => router.push("/products")} 
          className="mt-4 px-6 py-2.5 bg-black text-white font-semibold rounded-md hover:bg-neutral-800 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const isWishlisted = wishlistData?.data?.some((item: any) => item.productId === product.id) || false;

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    try {
      const res = await toggleWishlist({ productId: product.id }).unwrap();
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const images = [product.thumbnail, ...(product.images || [])];

  const handleAddToCart = () => {
    const itemId = selectedSize ? `${product.id}-${selectedSize}-no-ai` : `${product.id}-no-ai`;
    const itemName = selectedSize ? `${product.name} (Size: ${selectedSize})` : product.name;
    dispatch(addToCart({
      id: itemId,
      productId: product.id,
      name: itemName,
      thumbnail: product.thumbnail,
      category: product.category,
      price: product.discountPrice || product.price,
      quantity: quantity,
      aiDesignId: null,
      aiDesign: null
    }));
    toast.success(selectedSize ? `${product.name} (Size: ${selectedSize}) added to cart!` : `${product.name} added to cart!`);
  };

  const handleBuyItNow = () => {
    const itemId = selectedSize ? `${product.id}-${selectedSize}-no-ai` : `${product.id}-no-ai`;
    const itemName = selectedSize ? `${product.name} (Size: ${selectedSize})` : product.name;
    dispatch(addToCart({
      id: itemId,
      productId: product.id,
      name: itemName,
      thumbnail: product.thumbnail,
      category: product.category,
      price: product.discountPrice || product.price,
      quantity: quantity,
      aiDesignId: null,
      aiDesign: null
    }));
    router.push("/checkout");
  };

  const handleCustomize = () => {
    setIsRedirectingToAi(true);
    setTimeout(() => {
      router.push(`/ai-design?productId=${product.id}${aiDesignId ? `&aiDesignId=${aiDesignId}` : ""}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8 overflow-x-auto no-scrollbar pb-2 border-b border-neutral-100">
          <button onClick={() => router.push("/")} className="hover:text-neutral-900 whitespace-nowrap transition-colors">Home</button>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <button onClick={() => router.push("/products")} className="hover:text-neutral-900 whitespace-nowrap transition-colors">Products</button>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-neutral-900 font-medium whitespace-nowrap truncate">{product.name}</span>
        </nav>

        {/* Redesigned two column structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* Left Column: Image Gallery component */}
          <div>
            <ProductImageGallery
              images={images}
              productName={product.name}
              isAiEnabled={product.isAiEnabled}
            />
          </div>

          {/* Right Column: Details & Options selection component */}
          <div>
            <ProductOptions
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              onAddToCart={handleAddToCart}
              onBuyItNow={handleBuyItNow}
              onCustomize={handleCustomize}
              isRedirectingToAi={isRedirectingToAi}
              isWishlisted={isWishlisted}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        </div>

        {/* Product Reviews */}
        <ProductReviews productId={product.id} />
      </div>

      {/* Floating support bubble */}
      <SupportBubble />
    </div>
  );
}

