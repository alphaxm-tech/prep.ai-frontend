// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
//   withCredentials: true, // if using cookies
// });

// // Request interceptor for auth token
// api.interceptors.request.use((config) => {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response interceptor (optional, e.g., refresh token)
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // Example: refresh token flow
//     if (error.response?.status === 401) {
//       // Handle unauthorized
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://prep-ai-backend-zcbs.onrender.com",
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

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Only attempt refresh once per request
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // If refresh already in progress, queue request
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           refreshQueue.push({ resolve, reject });
//         }).then(() => api(originalRequest));
//       }

//       isRefreshing = true;

//       try {
//         // 🔁 Call refresh endpoint
//         await api.post("/auth/refresh");

//         processQueue(null);
//         return api(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError);

//         // Refresh failed → force logout
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❗ If refresh endpoint itself fails → logout
    if (originalRequest?.url?.includes("/auth/refresh")) {
      window.location.href = "/login";
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
        await api.post("/auth/refresh"); // cookie-based
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
