import { baseApi } from "./baseApi";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: ({ chatId, page = 1, limit = 50 }: { chatId: string; page?: number; limit?: number }) => ({
        url: `/message/${chatId}`,
        params: { page, limit },
      }),
      providesTags: (result, error, arg) => [{ type: "Message", id: arg.chatId }],
    }),
    sendMessage: builder.mutation({
      query: ({ chatId, ...data }: { chatId: string; content?: string; fileUrl?: string; type?: string }) => ({
        url: `/message/${chatId}`,
        method: "POST",
        body: data,
      }),
      // We don't necessarily want to invalidate all messages immediately if we use Socket.io for updates,
      // but it's safe to have for fallback.
      invalidatesTags: (result, error, arg) => [{ type: "Message", id: arg.chatId }, "Chat"],
    }),
    updateMessage: builder.mutation({
      query: ({ chatId, messageId, content }: { chatId: string; messageId: string; content: string }) => ({
        url: `/message/${chatId}/${messageId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Message", id: arg.chatId }],
    }),
    deleteMessage: builder.mutation({
      query: ({ chatId, messageId }: { chatId: string; messageId: string }) => ({
        url: `/message/${chatId}/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Message", id: arg.chatId }],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messageApi;
