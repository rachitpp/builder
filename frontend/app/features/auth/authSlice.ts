import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "@/app/lib/apiClient";
import type { RootState } from "@/app/lib/store";

// Define types
interface SocialConnection {
  provider: "google" | "linkedin";
  providerId: string;
  email: string;
  connected: boolean;
  connectedAt?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  socialConnections?: SocialConnection[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Add cookie helper functions at the top
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
  console.log(`Auth - Cookie set: ${name}`);
};

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const val = parts.pop()?.split(";").shift();
    console.log(`Auth - Cookie found: ${name}`);
    return val ? decodeURIComponent(val) : null;
  }
  console.log(`Auth - Cookie not found: ${name}`);
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
  console.log(`Auth - Cookie deleted: ${name}`);
};

// Define initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create async thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("Login attempt with:", credentials.email);
      const response = await authAPI.login(credentials);
      console.log("Login successful, response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const socialLogin = createAsyncThunk(
  "auth/socialLogin",
  async (
    {
      provider,
      code,
      redirectUri,
    }: { provider: string; code: string; redirectUri: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("AuthSlice - Starting social login process:", { provider });
      const response = await authAPI.socialLogin(provider, code, redirectUri);
      console.log("AuthSlice - Social login response:", {
        success: !!response.data,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user,
      });
      return response.data;
    } catch (error: any) {
      console.error("AuthSlice - Social login error:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(
        error.response?.data?.message || `${provider} login failed`
      );
    }
  }
);

export const linkSocialAccount = createAsyncThunk(
  "auth/linkSocialAccount",
  async (
    {
      provider,
      code,
      redirectUri,
    }: { provider: string; code: string; redirectUri: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.linkSocialAccount(
        provider,
        code,
        redirectUri
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to link ${provider} account`
      );
    }
  }
);

export const unlinkSocialAccount = createAsyncThunk(
  "auth/unlinkSocialAccount",
  async (provider: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.unlinkSocialAccount(provider);
      return { ...response.data, provider };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to unlink ${provider} account`
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("AuthSlice - Fetching current user...");
      const response = await authAPI.getCurrentUser();
      console.log("AuthSlice - Current user response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "AuthSlice - getCurrentUser error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof document !== "undefined") {
        deleteCookie("token");
        deleteCookie("refreshToken");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (typeof document !== "undefined") {
        setCookie("token", action.payload);
      }
    },
    checkAuthState: (state) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || getCookie("token")
          : null;
      state.token = token;
      state.isAuthenticated = !!token;
      if (!token) {
        state.user = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (typeof document !== "undefined") {
          setCookie("token", action.payload.token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // Ensure token is properly stored in both localStorage and cookie
        if (typeof window !== "undefined" && action.payload.token) {
          try {
            localStorage.setItem("token", action.payload.token);
            setCookie("token", action.payload.token);

            // Verify storage
            const cookieToken = getCookie("token");
            const lsToken = localStorage.getItem("token");
            console.log("AuthSlice - Login token storage check:", {
              cookieStored: !!cookieToken,
              localStorageStored: !!lsToken,
            });
          } catch (error) {
            console.error("AuthSlice - Token storage error:", error);
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Social login cases
      .addCase(socialLogin.pending, (state) => {
        console.log("AuthSlice - Social login pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        console.log("AuthSlice - Social login fulfilled:", {
          hasToken: !!action.payload.token,
          hasUser: !!action.payload.user,
        });
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        // Ensure token is properly stored
        if (typeof document !== "undefined" && action.payload.token) {
          try {
            // Set token in both cookie and localStorage for maximum compatibility
            setCookie("token", action.payload.token);
            localStorage.setItem("token", action.payload.token);

            // Verify storage
            const cookieToken = getCookie("token");
            const lsToken = localStorage.getItem("token");
            console.log("AuthSlice - Token storage check:", {
              cookieStored: !!cookieToken,
              localStorageStored: !!lsToken,
            });

            if (action.payload.refreshToken) {
              setCookie("refreshToken", action.payload.refreshToken);
            }
          } catch (error) {
            console.error("AuthSlice - Token storage error:", error);
          }
        }
      })
      .addCase(socialLogin.rejected, (state, action) => {
        console.log("AuthSlice - Social login rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string;
        // Clear any existing tokens on rejection
        if (typeof document !== "undefined") {
          deleteCookie("token");
          deleteCookie("refreshToken");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      })
      // Link social account cases
      .addCase(linkSocialAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(linkSocialAccount.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && action.payload.user) {
          state.user.socialConnections = action.payload.user.socialConnections;
        }
      })
      .addCase(linkSocialAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Unlink social account cases
      .addCase(unlinkSocialAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unlinkSocialAccount.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && state.user.socialConnections) {
          state.user.socialConnections = state.user.socialConnections.filter(
            (conn) => conn.provider !== action.payload.provider
          );
        }
      })
      .addCase(unlinkSocialAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        if (typeof document !== "undefined") {
          deleteCookie("token");
          deleteCookie("refreshToken");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        console.log("AuthSlice - getCurrentUser pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        console.log("AuthSlice - getCurrentUser fulfilled:", action.payload);
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;

        // Check both localStorage and cookies for token
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token") || getCookie("token");
          console.log(
            "AuthSlice - Token validation:",
            token ? "token exists" : "no token"
          );

          if (!token) {
            console.log(
              "AuthSlice - Token validation failed, clearing auth state"
            );
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            // Clean up storage
            deleteCookie("token");
            localStorage.removeItem("token");
          } else {
            // Ensure token is in both places
            setCookie("token", token);
            localStorage.setItem("token", token);
            state.token = token;
          }
        }
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        console.log("AuthSlice - getCurrentUser rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        if (typeof window !== "undefined") {
          deleteCookie("token");
          deleteCookie("refreshToken");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      });
  },
});

// Export actions and selectors
export const { resetAuthError, clearAuth, setToken, checkAuthState } =
  authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectSocialConnections = (state: RootState) =>
  state.auth.user?.socialConnections || [];

export default authSlice.reducer;
