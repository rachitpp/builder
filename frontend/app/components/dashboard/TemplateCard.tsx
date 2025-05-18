import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/lib/store";
import { getTemplateById } from "@/app/features/templates/templateSlice";
import type { Template } from "@/app/features/templates/templateSlice";
import { motion } from "framer-motion";

interface TemplateCardProps {
  template: Template;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleUseTemplate = async () => {
    try {
      // Fetch full template details if needed
      await dispatch(getTemplateById(template._id)).unwrap();

      // Navigate to resume creation page with the template ID
      router.push(`/dashboard/resumes/new?template=${template._id}`);
    } catch (error) {
      console.error("Failed to get template details:", error);
    }
  };

  // Use thumbnailUrl as fallback if previewImage is not available
  const imageUrl = template.previewImage || template.thumbnailUrl;

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md template-preview group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
    >
      {/* Template Preview Image */}
      <div className="relative h-32 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={template.name}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            initial={{ scale: 1 }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
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
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
            PREMIUM
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-0.5 rounded-full shadow-sm">
          {template.category.charAt(0).toUpperCase() +
            template.category.slice(1)}
        </div>
      </div>

      {/* Template Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-800 group-hover:text-primary-600 transition-colors duration-200 truncate">
          {template.name}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-2 group-hover:text-gray-700 transition-colors duration-200">
          {template.description}
        </p>

        {/* Action Button */}
        <button
          onClick={handleUseTemplate}
          className={`w-full py-1.5 px-3 rounded text-center text-xs font-medium transition-all duration-200 ${
            template.isPremium
              ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
              : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
        >
          {template.isPremium ? (
            <span className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H7a1 1 0 110-2h7.586l-3.293-3.293A1 1 0 0112 2z"
                  clipRule="evenodd"
                />
              </svg>
              Use Premium
            </span>
          ) : (
            <span className="flex items-center justify-center">
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
              Use Template
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
