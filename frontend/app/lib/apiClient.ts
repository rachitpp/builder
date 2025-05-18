import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for handling cookies
});

// Prevent multiple simultaneous refresh token requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify subscribers when token is refreshed
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Add a request interceptor to add authorization token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage in client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized errors (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for token refresh if already in progress
        try {
          const token = await new Promise<string>((resolve) => {
            subscribeTokenRefresh((token) => {
              resolve(token);
            });
          });

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Try to refresh token
      try {
        console.log("Attempting to refresh token");
        const response = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        console.log("Refresh token response:", response.data);
        const { token } = response.data;

        if (token) {
          localStorage.setItem("token", token);

          // Update header for current request
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Notify subscribers with new token
          onTokenRefreshed(token);

          isRefreshing = false;
          return apiClient(originalRequest);
        } else {
          throw new Error("No token received");
        }
      } catch (refreshError) {
        // Handle refresh token failure (logout)
        isRefreshing = false;
        refreshSubscribers = [];

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");

          // Notify user
          toast.error("Session expired. Please log in again.");

          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other common errors
    if (error.response?.status === 404) {
      toast.error("Resource not found");
    } else if (error.response?.status === 403) {
      toast.error("You do not have permission to access this resource");
    } else if (error.response?.status === 500) {
      toast.error("Server error occurred. Please try again later.");
    } else if (!error.response && error.request) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => apiClient.post("/auth/register", userData),

  login: (credentials: { email: string; password: string }) =>
    apiClient.post("/auth/login", credentials),

  logout: () => apiClient.get("/auth/logout"),

  getCurrentUser: () => apiClient.get("/auth/me"),

  verifyEmail: (token: string) => apiClient.get(`/auth/verify-email/${token}`),

  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.put(`/auth/reset-password/${token}`, { password }),

  updatePassword: (currentPassword: string, newPassword: string) =>
    apiClient.put("/auth/update-password", { currentPassword, newPassword }),
};

// User API
export const userAPI = {
  updateProfile: (userData: { firstName: string; lastName: string }) =>
    apiClient.put("/users/profile", userData),

  uploadProfilePicture: (formData: FormData) =>
    apiClient.post("/users/profile/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteProfilePicture: () => apiClient.delete("/users/profile/picture"),
};

// Resume API
export const resumeAPI = {
  createResume: (resumeData: any) => {
    // Log the data being sent to help debugging
    console.log("Creating resume with data:", resumeData);
    return apiClient.post("/resumes", resumeData).catch((error) => {
      console.error("Resume API error:", error.response?.data || error.message);
      throw error;
    });
  },

  getResumes: (page = 1, limit = 10) =>
    apiClient.get(`/resumes?page=${page}&limit=${limit}`),

  getResume: (id: string) => apiClient.get(`/resumes/${id}`),

  updateResume: (id: string, resumeData: any) =>
    apiClient.put(`/resumes/${id}`, resumeData),

  deleteResume: (id: string) => apiClient.delete(`/resumes/${id}`),

  toggleVisibility: (id: string, isPublic: boolean) =>
    apiClient.put(`/resumes/${id}/visibility`, { isPublic }),

  getPublicResume: (id: string) => apiClient.get(`/resumes/public/${id}`),

  cloneResume: (id: string) => apiClient.post(`/resumes/${id}/clone`),

  downloadPdf: (id: string) =>
    apiClient.get(`/resumes/${id}/pdf`, {
      responseType: "blob",
      headers: { Accept: "text/html" },
    }),
};

// Template API
export const templateAPI = {
  getTemplates: (
    category?: string,
    isPremium?: boolean,
    page = 1,
    limit = 10
  ) => {
    let url = `/templates?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (isPremium !== undefined) url += `&isPremium=${isPremium}`;
    return apiClient.get(url);
  },

  getTemplate: (id: string) => apiClient.get(`/templates/${id}`),

  getTemplateCategories: () => apiClient.get("/templates/categories"),
};

export default apiClient;
