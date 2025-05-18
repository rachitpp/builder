import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color?: string;
  bgColor?: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color = "text-primary-600",
  bgColor = "bg-primary-50",
  description,
  trend,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100 group relative overflow-hidden"
    >
      {/* Background decoration */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${bgColor} opacity-20 rounded-bl-[100px] transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-300`}
      ></div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <div className="flex items-center space-x-2">
            <h4 className="text-3xl font-bold text-gray-800">{value}</h4>
            {trend && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
                  trend.isPositive
                    ? "text-green-700 bg-green-50"
                    : "text-red-700 bg-red-50"
                }`}
              >
                {trend.isPositive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586V7a1 1 0 112 0v5a1 1 0 01-1 1h-5z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div
          className={`${color} ${bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
