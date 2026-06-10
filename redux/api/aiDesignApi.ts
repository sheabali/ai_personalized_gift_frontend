import { baseApi } from "./baseApi";

export const aiDesignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Trigger AI generation (JSON body)
    generateDesign: builder.mutation({
      query: (body: {
        productId: string;
        originalImage: string;
        style: string;
        prompt?: string;
      }) => ({
        url: "/ai-designs/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AiDesign"],
    }),

    // GET user's AI design history
    getMyDesigns: builder.query({
      query: () => ({
        url: "/ai-designs/my-designs",
      }),
      providesTags: ["AiDesign"],
    }),

    // GET single design by ID
    getDesignById: builder.query({
      query: (id: string) => `/ai-designs/${id}`,
      providesTags: (_result, _error, id) => [{ type: "AiDesign", id }],
    }),

    // Delete a design
    deleteDesign: builder.mutation({
      query: (id: string) => ({
        url: `/ai-designs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AiDesign"],
    }),
  }),
});

export const {
  useGenerateDesignMutation,
  useGetMyDesignsQuery,
  useGetDesignByIdQuery,
  useDeleteDesignMutation,
} = aiDesignApi;
