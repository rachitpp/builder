"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import Link from "next/link";

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

// Help categories with their articles
const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of using the platform",
    icon: (
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
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    ),
    color: "bg-blue-100 text-blue-600",
    articles: [
      {
        id: "creating-account",
        title: "Creating an Account",
        description: "Learn how to sign up and get started with your account",
      },
      {
        id: "dashboard-overview",
        title: "Dashboard Overview",
        description:
          "Navigate through the dashboard and understand its features",
      },
      {
        id: "first-resume",
        title: "Creating Your First Resume",
        description: "Step-by-step guide to creating your first resume",
      },
    ],
  },
  {
    id: "templates",
    title: "Templates",
    description: "Explore our collection of professional templates",
    icon: (
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
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    ),
    color: "bg-indigo-100 text-indigo-600",
    articles: [
      {
        id: "choosing-template",
        title: "Choosing the Right Template",
        description: "Tips for selecting the perfect template for your needs",
      },
      {
        id: "customizing-template",
        title: "Customizing Your Template",
        description: "Learn how to personalize templates with your own style",
      },
      {
        id: "template-categories",
        title: "Template Categories",
        description: "Explore different template styles and their purposes",
      },
    ],
  },
  {
    id: "resume-building",
    title: "Resume Building",
    description: "Tips and tricks for creating outstanding resumes",
    icon: (
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
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    ),
    color: "bg-green-100 text-green-600",
    articles: [
      {
        id: "content-tips",
        title: "Resume Content Tips",
        description: "Best practices for writing compelling resume content",
      },
      {
        id: "skills-section",
        title: "Creating a Strong Skills Section",
        description: "Highlight your skills effectively",
      },
      {
        id: "experience-section",
        title: "Work Experience Section",
        description: "Format your work history for maximum impact",
      },
    ],
  },
  {
    id: "account-settings",
    title: "Account & Settings",
    description: "Manage your account and personal settings",
    icon: (
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
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
    color: "bg-amber-100 text-amber-600",
    articles: [
      {
        id: "profile-settings",
        title: "Profile Settings",
        description: "Update your personal information and preferences",
      },
      {
        id: "security",
        title: "Account Security",
        description: "Keep your account secure with these tips",
      },
      {
        id: "notifications",
        title: "Managing Notifications",
        description: "Control the notifications you receive",
      },
    ],
  },
];

// Popular questions for FAQs
const popularQuestions = [
  {
    id: "faq-1",
    question: "How do I download my resume as a PDF?",
    answer:
      "You can download your resume by opening it and clicking the 'Download' button in the top right corner. Choose PDF format from the dropdown menu.",
  },
  {
    id: "faq-2",
    question: "Can I create multiple resumes?",
    answer:
      "Yes! You can create as many resumes as you need. Each resume can have a different template and content tailored for specific job applications.",
  },
  {
    id: "faq-3",
    question: "How do I share my resume with employers?",
    answer:
      "After creating your resume, you can share it by generating a unique link or downloading it to send directly. Go to your resume and click the 'Share' button.",
  },
  {
    id: "faq-4",
    question: "Can I import my existing resume?",
    answer:
      "Yes, you can import your existing resume by going to the dashboard and clicking the 'Import' button. We support Word documents and PDFs.",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter articles based on search and category
  const filteredArticles = helpCategories
    .flatMap((category) => {
      return category.articles.map((article) => ({
        ...article,
        category: {
          id: category.id,
          title: category.title,
          color: category.color,
        },
      }));
    })
    .filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory || article.category.id === selectedCategory;

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
          className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>

          <div className="relative z-10 p-8 sm:p-10 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Help Center</h1>
            <p className="text-blue-100 max-w-lg text-lg mb-8">
              Find answers to your questions and learn how to get the most out
              of our platform.
            </p>

            {/* Search Bar */}
            <div className="relative w-full max-w-md mb-4">
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white pr-10 pl-12"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
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

      {/* Categories */}
      <section>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {helpCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                selectedCategory === category.id ? "ring-2 ring-indigo-500" : ""
              }`}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${category.color}`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold">
                    {category.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {category.description}
                  </p>
                  <p className="text-indigo-600 text-xs mt-2 font-medium">
                    {category.articles.length} articles
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Articles */}
      <section>
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory
                ? `${
                    helpCategories.find((cat) => cat.id === selectedCategory)
                      ?.title
                  } Articles`
                : searchQuery
                ? "Search Results"
                : "Help Articles"}
            </h2>
            {(selectedCategory || searchQuery) && (
              <Button
                variant="outline"
                className="text-gray-600 rounded-xl"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {filteredArticles.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={item}
                  className="p-5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${article.category.color}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                        <line x1="10" y1="9" x2="8" y2="9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium text-base">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full">
                          {article.category.title}
                        </Badge>
                        <Link
                          href={`/help/${article.category.id}/${article.id}`}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Read article →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-indigo-400"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find any articles matching your search. Try using
                different keywords or browse our categories.
              </p>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
              >
                Browse All Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section>
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {popularQuestions.map((faq) => (
              <motion.div
                key={faq.id}
                variants={item}
                className="p-5 rounded-xl border border-gray-100"
              >
                <h3 className="text-gray-900 font-medium text-base mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Support */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-center"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-indigo-100 mb-6 max-w-md mx-auto">
            Can't find the answer you're looking for? Our support team is here
            to help.
          </p>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl">
            Contact Support
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
