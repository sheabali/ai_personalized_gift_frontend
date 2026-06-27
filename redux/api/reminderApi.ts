import { baseApi } from "./baseApi";

export const reminderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserReminders: builder.query({
      query: () => "/reminders",
      providesTags: ["Reminders"],
    }),
    createReminder: builder.mutation({
      query: (data) => ({
        url: "/reminders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reminders"],
    }),
    updateReminder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/reminders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reminders"],
    }),
    deleteReminder: builder.mutation({
      query: (id) => ({
        url: `/reminders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reminders"],
    }),
  }),
});

export const {
  useGetUserRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
} = reminderApi;
