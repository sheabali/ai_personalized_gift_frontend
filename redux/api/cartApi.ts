import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    syncCart: builder.mutation({
      query: (data) => ({
        url: "/carts",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    getCart: builder.query({
      query: () => ({
        url: "/carts",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
  }),
});

export const { useSyncCartMutation, useGetCartQuery } = cartApi;
