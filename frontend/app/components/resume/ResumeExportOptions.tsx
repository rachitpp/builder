"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeExportOptionsProps {
  onExport: (format: string, colorScheme?: string) => Promise<void>;
  resumeId: string;
}

const ResumeExportOptions: React.FC<ResumeExportOptionsProps> = ({
  onExport,
  resumeId,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf");
  const [colorScheme, setColorScheme] = useState<string>("default");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const formatOptions = [
    {
      id: "pdf",
      name: "PDF",
      icon: "📄",
      description: "Standard format for sharing and printing",
    },
    {
      id: "docx",
      name: "Word (DOCX)",
      icon: "📝",
      description: "Editable in Microsoft Word",
    },
    {
      id: "txt",
      name: "Plain Text",
      icon: "📋",
      description: "Simple text version",
    },
    {
      id: "json",
      name: "JSON",
      icon: "🔄",
      description: "For importing into other systems",
    },
  ];

  const colorOptions = [
    { id: "default", name: "Default", color: "#4F46E5" },
    { id: "blue", name: "Blue", color: "#2563EB" },
    { id: "green", name: "Green", color: "#059669" },
    { id: "red", name: "Red", color: "#DC2626" },
    { id: "purple", name: "Purple", color: "#7C3AED" },
    { id: "gray", name: "Gray", color: "#4B5563" },
  ];

  const handleExport = async () => {
    try {
      setIsLoading(true);
      await onExport(selectedFormat, colorScheme);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Export Resume</h3>
        <motion.button
          onClick={() => setShowOptions(!showOptions)}
          className={`p-2 rounded-full ${
            showOptions ? "bg-gray-100" : "hover:bg-gray-100"
          } transition-colors`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showOptions ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Format Selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Select Format
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formatOptions.map((format) => (
                    <motion.div
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-3 rounded-lg border ${
                        selectedFormat === format.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      } cursor-pointer transition-all duration-200`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{format.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {format.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format.description}
                          </p>
                        </div>
                        {selectedFormat === format.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <svg
                              className="h-5 w-5 text-primary-600"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Color Scheme Selection (Only for PDF) */}
              {selectedFormat === "pdf" && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Color Scheme
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <motion.div
                        key={color.id}
                        onClick={() => setColorScheme(color.id)}
                        className={`flex items-center p-2 rounded-lg border ${
                          colorScheme === color.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        } cursor-pointer transition-all duration-200`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className="w-5 h-5 rounded-full mr-2"
                          style={{ backgroundColor: color.color }}
                        ></div>
                        <span className="text-sm">{color.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <motion.button
                  onClick={handleExport}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Export as{" "}
                      {formatOptions.find((f) => f.id === selectedFormat)?.name}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showOptions && (
        <div className="p-4 flex justify-center">
          <motion.button
            onClick={handleExport}
            disabled={isLoading}
            className="px-4 py-2.5 bg-primary-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Quick Export as PDF
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ResumeExportOptions;
