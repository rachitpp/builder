"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TemplateCard from "@/app/components/dashboard/TemplateCard";
import type { Template } from "@/app/features/templates/templateSlice";

interface TemplateSelectorProps {
  templates: Template[];
  onSelect: (templateId: string) => void;
  loading?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelect,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [filteredTemplates, setFilteredTemplates] =
    useState<Template[]>(templates);
  const [selectedSort, setSelectedSort] = useState<
    "popular" | "newest" | "a-z"
  >("popular");

  // Get unique categories from templates
  const categories = Array.from(
    new Set(templates.map((template) => template.category))
  );

  // Filter templates when search or category changes
  useEffect(() => {
    let result = templates;

    // Apply search filter
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (template) =>
          template.name.toLowerCase().includes(lowercaseSearchTerm) ||
          template.description.toLowerCase().includes(lowercaseSearchTerm) ||
          template.category.toLowerCase().includes(lowercaseSearchTerm)
      );
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter(
        (template) =>
          template.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Apply sorting
    if (selectedSort === "newest") {
      result = [...result].sort((a, b) => {
        return (
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
        );
      });
    } else if (selectedSort === "a-z") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === "popular") {
      // Popular sort - prioritize premium templates
      result = [...result].sort((a, b) => {
        // Sort first by premium status, then by name
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    setFilteredTemplates(result);
  }, [searchTerm, categoryFilter, templates, selectedSort]);

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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Choose Your Resume Template</h2>
        <p className="text-primary-100">
          Select a professional template to make your resume stand out. Our
          templates are designed to pass ATS systems and impress recruiters.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="md:w-1/3">
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
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-1/3">
            <select
              className="w-full py-2 pl-3 pr-10 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              value={categoryFilter || ""}
              onChange={(e) => setCategoryFilter(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="md:w-1/3">
            <select
              className="w-full py-2 pl-3 pr-10 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              value={selectedSort}
              onChange={(e) =>
                setSelectedSort(e.target.value as "popular" | "newest" | "a-z")
              }
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="a-z">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        {(searchTerm || categoryFilter) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
              >
                Search: {searchTerm}
                <button
                  className="ml-2 text-primary-600 hover:text-primary-800"
                  onClick={() => setSearchTerm("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
              </motion.div>
            )}
            {categoryFilter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center bg-secondary-50 text-secondary-700 px-3 py-1 rounded-full text-sm"
              >
                Category:{" "}
                {categoryFilter.charAt(0).toUpperCase() +
                  categoryFilter.slice(1)}
                <button
                  className="ml-2 text-secondary-600 hover:text-secondary-800"
                  onClick={() => setCategoryFilter(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
              </motion.div>
            )}
            {(searchTerm || categoryFilter) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter(null);
                }}
              >
                Clear All Filters
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Template Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading templates...</p>
          </div>
        </div>
      ) : (
        <>
          <AnimatePresence>
            {filteredTemplates.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template._id}
                    onClick={() => onSelect(template._id)}
                    className="cursor-pointer"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TemplateCard template={template} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
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
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No templates found
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any templates matching your criteria. Try
                  adjusting your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter(null);
                  }}
                  className="btn btn-primary inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reset Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Template Count */}
          {filteredTemplates.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-gray-500"
            >
              Showing {filteredTemplates.length} of {templates.length} templates
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default TemplateSelector;
