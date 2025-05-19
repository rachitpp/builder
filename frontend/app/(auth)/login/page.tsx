"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import {
  loginUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  resetAuthError,
  socialLogin,
} from "@/app/features/auth/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authAPI } from "@/app/lib/apiClient";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SocialLoginButton: React.FC<{
  provider: string;
  label: string;
  icon: React.ReactNode;
}> = ({ provider, label, icon }) => {
  const handleSocialLogin = async () => {
    try {
      console.log("Login - Starting social login process...", { provider });

      // For Google, use a simpler direct approach with the callback page
      if (provider === "google") {
        // Show loading state
        toast.loading(`Connecting to ${label}...`);

        // Clear any existing tokens before starting new auth flow
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        document.cookie = "token=; Max-Age=-99999999; path=/";
        document.cookie = "refreshToken=; Max-Age=-99999999; path=/";

        // Google OAuth2 parameters
        const clientId =
          "427174570160-b1n0n48ms3uf2nbqiue3fja4k8chlq5k.apps.googleusercontent.com"; // From your Google console
        const redirectUri = "http://localhost:3000/auth/callback/google"; // Your Next.js callback route
        const scope = "email profile";
        const responseType = "code";

        // Build the authorization URL
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&scope=${encodeURIComponent(
          scope
        )}&response_type=${responseType}&prompt=select_account`;

        console.log("Login - Redirecting to Google auth:", authUrl);

        // Redirect to Google's authorization endpoint
        window.location.href = authUrl;
        return;
      }

      // Original flow for other providers
      const redirectUri = "http://localhost:5000/api/auth/google/callback";
      console.log("Login - Using redirect URI:", redirectUri);

      // Show loading state
      toast.loading(`Connecting to ${label}...`);

      const response = await authAPI.socialAuthUrl(provider, redirectUri);
      console.log("Login - Auth URL response:", {
        success: !!response.data,
        hasAuthUrl: !!response.data.authorizationUrl,
      });

      if (response.data.authorizationUrl) {
        console.log("Login - Redirecting to:", response.data.authorizationUrl);
        // Clear any existing tokens before starting new auth flow
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        // Redirect to provider's auth page
        window.location.href = response.data.authorizationUrl;
      } else {
        console.error(
          "Login - No authorization URL in response:",
          response.data
        );
        toast.dismiss();
        toast.error(`Failed to get authorization URL for ${label} login`);
      }
    } catch (error: any) {
      console.error(`Login - ${provider} login error:`, {
        error,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status,
      });
      toast.dismiss();
      toast.error(
        error.response?.data?.message ||
          `Failed to initialize ${label} login: ${error.message}`
      );
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleSocialLogin}
      className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50/80 transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 gap-2"
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    dispatch(resetAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const provider = searchParams.get("provider");

    if (error) {
      toast.error(`Authentication failed: ${error}`);
      router.replace("/login");
      return;
    }

    if (code && provider) {
      const redirectUri = "http://localhost:5000/api/auth/google/callback";

      toast.loading("Processing authentication...");

      dispatch(
        socialLogin({
          provider,
          code,
          redirectUri,
        })
      )
        .unwrap()
        .then((response) => {
          if (response.token) {
            localStorage.setItem("token", response.token);
          }
          if (response.refreshToken) {
            localStorage.setItem("refreshToken", response.refreshToken);
          }

          toast.dismiss();
          toast.success(`Logged in with ${provider} successfully!`);

          // Force a hard navigation to ensure page reload and state reset
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          toast.dismiss();
          toast.error(error || `${provider} login failed`);
        });
    }
  }, [searchParams, dispatch, router]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    await dispatch(loginUser(values));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-50 rounded-full opacity-70 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-dot-pattern bg-[length:16px_16px] opacity-[0.03]"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-50 rounded-full opacity-70 blur-3xl"></div>
      </div>

      <motion.div
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-elevation-2 relative z-10 border border-gray-100/90"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-300"
            >
              Sign up for free
            </Link>
          </p>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg"
            variants={itemVariants}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="mt-8 space-y-6">
              <motion.div className="space-y-4" variants={itemVariants}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`form-input pl-10 ${
                        touched.email && errors.email
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                      }`}
                      placeholder="Your email address"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1.5 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={`form-input pl-10 ${
                        touched.password && errors.password
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                      }`}
                      placeholder="Your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1.5 text-sm text-red-600"
                  />
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm transition-all duration-300"
                  disabled={loading}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-primary-500 group-hover:text-primary-400 transition-colors"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  {loading ? "Signing in..." : "Sign in"}
                </motion.button>
              </motion.div>
            </Form>
          )}
        </Formik>

        <motion.div variants={itemVariants}>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <SocialLoginButton
              provider="google"
              label="Google"
              icon={
                <svg
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              }
            />
            <SocialLoginButton
              provider="linkedin"
              label="LinkedIn"
              icon={
                <svg
                  className="h-5 w-5 text-blue-700"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              }
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
