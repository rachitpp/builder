"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import {
  registerUser,
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

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  termsAccepted: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

const SocialLoginButton: React.FC<{
  provider: string;
  label: string;
  icon: React.ReactNode;
}> = ({ provider, label, icon }) => {
  const handleSocialLogin = async () => {
    try {
      // Use the redirect URI that matches Google Cloud Console configuration
      const redirectUri = "http://localhost:5000/api/auth/google/callback";

      // Get authorization URL from the backend
      const response = await authAPI.socialAuthUrl(provider, redirectUri);

      // Redirect to the authorization URL
      if (response.data.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error(`Failed to initialize ${label} login`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSocialLogin}
      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      {icon}
      {label}
    </button>
  );
};

export default function Register() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Clear any previous auth errors
    dispatch(resetAuthError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Check if there's a callback code and error in the URL
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const provider = searchParams.get("provider");

    if (error) {
      toast.error(`Authentication failed: ${error}`);
      router.replace("/register");
      return;
    }

    if (code && provider) {
      // Use the correct redirect URI that works with Google Cloud Console
      const redirectUri = "http://localhost:5000/api/auth/google/callback";

      // Show loading toast
      toast.loading("Processing authentication...");

      // Dispatch social login action (also works for registration)
      dispatch(
        socialLogin({
          provider,
          code,
          redirectUri,
        })
      )
        .unwrap()
        .then((response) => {
          // Store tokens
          if (response.token) {
            localStorage.setItem("token", response.token);
          }
          if (response.refreshToken) {
            localStorage.setItem("refreshToken", response.refreshToken);
          }

          // Dismiss loading toast and show success
          toast.dismiss();
          toast.success(`Registered with ${provider} successfully!`);

          // Force immediate redirection to dashboard
          window.location.replace("/dashboard");
        })
        .catch((error) => {
          toast.dismiss();
          toast.error(error || `${provider} registration failed`);
        });
    }
  }, [searchParams, dispatch, router]);

  const handleSubmit = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
  }) => {
    const { confirmPassword, termsAccepted, ...userData } = values;
    await dispatch(registerUser(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
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
          </div>
        )}

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            termsAccepted: false,
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        touched.firstName && errors.firstName
                          ? "border-red-300 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500"
                      } text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                      placeholder="First Name"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="p"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        touched.lastName && errors.lastName
                          ? "border-red-300 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500"
                      } text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                      placeholder="Last Name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="p"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        touched.email && errors.email
                          ? "border-red-300 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500"
                      } text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                      placeholder="Email address"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        touched.password && errors.password
                          ? "border-red-300 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500"
                      } text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute top-9 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
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
                          className="h-5 w-5 text-gray-400"
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
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm Password
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        touched.confirmPassword && errors.confirmPassword
                          ? "border-red-300 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500"
                      } text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                      placeholder="Confirm Password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Field
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  className={`h-4 w-4 ${
                    touched.termsAccepted && errors.termsAccepted
                      ? "text-red-600 focus:ring-red-500 border-red-300"
                      : "text-primary-600 focus:ring-primary-500 border-gray-300"
                  } rounded`}
                />
                <label
                  htmlFor="termsAccepted"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              <ErrorMessage
                name="termsAccepted"
                component="p"
                className="mt-1 text-sm text-red-600"
              />

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  ) : null}
                  Create Account
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Or register with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <SocialLoginButton
              provider="google"
              label="Google"
              icon={
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
              }
            />
            <SocialLoginButton
              provider="linkedin"
              label="LinkedIn"
              icon={
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
