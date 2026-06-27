import { baseApi } from "./baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyWishlist: builder.query({
      query: () => ({
        url: "/wishlist",
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),
    toggleWishlist: builder.mutation({
      query: (data: { productId: string }) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const { useGetMyWishlistQuery, useToggleWishlistMutation } = wishlistApi;
