import { baseApi } from "./baseApi";

export const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferralStats: builder.query({
      query: () => "/referrals/stats",
      providesTags: ["Referrals"],
    }),
    trackShare: builder.mutation({
      query: (data) => ({
        url: "/referrals/track-share",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Referrals"],
    }),
  }),
});

export const { useGetReferralStatsQuery, useTrackShareMutation } = referralApi;
