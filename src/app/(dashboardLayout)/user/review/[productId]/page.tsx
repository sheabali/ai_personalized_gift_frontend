"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCreateReviewMutation } from "@/redux/api/reviewApi";
import { useGetProductByIdQuery } from "@/redux/api/productApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function GiveReviewPage() {
  const { productId } = useParams();
  const router = useRouter();
  
  const { data: productData, isLoading: isLoadingProduct } = useGetProductByIdQuery(productId as string);
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const product = productData?.data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      const res = await createReview({
        productId,
        rating,
        comment,
      }).unwrap();

      if (res.success) {
        toast.success("Review submitted successfully!");
        router.push("/user"); // redirect back to dashboard
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-[#7E122C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => router.push("/user")} className="text-primary hover:underline">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Give a Review</h1>

      <div className="space-y-1">
        <p className="text-lg font-bold text-neutral-900">Product Name : {product.name}</p>
        <p className="text-sm text-neutral-500">Saler Name : Vine</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className="p-1 transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? "fill-[#7E122C] text-[#7E122C]"
                      : "text-neutral-400 stroke-1"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-neutral-700 font-medium">
            Tap on a star to rate your experience with this seller.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-neutral-900">Review</label>
          <Textarea
            placeholder="Write here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none h-32 rounded-xl border-neutral-300 focus-visible:ring-[#7E122C]"
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isCreating} 
            className="w-full sm:w-64 bg-[#7E122C] hover:bg-[#5f0d21] text-white rounded-full py-6 h-auto font-medium transition-colors"
          >
            {isCreating ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
