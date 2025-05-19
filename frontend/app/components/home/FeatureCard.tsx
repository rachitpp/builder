import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  index?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-white p-6 md:p-8 rounded-xl shadow-elevation-2 border border-gray-100/80 
                hover:shadow-elevation-3 hover:border-primary-200 transition-all duration-500 
                group overflow-hidden"
      whileHover={{ y: -5 }}
    >
      {/* Decorative background pattern */}
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-primary-50/60 rounded-full -mr-10 -mt-10 z-0 
                    group-hover:bg-primary-100/70 group-hover:scale-110 transition-all duration-500"
      ></div>

      {/* Secondary decorative element */}
      <div
        className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-50/40 rounded-full -ml-12 -mb-12 z-0 
                   group-hover:bg-secondary-100/50 group-hover:scale-110 transition-all duration-500"
      ></div>

      <div className="relative z-10 flex flex-row items-start gap-5">
        <div>
          {icon ? (
            <div
              className="w-14 h-14 flex items-center justify-center bg-primary-50 rounded-xl 
                          group-hover:bg-primary-100 transform group-hover:scale-110 transition-all duration-300
                          shadow-sm group-hover:shadow-md overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Image
                src={icon}
                alt={title}
                width={28}
                height={28}
                className="text-primary-600 group-hover:scale-110 transition-transform duration-300 relative z-10"
              />
            </div>
          ) : (
            <div
              className="w-14 h-14 flex items-center justify-center bg-primary-50 rounded-xl
                          group-hover:bg-primary-100 transform group-hover:scale-110 transition-all duration-300
                          shadow-sm group-hover:shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-primary-600 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3
            className="text-xl font-bold mb-3 text-gray-800 font-heading group-hover:text-primary-600 
                        transition-colors duration-300 tracking-tight"
          >
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">{description}</p>

          {/* Improved hover indicator */}
          <div className="flex items-center text-primary-600 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <span className="text-sm font-medium mr-1">Learn more</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>

          {/* Subtle underline effect */}
          <div className="mt-4 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-transparent rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
