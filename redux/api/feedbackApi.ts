import { baseApi } from "./baseApi";

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitFeedback: builder.mutation({
      query: (feedbackData) => ({
        url: "/feedback",
        method: "POST",
        body: feedbackData,
      }),
      // invalidatesTags: ["Feedback"],
    }),
    getAllFeedback: builder.query({
      query: () => "/feedback",
      // providesTags: ["Feedback"],
    }),
  }),
});

export const { useSubmitFeedbackMutation, useGetAllFeedbackQuery } =
  feedbackApi;
