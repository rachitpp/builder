"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/store";
import {
  selectUser,
  selectAuthLoading,
  selectAuthError,
} from "@/app/features/auth/authSlice";
import { userAPI } from "@/app/lib/apiClient";
import { addNotification } from "@/app/features/ui/uiSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Reset preview when component mounts or when user changes
    if (user?.profilePicture) {
      setPreviewUrl(user.profilePicture);
    } else {
      setPreviewUrl(null);
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");

    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    // Check file type
    if (!file.type.match("image.*")) {
      setUploadError("Please select an image file");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File size must be less than 2MB");
      return;
    }

    setSelectedFile(file);

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Clean up the URL when component unmounts or when file changes
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      await userAPI.uploadProfilePicture(formData);

      dispatch(
        addNotification({
          message: "Profile picture updated successfully",
          type: "success",
        })
      );

      // Refresh user data would happen here
      // dispatch(getCurrentUser());
    } catch (error: any) {
      setUploadError(
        error.response?.data?.message || "Failed to upload profile picture"
      );

      dispatch(
        addNotification({
          message: "Failed to upload profile picture",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null);
    }
  };

  const handleDeletePicture = async () => {
    try {
      setIsSubmitting(true);

      await userAPI.deleteProfilePicture();

      setPreviewUrl(null);

      dispatch(
        addNotification({
          message: "Profile picture deleted successfully",
          type: "success",
        })
      );

      // Refresh user data would happen here
      // dispatch(getCurrentUser());
    } catch (error: any) {
      dispatch(
        addNotification({
          message:
            error.response?.data?.message || "Failed to delete profile picture",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async (values: {
    firstName: string;
    lastName: string;
  }) => {
    try {
      setIsSubmitting(true);

      await userAPI.updateProfile(values);

      dispatch(
        addNotification({
          message: "Profile updated successfully",
          type: "success",
        })
      );

      // Refresh user data would happen here
      // dispatch(getCurrentUser());
    } catch (error: any) {
      dispatch(
        addNotification({
          message: error.response?.data?.message || "Failed to update profile",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div
        className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden"
        variants={itemVariants}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-bl-[100px] transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-tr-[100px] transform -translate-x-20 translate-y-20"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Profile Settings</h2>
          <p className="text-primary-100 max-w-2xl">
            Manage your account information, profile picture, and preferences.
          </p>
        </div>
      </motion.div>

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Decorative accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 opacity-20 rounded-bl-[100px] transform translate-x-16 -translate-y-16"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Profile Picture
            </h3>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0">
                <motion.div
                  className="relative h-32 w-32 rounded-full overflow-hidden bg-gradient-to-tr from-gray-100 to-gray-200 border-2 border-gray-200 shadow-md group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="flex-grow space-y-4">
                <div>
                  <label
                    htmlFor="profilePicture"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload New Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-grow">
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-medium
                          file:bg-primary-50 file:text-primary-700
                          hover:file:bg-primary-100
                          transition-colors"
                      />
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleFileUpload}
                      disabled={!selectedFile || isSubmitting}
                      className={`px-4 py-2 rounded-lg text-sm font-medium 
                        ${
                          selectedFile
                            ? "bg-primary-600 text-white hover:bg-primary-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        } 
                        transition-colors duration-200 flex items-center`}
                      whileHover={selectedFile ? { scale: 1.03 } : {}}
                      whileTap={selectedFile ? { scale: 0.97 } : {}}
                    >
                      {isSubmitting ? (
                        <>
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
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Upload
                        </>
                      )}
                    </motion.button>
                  </div>
                  {uploadError && (
                    <p className="mt-1 text-sm text-red-600">{uploadError}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>

                {previewUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2"
                  >
                    <motion.button
                      type="button"
                      onClick={handleDeletePicture}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Remove Photo
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Information Form */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Decorative accents */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary-50 opacity-20 rounded-tl-[100px] transform translate-x-16 translate-y-16"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Personal Information
            </h3>

            <Formik
              initialValues={{
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
              }}
              validationSchema={ProfileSchema}
              onSubmit={handleUpdateProfile}
              enableReinitialize
            >
              {({ isSubmitting: formSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <div className="relative group">
                        <Field
                          id="firstName"
                          name="firstName"
                          type="text"
                          className={`block w-full px-4 py-2 border ${
                            errors.firstName && touched.firstName
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                          } rounded-lg shadow-sm transition-colors group-hover:border-primary-400`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          {errors.firstName && touched.firstName ? (
                            <svg
                              className="h-5 w-5 text-red-500"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            touched.firstName && (
                              <svg
                                className="h-5 w-5 text-green-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )
                          )}
                        </div>
                      </div>
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
                      <div className="relative group">
                        <Field
                          id="lastName"
                          name="lastName"
                          type="text"
                          className={`block w-full px-4 py-2 border ${
                            errors.lastName && touched.lastName
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                          } rounded-lg shadow-sm transition-colors group-hover:border-primary-400`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          {errors.lastName && touched.lastName ? (
                            <svg
                              className="h-5 w-5 text-red-500"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            touched.lastName && (
                              <svg
                                className="h-5 w-5 text-green-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )
                          )}
                        </div>
                      </div>
                      <ErrorMessage
                        name="lastName"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Your email address cannot be changed
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || formSubmitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-md transition-all duration-200 flex items-center"
                      whileHover={{
                        scale: 1.03,
                        boxShadow:
                          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isSubmitting || formSubmitting ? (
                        <>
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
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          variants={itemVariants}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Account Settings
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Change Password
              </h4>
              <motion.button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Change Password
              </motion.button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Danger Zone</h4>
              <motion.button
                type="button"
                className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete Account
              </motion.button>
              <p className="mt-1 text-xs text-gray-500">
                This action cannot be undone. All of your data will be
                permanently removed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
