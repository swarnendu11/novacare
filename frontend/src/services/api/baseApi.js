import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Common base query for standardized API interaction
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  prepareHeaders: (headers, { getState }) => {
    // Inject auth token if available (using a global selector)
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom error handling middleware for unified error responses
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Custom global error toast or standard handling could go here
  if (result.error) {
    const errorBody = result.error.data || {};
    console.error("API Error:", result.error);

    // Example global behavior: Redirect to login if unauthorized
    if (result.error.status === 401) {
      // api.dispatch(logout()); // if auth slice exists
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,

  // Global tag types for automatic invalidation across role-specific modules
  tagTypes: ["User", "Patient", "Appointment", "Billing", "Report", "Activity"],

  // Endpoints will be injected as needed (Feature-based logic)
  endpoints: () => ({}),
});
