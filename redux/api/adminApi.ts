import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all orders (admin)
    getAllOrders: builder.query({
      query: (params?: { status?: string; page?: number; limit?: number }) => ({
        url: "/orders/admin/all",
        params,
      }),
      providesTags: ["Order"],
    }),

    // UPDATE order status (admin)
    updateOrderStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/orders/admin/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),

    // GET all users (admin)
    getAllUsers: builder.query({
      query: (params?: { page?: number; limit?: number; search?: string }) => ({
        url: "/users/admin/all",
        params,
      }),
      providesTags: ["User"],
    }),

    // UPDATE user role (admin)
    updateUserRole: builder.mutation({
      query: ({ id, role }: { id: string; role: string }) => ({
        url: `/users/admin/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    // DELETE user (admin)
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/users/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = adminApi;
