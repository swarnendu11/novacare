import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Standardized Error Handling & Refresh Token logic
apiClient.interceptors.response.use(
  (response) => {
    // Normalize response according to your preference
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Global error message to console or monitoring
    console.error(
      `API Error [${error.response?.status}]:`,
      error.response?.data || error.message,
    );

    // 401: Refresh Token or Logout logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Implement refresh logic here
        // const newToken = await refreshToken();
        // localStorage.setItem('auth_token', newToken);
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        // window.location.href = '/login';
      }
    }

    // Standardized error object
    const normalizedError = {
      message:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
      status: error.response?.status,
      errors: error.response?.data?.errors || null,
    };

    return Promise.reject(normalizedError);
  },
);

export default apiClient;
