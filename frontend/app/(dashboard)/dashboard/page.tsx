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
import ResumeCard from "@/app/components/dashboard/ResumeCard";
import FeaturedTemplates from "@/app/components/dashboard/FeaturedTemplates";
import { motion } from "framer-motion";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const resumes = useAppSelector(selectResumes);
  const loading = useAppSelector(selectResumeLoading);
  const templates = useAppSelector(selectTemplates);

  useEffect(() => {
    // Fetch user resumes
    dispatch(getResumes({ page: 1, limit: 4 }));

    // Fetch templates
    dispatch(getTemplates({ page: 1, limit: 5 }));
  }, [dispatch]);

  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  // Summary stats with improved data
  const stats = [
    {
      title: "Total Resumes",
      value: resumes.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Downloads",
      value: 5,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Views",
      value: 12,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Job Matches",
      value: 8,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  // Recent activity
  const recentActivity = [
    {
      id: 1,
      action: "Created resume",
      target: "Software Engineer Resume",
      date: "2 days ago",
      icon: "📄",
    },
    {
      id: 2,
      action: "Updated resume",
      target: "Marketing Specialist CV",
      date: "1 week ago",
      icon: "✏️",
    },
    {
      id: 3,
      action: "Downloaded resume",
      target: "Project Manager Resume",
      date: "2 weeks ago",
      icon: "⬇️",
    },
  ];

  // Job recommendations
  const jobRecommendations = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "Remote",
      match: 92,
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateTech",
      location: "San Francisco, CA",
      match: 87,
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "Creative Solutions",
      location: "New York, NY",
      match: 78,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariant}
      className="space-y-3"
    >
      {/* Welcome Banner & Quick Stats */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Welcome Banner */}
        <motion.div
          variants={itemVariant}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-sm md:flex-1"
        >
          <div className="relative py-3 px-4">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-white">
                <h2 className="text-base font-semibold">
                  Welcome, {user?.firstName || "User"}!
                </h2>
                <p className="mt-0.5 text-primary-100 text-xs max-w-xl">
                  Create and manage your professional resumes
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                <Link
                  href="/dashboard/resumes/new"
                  className="text-xs font-medium px-2.5 py-1 rounded bg-white text-primary-700 hover:bg-primary-50 inline-flex items-center shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Resume
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats - Horizontal desktop / vertical mobile */}
        <motion.div
          variants={itemVariant}
          className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 md:w-56"
        >
          <div className="flex items-center mb-3">
            <div className="h-7 w-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs mr-2">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="flex items-center text-xs text-primary-600">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                <span>Active</span>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Profile completeness</span>
              <span className="text-primary-600 font-medium">70%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="bg-primary-500 h-full rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Row */}
      <motion.div variants={itemVariant} className="grid grid-cols-4 gap-2">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariant}
            className="col-span-2 sm:col-span-1"
          >
            <div
              className={`${
                stat.bgColor
              } rounded-lg px-3 py-2 border border-${stat.color.replace(
                "text-",
                ""
              )}-100 shadow-sm flex items-center`}
            >
              <div className={`${stat.color} mr-2 p-1 bg-white rounded-md`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.title}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
        {/* Left Column - Recent Resumes (3/4 width on large screens) */}
        <motion.div
          variants={itemVariant}
          className="xl:col-span-3 bg-white rounded-lg shadow-sm p-3 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Recent Resumes
            </h3>
            <Link
              href="/dashboard/resumes"
              className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : resumes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {resumes.slice(0, 4).map((resume) => (
                <ResumeCard key={resume._id} resume={resume} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto text-gray-400 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xs text-gray-500 mb-2">
                Create your first resume to get started
              </p>
              <Link
                href="/dashboard/resumes/new"
                className="inline-flex items-center text-xs bg-primary-600 text-white py-1 px-2 rounded hover:bg-primary-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Resume
              </Link>
            </div>
          )}
        </motion.div>

        {/* Right Column - Activity (1/4 width on large screens) */}
        <motion.div
          variants={itemVariant}
          className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
        >
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Recent Activity
          </h3>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="py-2 flex items-start">
                <div className="flex-shrink-0 mr-2 text-sm">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-800">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-primary-600 ml-1">
                      {activity.target}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Featured Templates Section */}
      <motion.div variants={itemVariant}>
        <FeaturedTemplates templates={templates} />
      </motion.div>

      {/* Job Recommendations */}
      <motion.div
        variants={itemVariant}
        className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Recommended Jobs
          </h3>
          <a
            href="#"
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {jobRecommendations.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border border-gray-100 hover:border-primary-100 transition-colors p-2 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-xs text-gray-800">
                    {job.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {job.company} • {job.location}
                  </p>
                </div>
                <span className="bg-green-50 text-green-700 text-xs px-1.5 py-0.5 rounded-full">
                  {job.match}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
