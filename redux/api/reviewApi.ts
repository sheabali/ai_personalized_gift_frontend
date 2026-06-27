import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createReview: build.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review", "Product"],
    }),
    getProductReviews: build.query({
      query: (productId: string) => ({
        url: `/reviews/${productId}`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
  }),
});

export const { useCreateReviewMutation, useGetProductReviewsQuery } = reviewApi;
