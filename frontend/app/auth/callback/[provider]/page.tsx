"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/app/lib/store";
import { socialLogin } from "@/app/features/auth/authSlice";
import toast from "react-hot-toast";

// Define type for debug info
interface DebugInfo {
  codeExists?: boolean;
  error?: string;
  provider?: string;
  loginSuccess?: boolean;
  hasToken?: boolean;
  tokenStored?: {
    localStorage: boolean;
    cookie: boolean;
  };
  outerError?: string;
  timestamp?: string;
  callbackMounted?: boolean;
}

// Add cookie helpers
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
  console.log(`Callback - Cookie set: ${name}`);
};

export default function OAuthCallbackPage({
  params,
}: {
  params: { provider: string };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const provider = params.provider;
  const [shouldUseIframe, setShouldUseIframe] = useState(false);
  const [authComplete, setAuthComplete] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    callbackMounted: false,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    document.title = "Processing Authentication...";
    console.log("Callback page mounted at", new Date().toISOString());

    // Update debug info to confirm component mounted
    setDebugInfo((prev) => ({
      ...prev,
      callbackMounted: true,
      timestamp: new Date().toISOString(),
    }));

    // Log current URL and params
    console.log("Current URL:", window.location.href);
    console.log(
      "Search params:",
      Object.fromEntries(new URLSearchParams(window.location.search))
    );
  }, []);

  useEffect(() => {
    // Define an async function to handle the auth process
    async function handleAuth() {
      try {
        // Get code from URL
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        console.log("Callback - Starting auth process", {
          code: code ? "exists" : "not found",
          error: error || "none",
          provider,
          url: window.location.href,
        });

        setDebugInfo((prev: DebugInfo) => ({
          ...prev,
          codeExists: !!code,
          error: error || "none",
          provider,
          timestamp: new Date().toISOString(),
        }));

        if (error) {
          console.error("Callback - Auth error from provider:", error);
          toast.error(`Authentication failed: ${error}`);
          router.push("/login");
          return;
        }

        if (!code) {
          console.error("Callback - No auth code found");
          toast.error("No authentication code found");
          router.push("/login");
          return;
        }

        // Create redirect URI - use the one that works with Google Cloud Console
        const redirectUri = "http://localhost:5000/api/auth/google/callback";

        console.log(`Callback - Processing ${provider} authentication...`);

        try {
          // Clear any existing tokens
          try {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            console.log("Callback - Cleared existing tokens from localStorage");
          } catch (clearError) {
            console.error("Error clearing localStorage:", clearError);
          }

          // Clear cookies as well
          try {
            document.cookie = "token=; Max-Age=-99999999; path=/";
            document.cookie = "refreshToken=; Max-Age=-99999999; path=/";
            console.log("Callback - Cleared existing token cookies");
          } catch (clearError) {
            console.error("Error clearing cookies:", clearError);
          }

          // Dispatch the action to Redux
          console.log("Callback - Dispatching social login action", {
            provider,
            hasCode: !!code,
            redirectUri,
          });
          toast.loading("Finalizing authentication...");

          const result = await dispatch(
            socialLogin({
              provider,
              code,
              redirectUri,
            })
          ).unwrap();

          console.log("Callback - Social login successful:", {
            hasToken: !!result.token,
            hasRefreshToken: !!result.refreshToken,
            tokenPreview: result.token
              ? `${result.token.substring(0, 10)}...`
              : null,
            userData: result.user ? "exists" : "missing",
          });

          setDebugInfo((prev: DebugInfo) => ({
            ...prev,
            loginSuccess: true,
            hasToken: !!result.token,
            timestamp: new Date().toISOString(),
          }));

          // Store tokens in both localStorage and cookies
          if (result.token) {
            try {
              // Store in localStorage
              localStorage.setItem("token", result.token);
              console.log("Callback - Stored token in localStorage");
            } catch (storageError) {
              console.error("Error storing in localStorage:", storageError);
            }

            try {
              // Store in cookie
              setCookie("token", result.token);
            } catch (cookieError) {
              console.error("Error setting cookie:", cookieError);
            }

            if (result.refreshToken) {
              try {
                localStorage.setItem("refreshToken", result.refreshToken);
                setCookie("refreshToken", result.refreshToken);
                console.log("Callback - Stored refresh token");
              } catch (refreshError) {
                console.error("Error storing refresh token:", refreshError);
              }
            }

            // Verify storage
            let lsCheck, cookieCheck;
            try {
              lsCheck = localStorage.getItem("token");
            } catch (e) {
              lsCheck = null;
              console.error("Error checking localStorage:", e);
            }

            try {
              cookieCheck = document.cookie.includes("token=");
            } catch (e) {
              cookieCheck = false;
              console.error("Error checking cookie:", e);
            }

            console.log("Callback - Storage verification:", {
              localStorage: !!lsCheck,
              cookie: cookieCheck,
            });

            setDebugInfo((prev: DebugInfo) => ({
              ...prev,
              tokenStored: {
                localStorage: !!lsCheck,
                cookie: cookieCheck,
              },
              timestamp: new Date().toISOString(),
            }));

            // Success message
            toast.dismiss();
            toast.success(`Successfully logged in with ${provider}`);

            // Wait a moment to ensure token is stored
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Do one final check
            const finalCheck = {
              localStorage: !!localStorage.getItem("token"),
              cookie: document.cookie.includes("token="),
            };

            console.log(
              "Callback - Final token check before redirect:",
              finalCheck
            );

            console.log("Callback - Redirecting to dashboard");

            // Force a hard navigation to ensure complete page refresh
            window.location.href = "/dashboard";
          } else {
            throw new Error("No token received from server");
          }
        } catch (err: any) {
          console.error("Callback - Authentication error:", err);
          setDebugInfo((prev: DebugInfo) => ({
            ...prev,
            error: err.message || "Unknown error",
            timestamp: new Date().toISOString(),
          }));
          toast.dismiss();
          toast.error(err.message || "Authentication failed");
          router.push("/login");
        }
      } catch (outerErr: any) {
        console.error("Callback - Outer error:", outerErr);
        setDebugInfo((prev: DebugInfo) => ({
          ...prev,
          outerError: outerErr.message || "Unknown outer error",
          timestamp: new Date().toISOString(),
        }));
        toast.error("Authentication process failed");
        router.push("/login");
      }
    }

    // Execute the auth handler only if we have params
    if (searchParams.get("code") || searchParams.get("error")) {
      handleAuth();
    } else {
      console.log("Callback - No auth parameters found in URL");
      setDebugInfo((prev) => ({
        ...prev,
        error: "No auth parameters found in URL",
        timestamp: new Date().toISOString(),
      }));
    }
  }, [searchParams, dispatch, provider, router]);

  // Simple loading state with debug info
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold mb-2">Processing Authentication</h1>
        <p className="text-gray-600 mb-6">
          Please wait, redirecting to dashboard...
        </p>

        <div className="flex space-x-3 justify-center">
          <a
            href="/dashboard"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded shadow-md hover:bg-blue-700 transition-all"
          >
            Go to Dashboard
          </a>

          <a
            href="/login"
            className="inline-block px-6 py-2.5 bg-gray-200 text-gray-700 font-medium text-sm rounded shadow-md hover:bg-gray-300 transition-all"
          >
            Back to Login
          </a>
        </div>

        {Object.keys(debugInfo).length > 0 && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-left text-xs overflow-auto max-h-48">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
