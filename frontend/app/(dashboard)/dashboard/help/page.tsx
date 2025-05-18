"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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

  // Sample FAQ data
  const faqs = [
    {
      id: 1,
      question: "How do I create a new resume?",
      answer:
        "To create a new resume, go to the dashboard and click on the 'Create New Resume' button. You can also navigate to My Resumes and click the 'New Resume' button there. Follow the steps in the resume builder to complete your resume.",
    },
    {
      id: 2,
      question: "Can I download my resume in different formats?",
      answer:
        "Yes, you can download your resume in multiple formats including PDF, DOCX (Word), and plain text. After creating or editing your resume, go to the resume preview page and click on the 'Download' or 'Export' button to select your preferred format.",
    },
    {
      id: 3,
      question: "How do I change the template of my existing resume?",
      answer:
        "To change the template of an existing resume, open the resume for editing, then click on the 'Template' tab or section. You'll see a gallery of available templates. Click on any template to preview how your resume will look, then select 'Apply Template' to save the changes.",
    },
    {
      id: 4,
      question: "Is my data secure on this platform?",
      answer:
        "Yes, we take data security very seriously. All your data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent. You can review our privacy policy for more details on how we handle your data.",
    },
    {
      id: 5,
      question: "How can I delete my account?",
      answer:
        "To delete your account, go to Settings > Account > Danger Zone, and click on 'Delete Account'. You will be asked to confirm this action. Please note that account deletion is permanent and all your data will be removed from our systems.",
    },
    {
      id: 6,
      question: "Can I use the free version for job applications?",
      answer:
        "Absolutely! The free version allows you to create, edit, and download resumes for job applications. While premium features offer additional templates and advanced customization options, the free version provides all the essential tools needed for effective job applications.",
    },
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Help categories
  const helpCategories = [
    {
      title: "Getting Started",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      description: "Learn the basics of using our resume builder",
      link: "#getting-started",
    },
    {
      title: "Creating Resumes",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
      description: "Tips and guides for creating effective resumes",
      link: "#creating-resumes",
    },
    {
      title: "Managing Templates",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
      ),
      description: "How to use and customize resume templates",
      link: "#templates",
    },
    {
      title: "Account & Billing",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      description: "Manage your account settings and subscription",
      link: "#account-billing",
    },
  ];

  // Toggle FAQ expansion
  const toggleFaq = (id: number) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-sm relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-[100px] transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-tr-[100px] transform -translate-x-16 translate-y-16"></div>

        <div className="relative z-10 py-3 px-4">
          <h2 className="text-xl font-bold text-white mb-1">Help Center</h2>
          <p className="text-primary-100 text-xs max-w-2xl">
            Find answers to common questions and learn how to use our resume
            builder effectively
          </p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
      >
        <div className="max-w-2xl mx-auto">
          <label htmlFor="help-search" className="sr-only">
            Search help center
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
              id="help-search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-900"
              placeholder="Search for help articles, guides, or FAQs..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Popular Topics / Categories */}
      {!searchQuery && (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {helpCategories.map((category, index) => (
            <motion.a
              key={index}
              href={category.link}
              className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:border-primary-200 hover:shadow transition-all duration-300 flex flex-col items-center text-center"
              whileHover={{ y: -3 }}
            >
              <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-2">
                {category.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {category.title}
              </h3>
              <p className="text-xs text-gray-700">{category.description}</p>
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* FAQ Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
      >
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-100 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-3 py-2.5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      expandedFaq === faq.id ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
                    <p className="text-sm text-gray-800">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto text-gray-400 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                No results found
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                We couldn't find any help articles matching your search
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Still have questions?
            </h2>
            <p className="text-sm text-gray-700">
              Contact our support team for personalized help
            </p>
          </div>
          <motion.a
            href="#contact"
            className="mt-3 md:mt-0 inline-flex items-center px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Contact Support
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 ml-1.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}
