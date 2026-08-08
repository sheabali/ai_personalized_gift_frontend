"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export default function ProductImageViewModal({
  isOpen,
  onClose,
  images,
  activeIndex,
  setActiveIndex,
}: ProductImageViewModalProps) {
  // Handle keyboard events (Esc to close, Left/Right arrow keys to navigate)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, images]);

  const handlePrev = () => {
    setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  };

  const handleNext = () => {
    setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close button top-right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-all hover:bg-neutral-50 hover:text-neutral-800"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left navigation arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 md:left-8 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-100 bg-white/80 shadow-md text-neutral-700 transition-all hover:bg-white hover:text-black"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative max-h-[85vh] max-w-[90vw] aspect-[4/5] md:aspect-square w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-h-[80vh] aspect-[4/5]">
              <Image
                src={images[activeIndex]}
                alt={`Product image view ${activeIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 85vw"
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Right navigation arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 md:right-8 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-100 bg-white/80 shadow-md text-neutral-700 transition-all hover:bg-white hover:text-black"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(index);
                  }}
                  className={`h-2 w-2 rounded-full transition-all ${
                    activeIndex === index ? "w-6 bg-neutral-800" : "bg-neutral-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
