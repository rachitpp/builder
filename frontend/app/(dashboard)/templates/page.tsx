"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import {
  getTemplates,
  selectTemplates,
  selectTemplateLoading,
} from "@/app/features/templates/templateSlice";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Badge } from "@/app/components/ui/badge";

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

export default function TemplatesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const templates = useAppSelector(selectTemplates) || [];
  const loading = useAppSelector(selectTemplateLoading);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Categories for templates
  const categories = [
    { id: "all", name: "All Templates" },
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative" },
    { id: "modern", name: "Modern" },
    { id: "simple", name: "Simple" },
  ];

  useEffect(() => {
    dispatch(getTemplates({}));
  }, [dispatch]);

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    router.push(`/builder/new?template=${templateId}`);
  };

  // Filter templates by search and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      (template.name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (template.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );

    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>

          <div className="relative z-10 p-8 sm:p-10 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Resume Templates
            </h1>
            <p className="text-purple-100 max-w-lg text-lg mb-8">
              Choose from our collection of professionally designed templates to
              create your perfect resume.
            </p>

            <div className="relative w-full max-w-md mb-4">
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white pr-10 pl-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`rounded-xl ${
              selectedCategory === category.id
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </motion.div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTemplates.map((template) => (
            <motion.div
              key={template._id || Math.random().toString()}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-80 flex flex-col">
                <div
                  className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative"
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
                        className="h-16 w-16"
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
                  {template.category && (
                    <Badge className="absolute top-3 right-3 bg-white/90 text-indigo-600 rounded-full px-2 py-0.5 text-xs">
                      {template.category}
                    </Badge>
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-gray-900 font-medium text-lg mb-1">
                    {template.name || "Untitled Template"}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {template.description ||
                      "A professionally designed resume template to showcase your skills and experience."}
                  </p>
                  <Button
                    className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => handleSelectTemplate(template._id || "")}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center"
        >
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-indigo-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No templates found
          </h3>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            {searchQuery
              ? "No templates match your search criteria. Try a different search term or category."
              : "We couldn't find any templates. Please try again later."}
          </p>
          <Button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 text-lg shadow-lg shadow-indigo-500/20"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
