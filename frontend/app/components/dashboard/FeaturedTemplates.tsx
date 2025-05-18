"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import TemplateCard from "./TemplateCard";
import { Template } from "@/app/features/templates/templateSlice";

interface FeaturedTemplatesProps {
  templates: Template[];
}

const FeaturedTemplates: React.FC<FeaturedTemplatesProps> = ({ templates }) => {
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
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-gray-800">
          Featured Templates
        </h3>
        <Link
          href="/dashboard/templates"
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {templates.slice(0, 5).map((template, index) => (
          <motion.div
            key={template._id}
            variants={itemVariants}
            custom={index}
            className="transform transition-transform hover:scale-[1.02] duration-200"
          >
            <TemplateCard template={template} />
          </motion.div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mx-auto text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-sm font-medium text-gray-800 mb-1">
            No templates yet
          </h3>
          <p className="text-xs text-gray-500">
            Check back soon for new templates
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default FeaturedTemplates;
