import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  text: string;
  name: string;
  role: string;
  avatar: string;
  index?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  text,
  name,
  role,
  avatar,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-white rounded-xl shadow-elevation-2 p-8 border border-gray-100/80 
                overflow-hidden group hover:shadow-elevation-3 transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      {/* Glass blur effect at the top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Decorative quote mark */}
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6">
        <svg
          width="50"
          height="50"
          viewBox="0 0 85 70"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-primary-400 group-hover:fill-primary-500 transition-colors duration-300"
        >
          <path d="M35.1998 70H0.799805L24.1998 0H45.9998L35.1998 70ZM74.1998 70H39.9998L63.3998 0H85.1998L74.1998 70Z" />
        </svg>
      </div>

      {/* Subtle background shape */}
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-primary-50/40 to-transparent rounded-full z-0 
                    group-hover:from-primary-100/40 group-hover:scale-110 transition-all duration-500"
      ></div>

      <div className="relative z-10">
        {/* Testimonial text */}
        <p className="text-gray-600 leading-relaxed mb-8 italic text-lg">
          "{text}"
        </p>

        {/* Avatar and info */}
        <div className="flex items-center mt-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md mr-4 group-hover:shadow-lg transition-shadow duration-300">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold text-lg font-heading">
              {name}
            </h4>
            <p className="text-gray-500 text-base">{role}</p>
          </div>

          {/* Star rating */}
          <div className="ml-auto flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.svg
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.5 + i * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400 group-hover:text-yellow-500 transition-colors duration-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            ))}
          </div>
        </div>

        {/* Read more indicator */}
        <div className="mt-5 flex items-center text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="mr-1">Read full testimonial</span>
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
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
