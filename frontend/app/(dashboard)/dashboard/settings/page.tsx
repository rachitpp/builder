"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/app/lib/store";
import { selectUser } from "@/app/features/auth/authSlice";
import { addNotification } from "@/app/features/ui/uiSlice";
import { useAppDispatch } from "@/app/lib/store";

export default function SettingsPage() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<string>("account");
  const [emailNotifications, setEmailNotifications] = useState({
    resumeUpdates: true,
    newFeatures: true,
    jobAlerts: true,
    securityAlerts: true,
    weeklyDigest: false,
  });
  const [appearance, setAppearance] = useState<string>("system");
  const [language, setLanguage] = useState<string>("english");
  const [dataSharing, setDataSharing] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSaveSettings = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      dispatch(
        addNotification({
          message: "Settings saved successfully",
          type: "success",
        })
      );
    }, 1000);
  };

  const handleResetSettings = () => {
    // Simulate reset
    setEmailNotifications({
      resumeUpdates: true,
      newFeatures: true,
      jobAlerts: true,
      securityAlerts: true,
      weeklyDigest: false,
    });
    setAppearance("system");
    setLanguage("english");
    setDataSharing(true);

    dispatch(
      addNotification({
        message: "Settings reset to default",
        type: "info",
      })
    );
  };

  const toggleNotification = (key: string) => {
    setEmailNotifications({
      ...emailNotifications,
      [key]: !emailNotifications[key as keyof typeof emailNotifications],
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-sm relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-[100px] transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-tr-[100px] transform -translate-x-16 translate-y-16"></div>

        <div className="relative z-10 py-3 px-4">
          <h2 className="text-xl font-bold text-white mb-1">Settings</h2>
          <p className="text-primary-100 text-xs max-w-2xl">
            Customize your experience and manage your account preferences
          </p>
        </div>
      </motion.div>

      {/* Settings Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 lg:h-fit"
        >
          <div className="space-y-1">
            <button
              onClick={() => handleTabChange("account")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === "account"
                  ? "bg-primary-50 text-primary-700"
                  : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Account</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange("notifications")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === "notifications"
                  ? "bg-primary-50 text-primary-700"
                  : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="text-sm">Notifications</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange("appearance")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === "appearance"
                  ? "bg-primary-50 text-primary-700"
                  : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Appearance</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange("privacy")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === "privacy"
                  ? "bg-primary-50 text-primary-700"
                  : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Privacy & Security</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-3 bg-white rounded-lg shadow-sm p-3 border border-gray-100"
        >
          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 pb-2 border-b">
                Account Settings
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-800 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 bg-gray-50 text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-600">
                    Email addresses cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs font-medium text-gray-800 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="username"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-medium text-gray-800 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={user?.firstName || ""}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-medium text-gray-800 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={user?.lastName || ""}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-2">
                  Subscription Plan
                </h4>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Free Plan
                      </p>
                      <p className="text-xs text-gray-700">
                        Basic resume building features
                      </p>
                    </div>
                    <button className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors duration-200">
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-2">
                  Account Danger Zone
                </h4>
                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                  <p className="text-xs text-red-700 mb-3">
                    Deleting your account is permanent and cannot be undone. All
                    your data will be erased.
                  </p>
                  <button className="px-3 py-1.5 bg-white text-red-600 text-xs border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 pb-2 border-b">
                Notification Settings
              </h3>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-800">
                  Email Notifications
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Resume Updates</p>
                      <p className="text-xs text-gray-700">
                        Receive notifications when your resume is updated
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification("resumeUpdates")}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        emailNotifications.resumeUpdates
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span className="sr-only">Toggle</span>
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          emailNotifications.resumeUpdates
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">New Features</p>
                      <p className="text-xs text-gray-700">
                        Stay updated with new features and improvements
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification("newFeatures")}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        emailNotifications.newFeatures
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span className="sr-only">Toggle</span>
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          emailNotifications.newFeatures
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Job Alerts</p>
                      <p className="text-xs text-gray-700">
                        Get notified about new job opportunities
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification("jobAlerts")}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        emailNotifications.jobAlerts
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span className="sr-only">Toggle</span>
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          emailNotifications.jobAlerts
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Security Alerts</p>
                      <p className="text-xs text-gray-700">
                        Important security notifications
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification("securityAlerts")}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        emailNotifications.securityAlerts
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span className="sr-only">Toggle</span>
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          emailNotifications.securityAlerts
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Weekly Digest</p>
                      <p className="text-xs text-gray-700">
                        Weekly summary of your activity
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification("weeklyDigest")}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        emailNotifications.weeklyDigest
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span className="sr-only">Toggle</span>
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          emailNotifications.weeklyDigest
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 pb-2 border-b">
                Appearance Settings
              </h3>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="theme"
                    className="block text-xs font-medium text-gray-800 mb-1"
                  >
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="system">System Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-600">
                    Choose how the application appears to you
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="language"
                    className="block text-xs font-medium text-gray-800 mb-1"
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="chinese">Chinese</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-600">
                    Choose your preferred language
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 pb-2 border-b">
                Privacy & Security
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Allow Data Collection
                    </p>
                    <p className="text-xs text-gray-700">
                      Help us improve by allowing anonymous usage data
                    </p>
                  </div>
                  <button
                    onClick={() => setDataSharing(!dataSharing)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      dataSharing ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span className="sr-only">Toggle</span>
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        dataSharing ? "translate-x-4" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>

                <div className="pt-3">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    Two-Factor Authentication
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-700 mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <button className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors duration-200">
                      Set Up 2FA
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    Password
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-700 mb-3">
                      It's a good idea to change your password periodically
                    </p>
                    <button className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors duration-200">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 mt-4 border-t flex justify-end space-x-3">
            <button
              onClick={handleResetSettings}
              className="px-3 py-1.5 border border-gray-300 text-gray-800 text-xs rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isSubmitting}
              className={`px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors duration-200 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
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
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
