import { baseApi } from "./baseApi";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean | string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all products (with filters)
    getAllProducts: builder.query({
      query: (params: GetProductsParams = {}) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Product"],
    }),

    // GET single product by ID
    getProductById: builder.query({
      query: (id: string) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    // GET single product by slug
    getProductBySlug: builder.query({
      query: (slug: string) => `/products/slug/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Product", id: slug }],
    }),

    // ADMIN: Create product
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    // ADMIN: Update product
    updateProduct: builder.mutation({
      query: ({ id, ...body }: { id: string; [key: string]: unknown }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Product", id }],
    }),

    // ADMIN: Delete product
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
