import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  name: string;
  role: string;
  text: string;
  avatar: string;
  index?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  text,
  avatar,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden h-full"
    >
      <div className="flex flex-col h-full relative z-10">
        <div className="mb-3">
          <svg
            className="h-6 w-6 text-primary-400 group-hover:text-primary-500 transition-colors duration-300"
            fill="currentColor"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
        </div>

        <p className="flex-grow text-sm text-gray-600 mb-4 italic leading-relaxed relative z-10">
          {text}
        </p>

        <motion.div
          className="flex items-center mt-auto"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.2 }}
        >
          <div className="flex-shrink-0 mr-3">
            {avatar ? (
              <div className="h-10 w-10 rounded-full overflow-hidden relative border border-primary-100 group-hover:border-primary-200 transition-colors duration-300">
                <Image src={avatar} alt={name} fill className="object-cover" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200 group-hover:bg-primary-200 transition-colors duration-300">
                <span className="text-primary-700 font-bold text-sm">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold text-sm group-hover:text-primary-600 transition-colors duration-300">
              {name}
            </h4>
            <p className="text-gray-500 text-xs">{role}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
