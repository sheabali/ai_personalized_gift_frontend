/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitFeedbackMutation } from "@/redux/api/feedbackApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  category: z.enum([
    "BUG",
    "FEATURE_REQUEST",
    "IMPROVEMENT",
    "GENERAL_FEEDBACK",
    "SUPPORT",
  ]),
  message: z.string().min(10, "Message must be at least 10 characters long"),
  rating: z.number().min(1).max(5).optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "GENERAL_FEEDBACK",
      message: "",
      rating: 0,
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      await submitFeedback({ ...data, rating }).unwrap();
      toast.success("Thank you for your feedback!");
      form.reset();
      setRating(0);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to submit feedback. Please try again."
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">How are we doing?</h2>
        <p className="text-gray-500 mt-2">
          Your feedback helps us make CareerAI better for everyone.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BUG">Bug Report</SelectItem>
                    <SelectItem value="FEATURE_REQUEST">
                      Feature Request
                    </SelectItem>
                    <SelectItem value="IMPROVEMENT">Improvement</SelectItem>
                    <SelectItem value="GENERAL_FEEDBACK">
                      General Feedback
                    </SelectItem>
                    <SelectItem value="SUPPORT">Support</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us what's on your mind..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col items-center space-y-2">
            <FormLabel>Rating</FormLabel>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#6B5FD3] hover:bg-[#5a4fb8] text-white py-6 text-lg font-semibold rounded-xl transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Send Feedback"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackForm;
