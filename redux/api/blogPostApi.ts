import { baseApi } from "./baseApi";

export const blogPostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogPosts: builder.query({
      query: (params) => ({
        url: "/blog-posts",
        method: "GET",
        params,
      }),
      providesTags: ["BlogPost"],
    }),
    getBlogPostById: builder.query({
      query: (id) => ({
        url: `/blog-posts/${id}`,
        method: "GET",
      }),
      providesTags: ["BlogPost"],
    }),
    getBlogPostBySlug: builder.query({
      query: (slug) => ({
        url: `/blog-posts/slug/${slug}`,
        method: "GET",
      }),
      providesTags: ["BlogPost"],
    }),
    createBlogPost: builder.mutation({
      query: (data) => ({
        url: "/blog-posts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BlogPost"],
    }),
    updateBlogPost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/blog-posts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["BlogPost"],
    }),
    deleteBlogPost: builder.mutation({
      query: (id) => ({
        url: `/blog-posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogPost"],
    }),
  }),
});

export const {
  useGetAllBlogPostsQuery,
  useGetBlogPostByIdQuery,
  useGetBlogPostBySlugQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogPostApi;
