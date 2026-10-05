import axios from "axios";

const api = axios.create({
  // The backend mounts tasks at /tasks and auth at /api/auth.
  // Keep the base at the server root so each request can target its route.
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, ""),
});

export const getApiErrorMessage = (error, fallback) => {
  if (!error.response) {
    return `Cannot reach the backend at ${api.defaults.baseURL}. Check that it is running and that VITE_API_URL is correct.`;
  }
  if (error.response.status === 401) {
    return "Your login session is missing or expired. Log out, then log in again.";
  }
  return error.response.data?.error || error.response.data?.message || error.response.data?.msg || fallback;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

