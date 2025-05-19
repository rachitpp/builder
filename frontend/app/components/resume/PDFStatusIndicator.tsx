"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAppSelector } from "@/app/lib/store";

interface PDFStatusIndicatorProps {
  jobId: string;
  onComplete?: (url: string) => void;
}

const PDFStatusIndicator: React.FC<PDFStatusIndicatorProps> = ({
  jobId,
  onComplete,
}) => {
  const [status, setStatus] = useState<string>("pending");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const token = useAppSelector((state) => state.auth.token);

  // Check status periodically
  useEffect(() => {
    if (!jobId) return;

    const checkStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { status, progress, result, error } = response.data;

        setStatus(status);
        if (progress) setProgress(progress);

        if (error) {
          setError(error);
        }

        if (status === "completed" && result?.filePath && onComplete) {
          // Call the completion handler with the file URL
          onComplete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/files/${result.fileName}`
          );
        }

        // Stop checking if job is done or errored
        if (status === "completed" || status === "failed") {
          return;
        }
      } catch (err) {
        console.error("Error checking PDF job status:", err);
        setError("Failed to check generation status");
      }
    };

    // Check immediately and then every 2 seconds
    checkStatus();
    const interval = setInterval(checkStatus, 2000);

    return () => clearInterval(interval);
  }, [jobId, token, onComplete]);

  // Different indicators based on status
  if (status === "completed") {
    return (
      <div className="mt-2 bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        PDF generated successfully!
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mt-2 bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 112 0v-2a1 1 0 11-2 0v2zm0-6a1 1 0 112 0 1 1 0 01-2 0z"
            clipRule="evenodd"
          />
        </svg>
        PDF generation failed: {error || "Unknown error"}
      </div>
    );
  }

  // For pending or active status
  return (
    <div className="mt-2 bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
      <div className="flex items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mr-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </motion.div>
        Generating PDF ({status})
      </div>

      {progress > 0 && (
        <div className="mt-2">
          <div className="w-full bg-blue-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFStatusIndicator;
