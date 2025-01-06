import axios from "axios";
import keycloak from "./keycloak";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Check if token exists and is valid
    if (keycloak.token) {
      // Check if token needs to be refreshed (within 10 seconds of expiry)
      if (keycloak.isTokenExpired(10)) {
        try {
          await keycloak.updateToken(10);
        } catch (error) {
          console.error("Failed to refresh token:", error);
          // Redirect to login if refresh fails
          await keycloak.login();
          return Promise.reject(error);
        }
      }
      // Add token to headers
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await keycloak.updateToken(10);
        // Update the token in the request
        originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
        // Retry the request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error("Token refresh failed:", refreshError);
        await keycloak.login();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
