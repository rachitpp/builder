"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="group"
          transition={{ duration: 0.3 }}
        >
          <div
            className={`border border-gray-200/80 rounded-xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 ${
              activeIndex === index
                ? "bg-white"
                : "bg-white hover:bg-gray-50/80"
            }`}
          >
            <button
              className={`flex justify-between items-center w-full p-5 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 relative overflow-hidden rounded-t-xl ${
                activeIndex === index
                  ? "bg-primary-50/70 text-primary-800"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => toggleAccordion(index)}
              aria-expanded={activeIndex === index}
            >
              {/* Decoration */}
              {activeIndex === index && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <span className="text-base md:text-lg font-medium tracking-tight pr-4">
                {item.question}
              </span>
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-primary-100 text-primary-600"
                    : "bg-gray-100 text-gray-500"
                }`}
                animate={{
                  rotate: activeIndex === index ? 180 : 0,
                  scale: activeIndex === index ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: {
                      duration: 0.3,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    },
                    opacity: { duration: 0.2 },
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    className="p-5 pt-3 bg-white border-t border-gray-100"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FAQAccordion;
