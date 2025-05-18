"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/app/lib/store";
import {
  getResumes,
  selectResumes,
  selectResumeLoading,
  selectTotalResumes,
  selectCurrentPage,
  selectTotalPages,
} from "@/app/features/resume/resumeSlice";
import ResumeCard from "@/app/components/dashboard/ResumeCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumesPage() {
  const dispatch = useAppDispatch();
  const resumes = useAppSelector(selectResumes);
  const loading = useAppSelector(selectResumeLoading);
  const totalResumes = useAppSelector(selectTotalResumes);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"updatedAt" | "title">("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    dispatch(getResumes({ page: currentPage, limit: 9 }));
  }, [dispatch, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "newest" || value === "oldest") {
      setSortBy("updatedAt");
      setSortOrder(value === "newest" ? "desc" : "asc");
    } else if (value === "titleAZ" || value === "titleZA") {
      setSortBy("title");
      setSortOrder(value === "titleAZ" ? "asc" : "desc");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(getResumes({ page: newPage, limit: 9 }));
    }
  };

  // Filter and sort resumes
  const filteredResumes = resumes
    .filter((resume) =>
      resume.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "updatedAt") {
        const dateA = new Date(a.updatedAt || "").getTime();
        const dateB = new Date(b.updatedAt || "").getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return sortOrder === "asc"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      }
    });

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      {/* Header with animated gradient */}
      <motion.div
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-sm"
        variants={itemVariants}
      >
        <div className="relative py-3 px-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">My Resumes</h2>
            <p className="text-primary-100 text-xs max-w-2xl">
              Manage all your professional resumes in one place
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-3 md:mt-0"
          >
            <Link
              href="/dashboard/resumes/new"
              className="inline-flex items-center px-3 py-1.5 bg-white text-primary-700 text-xs font-medium rounded shadow-sm hover:bg-primary-50 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1.5"
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
          </motion.div>
        </div>
      </motion.div>

      {/* Filter and Sort Controls */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-1/2">
            <label
              htmlFor="search"
              className="block text-xs font-medium text-gray-800 mb-1"
            >
              Search Resumes
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm text-gray-900"
                placeholder="Search by resume title..."
                type="search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="sm:w-1/2">
            <label
              htmlFor="sort"
              className="block text-xs font-medium text-gray-800 mb-1"
            >
              Sort by
            </label>
            <select
              id="sort"
              name="sort"
              className="block w-full pl-3 pr-10 py-1.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm text-gray-900"
              value={
                sortBy === "updatedAt"
                  ? sortOrder === "desc"
                    ? "newest"
                    : "oldest"
                  : sortOrder === "asc"
                  ? "titleAZ"
                  : "titleZA"
              }
              onChange={handleSortChange}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="titleAZ">Title (A-Z)</option>
              <option value="titleZA">Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Active filters */}
        {searchTerm && (
          <div className="mt-3">
            <div className="inline-flex items-center bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1.5 text-primary-600 hover:text-primary-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Total Count */}
      <motion.div
        className="flex justify-between items-center"
        variants={itemVariants}
      >
        <div className="text-xs font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
          {totalResumes} {totalResumes === 1 ? "resume" : "resumes"} found
        </div>
      </motion.div>

      {/* Resume Grid */}
      {loading && filteredResumes.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="text-xs text-gray-700 animate-pulse">
              Loading your resumes...
            </p>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          {filteredResumes.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredResumes.map((resume, index) => (
                <motion.div
                  key={resume._id}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  layout
                >
                  <ResumeCard resume={resume} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-lg shadow-sm p-5 text-center border border-gray-100 relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 opacity-30 rounded-bl-[100px] transform translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-50 opacity-20 rounded-tr-[100px] transform -translate-x-12 translate-y-12"></div>

              <div className="relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-3"
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
                {searchTerm ? (
                  <>
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      No matching resumes found
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Try adjusting your search criteria
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      Clear Search
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      No resumes yet
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Create your first resume to get started
                    </p>
                    <Link
                      href="/dashboard/resumes/new"
                      className="px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200 inline-flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create First Resume
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-4"
          variants={itemVariants}
        >
          <nav className="flex items-center bg-white px-2 py-1.5 rounded-lg shadow-sm border border-gray-100">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-md mr-1 text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors duration-200"
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Prev
              </span>
            </motion.button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handlePageChange(page)}
                    className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-medium transition-colors duration-200 ${
                      currentPage === page
                        ? "bg-primary-600 text-white"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </motion.button>
                )
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded-md ml-1 text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors duration-200"
            >
              <span className="flex items-center">
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </motion.button>
          </nav>
        </motion.div>
      )}
    </motion.div>
  );
}
