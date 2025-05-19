"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/app/lib/store";
import { selectUser } from "@/app/features/auth/authSlice";
import {
  getResumes,
  selectResumes,
  selectResumeLoading,
} from "@/app/features/resume/resumeSlice";
import {
  getTemplates,
  selectTemplates,
} from "@/app/features/templates/templateSlice";
import { motion } from "framer-motion";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const resumes = useAppSelector(selectResumes);
  const templates = useAppSelector(selectTemplates);
  const loading = useAppSelector(selectResumeLoading);

  useEffect(() => {
    dispatch(getResumes({ page: 1, limit: 10 }));
    dispatch(getTemplates({ page: 1, limit: 3 }));
  }, [dispatch]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  // Get current time for greeting
  const getCurrentGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  // Mock activities data
  const activities = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      title: "Resume Created",
      description: "You created UX Designer Portfolio",
      time: "1 day ago",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
      title: "Resume Updated",
      description: "You updated Software Engineer Resume",
      time: "3 days ago",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      title: "Resume Downloaded",
      description: "Downloaded Project Manager Resume",
      time: "2 weeks ago",
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>

          <div className="relative z-10 p-8 sm:p-10 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {getCurrentGreeting()}, {user?.firstName || "User"}!
            </h1>
            <p className="text-indigo-100 max-w-lg text-lg mb-8">
              Build stunning resumes that stand out from the crowd. Your
              professional journey starts here.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-white text-indigo-600 hover:bg-indigo-50 border-0 rounded-xl py-5 px-6 text-base font-medium shadow-xl shadow-indigo-900/20"
                size="lg"
                asChild
              >
                <Link href="/dashboard/resumes/new">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  Create New Resume
                </Link>
              </Button>

              <Button
                variant="outline"
                className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 rounded-xl py-5 px-6 text-base font-medium"
                size="lg"
                asChild
              >
                <Link href="/dashboard/templates">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  Explore Templates
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <motion.div
          variants={item}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Resumes</p>
              <h3 className="text-gray-900 text-3xl font-bold mt-2">
                {loading ? (
                  <Skeleton className="h-9 w-16 bg-gray-200" />
                ) : (
                  resumes.length || 0
                )}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Downloads</p>
              <h3 className="text-gray-900 text-3xl font-bold mt-2">5</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Views</p>
              <h3 className="text-gray-900 text-3xl font-bold mt-2">12</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Job Matches</p>
              <h3 className="text-gray-900 text-3xl font-bold mt-2">8</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-amber-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Resumes */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-2"
        >
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900 text-xl font-bold">
                Recent Resumes
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl"
                asChild
              >
                <Link href="/dashboard/resumes">View All</Link>
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-24 w-full rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            ) : resumes.length > 0 ? (
              <div className="space-y-4">
                {resumes.slice(0, 3).map((resume) => (
                  <motion.div
                    key={resume._id}
                    variants={item}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors duration-200"
                  >
                    <div className="h-16 w-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {false ? (
                        <img
                          src=""
                          alt={resume.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-900 font-medium text-base">
                          {resume.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="rounded-full text-xs capitalize"
                        >
                          Draft
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        {"Custom Template"}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-400 text-xs">
                          Last modified: {new Date().toLocaleDateString()}
                        </p>
                        <Link
                          href={`/builder/${resume._id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No resumes yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm">
                  Create your first resume to keep track of your professional
                  journey
                </p>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                  asChild
                >
                  <Link href="/dashboard/resumes/new">Create New Resume</Link>
                </Button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Activity */}
        <motion.section variants={container} initial="hidden" animate="show">
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900 text-xl font-bold">
                Recent Activity
              </h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-16 w-full rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="flex gap-4 rounded-xl"
                  >
                    <div className={`p-2 rounded-lg ${activity.color} h-fit`}>
                      {activity.icon}
                    </div>
                    <div>
                      <h3 className="text-gray-900 text-sm font-medium">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">
                        {activity.description}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Templates Preview */}
      <motion.section variants={item} initial="hidden" animate="show">
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-900 text-xl font-bold">Templates</h2>
            <Button
              variant="outline"
              size="sm"
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl"
              asChild
            >
              <Link href="/dashboard/templates">Browse All</Link>
            </Button>
          </div>

          {loading ? (
            <Skeleton className="h-56 w-full rounded-xl bg-gray-100" />
          ) : (
            <div className="relative h-56 overflow-hidden rounded-xl">
              <div className="absolute inset-0 grid grid-cols-3 gap-4">
                {templates.slice(0, 3).map((template, index) => (
                  <div
                    key={template._id || index}
                    className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 transition-transform duration-300 hover:scale-[1.03] shadow-sm hover:shadow-md"
                    style={{
                      backgroundImage: template.thumbnailUrl
                        ? `url(${template.thumbnailUrl})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!template.thumbnailUrl && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/30 to-transparent flex items-end p-4">
                <p className="text-white text-sm mb-2">
                  Choose from{" "}
                  <span className="text-indigo-200 font-semibold">
                    {templates.length}
                  </span>{" "}
                  professional templates
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
