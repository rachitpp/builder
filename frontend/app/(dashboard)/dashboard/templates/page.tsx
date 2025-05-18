"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/store";
import {
  getTemplates,
  getTemplateCategories,
  selectTemplates,
  selectTemplateLoading,
  selectCategories,
  selectTotalTemplates,
  selectCurrentPage,
  selectTotalPages,
} from "@/app/features/templates/templateSlice";
import TemplateCard from "@/app/components/dashboard/TemplateCard";
import { motion, AnimatePresence } from "framer-motion";

export default function TemplatesPage() {
  const dispatch = useAppDispatch();
  const templates = useAppSelector(selectTemplates);
  const loading = useAppSelector(selectTemplateLoading);
  const categories = useAppSelector(selectCategories);
  const totalTemplates = useAppSelector(selectTotalTemplates);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined
  );
  const [showPremium, setShowPremium] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    // Load template categories
    dispatch(getTemplateCategories());

    // Initial load of templates
    dispatch(getTemplates({ page: 1, limit: 12 }));
  }, [dispatch]);

  // Apply filters when they change
  useEffect(() => {
    dispatch(
      getTemplates({
        category: categoryFilter,
        isPremium: showPremium,
        page: 1,
        limit: 12,
      })
    );
  }, [dispatch, categoryFilter, showPremium]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
    // For now, we'll just filter by category and premium status on the backend
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategoryFilter(value || undefined);
  };

  const handlePremiumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "all") {
      setShowPremium(undefined);
    } else if (value === "premium") {
      setShowPremium(true);
    } else {
      setShowPremium(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(
        getTemplates({
          category: categoryFilter,
          isPremium: showPremium,
          page: newPage,
          limit: 12,
        })
      );
    }
  };

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
      {/* Header Section */}
      <motion.div
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-sm relative overflow-hidden"
        variants={itemVariants}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-[100px] transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-tr-[100px] transform -translate-x-16 translate-y-16"></div>

        <div className="relative z-10 py-3 px-4">
          <h2 className="text-xl font-bold text-white mb-1">
            Resume Templates
          </h2>
          <p className="text-primary-100 text-xs max-w-2xl">
            Choose from our collection of professionally designed templates to
            create standout resumes
          </p>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
        variants={itemVariants}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row md:items-end gap-3"
        >
          <div className="md:flex-1">
            <label
              htmlFor="search"
              className="block text-xs font-medium text-gray-800 mb-1"
            >
              Search Templates
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by name or keyword..."
                className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm text-gray-900"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="md:w-40">
            <label
              htmlFor="category"
              className="block text-xs font-medium text-gray-800 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              className="block w-full pl-3 pr-10 py-1.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm text-gray-900"
              value={categoryFilter || ""}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="md:w-40">
            <label
              htmlFor="premium"
              className="block text-xs font-medium text-gray-800 mb-1"
            >
              Type
            </label>
            <select
              id="premium"
              className="block w-full pl-3 pr-10 py-1.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm text-gray-900"
              value={
                showPremium === undefined
                  ? "all"
                  : showPremium
                  ? "premium"
                  : "free"
              }
              onChange={handlePremiumChange}
            >
              <option value="all">All Templates</option>
              <option value="free">Free Only</option>
              <option value="premium">Premium Only</option>
            </select>
          </div>

          <div className="md:w-auto md:flex-shrink-0">
            <motion.button
              type="submit"
              className="w-full md:w-auto px-3 py-1.5 border border-transparent rounded-lg shadow-sm text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Search
            </motion.button>
          </div>
        </form>

        {/* Active filters */}
        <div className="mt-3 flex flex-wrap gap-2">
          {categoryFilter && (
            <div className="inline-flex items-center bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs">
              Category:{" "}
              {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
              <button
                onClick={() => setCategoryFilter(undefined)}
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
          )}
          {showPremium !== undefined && (
            <div className="inline-flex items-center bg-secondary-50 text-secondary-700 px-2 py-1 rounded-full text-xs">
              Type: {showPremium ? "Premium" : "Free"}
              <button
                onClick={() => setShowPremium(undefined)}
                className="ml-1.5 text-secondary-600 hover:text-secondary-800"
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
          )}
        </div>
      </motion.div>

      {/* Template Count */}
      <motion.div
        className="flex justify-between items-center"
        variants={itemVariants}
      >
        <div className="text-xs font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
          Showing {templates.length} of {totalTemplates} templates
        </div>
      </motion.div>

      {/* Templates Grid */}
      {loading && templates.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="text-xs text-gray-700 animate-pulse">
              Loading templates...
            </p>
          </div>
        </div>
      ) : templates.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          <AnimatePresence>
            {templates.map((template, index) => (
              <motion.div
                key={template._id}
                variants={itemVariants}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                layout
              >
                <TemplateCard template={template} />
              </motion.div>
            ))}
          </AnimatePresence>
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
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Try adjusting your search criteria to find templates
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setCategoryFilter(undefined)}
                className="px-3 py-1.5 bg-gray-100 text-gray-800 text-xs rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </motion.div>
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
