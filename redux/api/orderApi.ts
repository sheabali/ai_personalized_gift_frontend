import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new order (JSON body)
    createOrder: builder.mutation({
      query: (body: {
        items: Array<{
          productId: string;
          aiDesignId?: string | null;
          quantity: number;
          price: number;
        }>;
        shippingAddress: string;
        totalAmount: number;
      }) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    // GET user's own orders
    getMyOrders: builder.query({
      query: () => ({
        url: "/orders/my-orders",
      }),
      providesTags: ["Order"],
    }),

    // GET single order by ID
    getOrderById: builder.query({
      query: (id: string) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
} = orderApi;
