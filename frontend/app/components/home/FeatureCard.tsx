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
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:border-primary-300 transition-all duration-300 group"
    >
      <div className="flex flex-row items-start gap-4">
        <div>
          {icon ? (
            <div className="w-10 h-10 flex items-center justify-center bg-primary-50 rounded-md group-hover:bg-primary-100 transition-colors duration-300">
              <Image
                src={icon}
                alt={title}
                width={24}
                height={24}
                className="text-primary-600 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-primary-50 rounded-md group-hover:bg-primary-100 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-600 group-hover:scale-110 transition-transform duration-300"
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
          <h3 className="text-base font-bold mb-1 text-gray-800 font-heading group-hover:text-primary-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
