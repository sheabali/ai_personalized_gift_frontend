import { baseApi } from "./baseApi";

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalysis: builder.query({
      query: (analysisId: string) => ({
        url: `/resume/analyze/${analysisId}`,
        method: "GET",
      }),
      providesTags: ["Resume" as any],
    }),
    uploadResume: builder.mutation({
      query: (data: FormData) => ({
        url: "/resume/upload",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Dashboard" as any],
    }),
    analyzeResume: builder.mutation({
      query: ({ analysisId, jobDescription }: { analysisId: string; jobDescription?: string }) => ({
        url: "/resume/analyze",
        method: "POST",
        body: { analysisId, jobDescription },
      }),
      invalidatesTags: ["Resume" as any],
    }),
    generateCoverLetter: builder.mutation({
      query: (data: { analysisId: string; tone: string; length: string }) => ({
        url: "/cover-letter/generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Dashboard" as any],
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["Dashboard" as any],
    }),
    getAnalysisHistory: builder.query({
      query: ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => ({
        url: `/analyses/history?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Resume" as any],
    }),
    createCheckoutSession: builder.mutation({
      query: (data: { planType: "PRO" | "PAY_PER_REPORT" }) => ({
        url: "/payment/checkout",
        method: "POST",
        body: data,
      }),
    }),
    getAdminAnalytics: builder.query({
      query: () => ({
        url: "/analytics/dashboard",
        method: "GET",
      }),
    }),
    getMyAnalytics: builder.query({
      query: () => ({
        url: "/analytics/me",
        method: "GET",
      }),
      providesTags: ["Dashboard" as any],
    }),
    getUserAnalyticsById: builder.query({
      query: (userId: string) => ({
        url: `/analytics/user/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAnalysisQuery,
  useUploadResumeMutation,
  useAnalyzeResumeMutation,
  useGenerateCoverLetterMutation,
  useGetDashboardStatsQuery,
  useGetAnalysisHistoryQuery,
  useCreateCheckoutSessionMutation,
  useGetAdminAnalyticsQuery,
  useGetMyAnalyticsQuery,
  useGetUserAnalyticsByIdQuery,
} = resumeApi;
