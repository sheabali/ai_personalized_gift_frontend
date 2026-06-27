"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useCreateReviewMutation, useGetProductReviewsQuery } from "@/redux/api/reviewApi";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading } = useGetProductReviewsQuery(productId);
  const { data: orderData } = useGetMyOrdersQuery({}, { skip: !user });
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const reviews = data?.data || [];

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const orders = orderData?.data?.orders || orderData?.data || [];
  const hasPurchased = orders.some((order: any) => 
    order.orderStatus === "DELIVERED" && 
    (order.items || []).some((item: any) => item.productId === productId || item.product?.id === productId)
  );

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
        setRating(0);
        setHoverRating(0);
        setComment("");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="mt-20 pt-10 border-t border-neutral-200">
      <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Reviews Summary & Form */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-neutral-50 p-6 rounded-2xl text-center space-y-2 border border-neutral-100">
            <div className="text-5xl font-extrabold text-neutral-900">{averageRating}</div>
            <div className="flex justify-center text-primary">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? "fill-primary" : "text-neutral-300"}`}
                />
              ))}
            </div>
            <p className="text-neutral-500 text-sm">Based on {reviews.length} review{reviews.length !== 1 && 's'}</p>
          </div>

          {user ? (
            hasPurchased ? (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-100">
                <h3 className="text-lg font-bold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex gap-1">
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
                            className={`w-6 h-6 ${
                              star <= (hoverRating || rating)
                                ? "fill-primary text-primary"
                                : "text-neutral-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comment (Optional)</label>
                    <Textarea
                      placeholder="Share your thoughts about this product..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="resize-none h-24"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isCreating} 
                    className="w-full font-bold"
                  >
                    {isCreating ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-neutral-50 p-6 rounded-2xl text-center border border-neutral-100">
                <p className="text-neutral-600">You must purchase and receive this product to write a review.</p>
              </div>
            )
          ) : (
            <div className="bg-neutral-50 p-6 rounded-2xl text-center border border-neutral-100">
              <p className="text-neutral-600 mb-4">Please log in to write a review.</p>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2 space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review: any, index: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={review.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.user?.avatar} />
                      <AvatarFallback>{review.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-neutral-900">{review.user?.name || "Anonymous"}</h4>
                      <p className="text-xs text-neutral-500">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-neutral-200"}`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-neutral-700 leading-relaxed">{review.comment}</p>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-100 border-dashed">
              <Star className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-900 mb-1">No reviews yet</h3>
              <p className="text-neutral-500">Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
