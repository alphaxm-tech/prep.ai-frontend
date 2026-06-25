import axios from "axios";
import { AUTH, LOGIN, LOGIN_WITH_PASSWORD, REFRESH } from "./endpoints";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://api.aiprepbuddy.com/api/v1",
  // "http://localhost:8080/api/v1",

  withCredentials: true, // REQUIRED for cookies
});

/**
 * We DO NOT add Authorization headers manually.
 * Access token is sent automatically via HttpOnly cookie.
 */

/* ---------------------------------------
  Refresh token handling
--------------------------------------- */

let isRefreshing = false;
let refreshQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any) => {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(true);
  });
  refreshQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If refresh endpoint itself fails → logout
    if (originalRequest?.url?.includes(`/${AUTH}/${REFRESH}`)) {
      window.location.href = `/${LOGIN}`;
      return Promise.reject(error);
    }

    // Login endpoint 401 means wrong credentials — don't try to refresh
    if (originalRequest?.url?.includes(`/${AUTH}/${LOGIN_WITH_PASSWORD}`)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        await api.post(`/${AUTH}/${REFRESH}`); // cookie-based
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
