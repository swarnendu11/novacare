import { baseApi } from "../../services/api/baseApi";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/analytics/dashboard",
      providesTags: ["Activity", "Appointment"],
      // Transform response if needed
      transformResponse: (response) => response.data,
      // Polling for real-time updates (Optional)
      keepUnusedDataFor: 60,
    }),
    getRevenueReport: builder.query({
      query: (period = "weekly") => `/analytics/revenue?period=${period}`,
      providesTags: ["Billing"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetRevenueReportQuery } =
  analyticsApi;
