"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/app/lib/store";
import { selectUser } from "@/app/features/auth/authSlice";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Separator } from "@/app/components/ui/separator";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function SettingsPage() {
  const user = useAppSelector(selectUser);
  const [activeTab, setActiveTab] = useState("profile");

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    marketingEmails: false,
    darkMode: false,
    autoSave: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic
    console.log("Profile update:", formData);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic
    console.log("Password change:", {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      console.log("Account deletion requested");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>

          <div className="relative z-10 p-8 sm:p-10 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Settings</h1>
            <p className="text-indigo-100 max-w-lg text-lg mb-2">
              Customize your experience and manage your account preferences.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Settings Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b border-gray-100">
            <TabsList className="flex w-full rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="profile"
                className="flex-1 py-4 text-sm font-medium rounded-none data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex-1 py-4 text-sm font-medium rounded-none data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
              >
                Preferences
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex-1 py-4 text-sm font-medium rounded-none data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="danger"
                className="flex-1 py-4 text-sm font-medium rounded-none data-[state=active]:bg-transparent data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600"
              >
                Danger Zone
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="p-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <motion.div variants={item} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Personal Information
                </h3>
                <p className="text-gray-500 text-sm">
                  Update your personal details
                </p>
              </motion.div>

              <form onSubmit={handleUpdateProfile}>
                <motion.div
                  variants={item}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="rounded-xl"
                      placeholder="Your first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="rounded-xl"
                      placeholder="Your last name"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="rounded-xl"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </motion.div>

                <motion.div variants={item}>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                  >
                    Save Changes
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="p-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <motion.div variants={item} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Application Preferences
                </h3>
                <p className="text-gray-500 text-sm">
                  Customize your app experience
                </p>
              </motion.div>

              <motion.div variants={item} className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      Dark Mode
                    </h4>
                    <p className="text-sm text-gray-500">
                      Enable dark theme for the application
                    </p>
                  </div>
                  <Switch
                    checked={formData.darkMode}
                    onCheckedChange={(checked) =>
                      handleToggleChange("darkMode", checked)
                    }
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      Auto-Save
                    </h4>
                    <p className="text-sm text-gray-500">
                      Automatically save your changes
                    </p>
                  </div>
                  <Switch
                    checked={formData.autoSave}
                    onCheckedChange={(checked) =>
                      handleToggleChange("autoSave", checked)
                    }
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      Email Notifications
                    </h4>
                    <p className="text-sm text-gray-500">
                      Receive email notifications about your account activity
                    </p>
                  </div>
                  <Switch
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleToggleChange("emailNotifications", checked)
                    }
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      Marketing Emails
                    </h4>
                    <p className="text-sm text-gray-500">
                      Receive marketing and promotional emails
                    </p>
                  </div>
                  <Switch
                    checked={formData.marketingEmails}
                    onCheckedChange={(checked) =>
                      handleToggleChange("marketingEmails", checked)
                    }
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="p-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <motion.div variants={item} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Security Settings
                </h3>
                <p className="text-gray-500 text-sm">
                  Manage your account security
                </p>
              </motion.div>

              <form onSubmit={handleChangePassword}>
                <motion.div variants={item} className="space-y-6 mb-8">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="rounded-xl"
                      placeholder="Your current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="rounded-xl"
                      placeholder="Your new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="rounded-xl"
                      placeholder="Confirm your new password"
                    />
                  </div>
                </motion.div>

                <motion.div variants={item}>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                  >
                    Change Password
                  </Button>
                </motion.div>
              </form>

              <motion.div
                variants={item}
                className="mt-8 pt-6 border-t border-gray-100"
              >
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Account Sessions
                </h4>
                <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
                  <div className="p-4 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="2"
                            y="4"
                            width="20"
                            height="16"
                            rx="2"
                            ry="2"
                          ></rect>
                          <rect x="8" y="10" width="8" height="4"></rect>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Current Session
                        </p>
                        <p className="text-xs text-gray-500">
                          Windows • Chrome • Last active now
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger" className="p-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <motion.div variants={item} className="mb-6">
                <h3 className="text-xl font-semibold text-red-600 mb-1">
                  Danger Zone
                </h3>
                <p className="text-gray-500 text-sm">
                  Irreversible and destructive actions
                </p>
              </motion.div>

              <motion.div
                variants={item}
                className="rounded-xl border border-red-200 bg-red-50 p-6"
              >
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Account
                </h4>
                <p className="text-gray-600 text-sm mb-6">
                  Once you delete your account, there is no going back. Please
                  be certain. All of your data, including resumes, templates,
                  and personal information will be permanently removed.
                </p>
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  Delete Account
                </Button>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
