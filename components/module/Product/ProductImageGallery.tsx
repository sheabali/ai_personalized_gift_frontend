"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductImageViewModal from "./ProductImageViewModal";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  isAiEnabled: boolean;
}

export default function ProductImageGallery({
  images,
  productName,
  isAiEnabled,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrevThumbnail = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextThumbnail = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image View */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-neutral-50 shadow-sm border border-neutral-100 group"
      >
        <Image
          src={images[activeIndex]}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        
        {isAiEnabled && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary hover:bg-primary/95 text-white border-none px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              AI Customizable
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 px-1">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrevThumbnail}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:text-black hover:bg-neutral-50 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Thumbnails list */}
          <div className="flex flex-1 items-center justify-center gap-3 overflow-x-auto no-scrollbar py-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-square w-20 md:w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                  activeIndex === i
                    ? "border-black scale-[0.98]"
                    : "border-transparent opacity-80 hover:opacity-100 hover:border-neutral-200"
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNextThumbnail}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:text-black hover:bg-neutral-50 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      <ProductImageViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
}
