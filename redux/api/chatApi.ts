import { baseApi } from "./baseApi";

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyChats: builder.query({
      query: () => "/chat/my-chats",
      providesTags: ["Chat"],
    }),
    getChatById: builder.query({
      query: (chatId: string) => `/chat/${chatId}`,
      providesTags: (result, error, arg) => [{ type: "Chat", id: arg }],
    }),
    createOneToOneChat: builder.mutation({
      query: (data: { userId: string }) => ({
        url: "/chat/one-to-one",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    createGroupChat: builder.mutation({
      query: (data: { name: string; participants: string[] }) => ({
        url: "/chat/group",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    updateGroupChat: builder.mutation({
      query: ({ chatId, ...data }: { chatId: string; name?: string }) => ({
        url: `/chat/${chatId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => ["Chat", { type: "Chat", id: arg.chatId }],
    }),
    addParticipants: builder.mutation({
      query: ({ chatId, participants }: { chatId: string; participants: string[] }) => ({
        url: `/chat/${chatId}/add-participants`,
        method: "POST",
        body: { participants },
      }),
      invalidatesTags: (result, error, arg) => ["Chat", { type: "Chat", id: arg.chatId }],
    }),
    removeParticipant: builder.mutation({
      query: ({ chatId, participantId }: { chatId: string; participantId: string }) => ({
        url: `/chat/${chatId}/remove-participant/${participantId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => ["Chat", { type: "Chat", id: arg.chatId }],
    }),
    leaveGroupChat: builder.mutation({
      query: (chatId: string) => ({
        url: `/chat/${chatId}/leave`,
        method: "POST",
      }),
      invalidatesTags: ["Chat"],
    }),
    deleteChat: builder.mutation({
      query: (chatId: string) => ({
        url: `/chat/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetMyChatsQuery,
  useGetChatByIdQuery,
  useCreateOneToOneChatMutation,
  useCreateGroupChatMutation,
  useUpdateGroupChatMutation,
  useAddParticipantsMutation,
  useRemoveParticipantMutation,
  useLeaveGroupChatMutation,
  useDeleteChatMutation,
} = chatApi;
