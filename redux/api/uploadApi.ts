import { baseApi } from "./baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Upload a single image to Cloudinary (via backend)
    uploadImage: builder.mutation({
      query: (formData: FormData) => ({
        url: "/uploads/image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Upload"],
    }),

    // Upload multiple images
    uploadImages: builder.mutation({
      query: (formData: FormData) => ({
        url: "/uploads/images",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Upload"],
    }),

    // Delete image from Cloudinary
    deleteImage: builder.mutation({
      query: (publicId: string) => ({
        url: "/uploads/delete",
        method: "DELETE",
        body: { publicId },
      }),
      invalidatesTags: ["Upload"],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useUploadImagesMutation,
  useDeleteImageMutation,
} = uploadApi;
