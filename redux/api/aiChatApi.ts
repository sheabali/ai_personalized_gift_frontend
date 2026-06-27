import { baseApi } from "./baseApi";

export const aiChatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiRecommendation: builder.mutation({
      query: (data) => ({
        url: "/ai-chat/message",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetAiRecommendationMutation } = aiChatApi;
