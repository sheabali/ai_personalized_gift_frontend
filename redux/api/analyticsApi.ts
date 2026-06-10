import { baseApi } from "./baseApi";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADMIN: Get platform stats and analytics
    getAdminStats: builder.query({
      query: () => ({
        url: "/analytics/admin-stats",
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
} = analyticsApi;
