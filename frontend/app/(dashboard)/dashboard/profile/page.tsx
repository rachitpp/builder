"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/store";
import {
  selectUser,
  selectAuthLoading,
  selectAuthError,
  linkSocialAccount,
  unlinkSocialAccount,
  selectSocialConnections,
} from "@/app/features/auth/authSlice";
import { userAPI, authAPI } from "@/app/lib/apiClient";
import { addNotification } from "@/app/features/ui/uiSlice";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { AvatarUpload } from "@/app/components/profile/AvatarUpload";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

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
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
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
  const socialConnections = useAppSelector(selectSocialConnections);

  useEffect(() => {
    if (user?.profilePicture) {
      setPreviewUrl(user.profilePicture);
    } else {
      setPreviewUrl(null);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const provider = url.searchParams.get("provider");
      const action = url.searchParams.get("action");

      if (code && provider && action === "link") {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        const redirectUri = `${window.location.origin}/auth/callback/${provider}?action=link`;

        dispatch(linkSocialAccount({ provider, code, redirectUri }))
          .unwrap()
          .then(() => {
            dispatch(
              addNotification({
                message: `${provider} account connected successfully`,
                type: "success",
              })
            );
          })
          .catch((error) => {
            dispatch(
              addNotification({
                message: `Failed to connect ${provider} account: ${error}`,
                type: "error",
              })
            );
          });
      }
    }
  }, [dispatch]);

  const handleFileSelect = (file: File) => {
    setUploadError("");
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
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
    } catch (error: any) {
      dispatch(
        addNotification({
          message: "Failed to delete profile picture",
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

  const handleSocialAuth = async (provider: string) => {
    try {
      const redirectUri = `${window.location.origin}/auth/callback/${provider}?action=link`;
      const { data } = await authAPI.socialAuthUrl(provider, redirectUri);
      const authUrl = data.authorizationUrl;
      window.location.href = authUrl;
    } catch (error: any) {
      dispatch(
        addNotification({
          message: `Failed to initiate ${provider} connection: ${error}`,
          type: "error",
        })
      );
    }
  };

  const handleUnlinkSocial = async (provider: string) => {
    try {
      await dispatch(unlinkSocialAccount(provider)).unwrap();
      dispatch(
        addNotification({
          message: `${provider} account unlinked successfully`,
          type: "success",
        })
      );
    } catch (error: any) {
      dispatch(
        addNotification({
          message: `Failed to unlink ${provider} account: ${error}`,
          type: "error",
        })
      );
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-8"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark text-center mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg backdrop-filter bg-white/80 dark:bg-gray-800/80">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Profile Picture</h2>
            </CardHeader>
            <CardContent>
              <AvatarUpload
                previewUrl={previewUrl}
                onFileSelect={handleFileSelect}
                isUploading={isSubmitting}
                error={uploadError}
                onDelete={handleDeletePicture}
              />
              {selectedFile && (
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={handleFileUpload}
                    disabled={isSubmitting}
                    className="w-full max-w-xs"
                  >
                    {isSubmitting ? "Uploading..." : "Upload Picture"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg backdrop-filter bg-white/80 dark:bg-gray-800/80">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Personal Information</h2>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleUpdateProfile}
              >
                {({ errors, touched, handleChange, handleBlur, values }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.firstName && touched.firstName
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.firstName && touched.firstName && (
                          <p className="text-sm text-red-500">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.lastName && touched.lastName
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.lastName && touched.lastName && (
                          <p className="text-sm text-red-500">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div className="flex items-center gap-2">
                        <Input value={user.email} disabled />
                        <Badge
                          variant={
                            user.isEmailVerified ? "success" : "destructive"
                          }
                        >
                          {user.isEmailVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg backdrop-filter bg-white/80 dark:bg-gray-800/80">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Connected Accounts</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["google", "linkedin"].map((provider) => {
                  const connection = socialConnections.find(
                    (conn) => conn.provider === provider
                  );
                  return (
                    <div
                      key={provider}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8">
                          <img
                            src={`/images/${provider}-icon.svg`}
                            alt={`${provider} icon`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium capitalize">{provider}</h3>
                          {connection && (
                            <p className="text-sm text-gray-500">
                              Connected as {connection.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant={connection ? "destructive" : "default"}
                        onClick={() =>
                          connection
                            ? handleUnlinkSocial(provider)
                            : handleSocialAuth(provider)
                        }
                        disabled={isSubmitting}
                      >
                        {connection ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
