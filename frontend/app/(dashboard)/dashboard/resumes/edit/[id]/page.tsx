"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/lib/store";
import {
  getResumeById,
  updateResume,
  selectCurrentResume,
  selectResumeLoading,
  selectResumeError,
} from "@/app/features/resume/resumeSlice";
import { toast } from "react-hot-toast";

export default function EditResumePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resume = useAppSelector(selectCurrentResume);
  const loading = useAppSelector(selectResumeLoading);
  const error = useAppSelector(selectResumeError);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resumeId = params.id as string;
    if (resumeId) {
      dispatch(getResumeById(resumeId))
        .unwrap()
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch resume:", error);
          toast.error(`Failed to fetch resume: ${error || "Unknown error"}`);
          setIsLoading(false);
        });
    }
  }, [dispatch, params.id]);

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-medium">Error Loading Resume</h3>
        <p className="mt-2">{error}</p>
        <button
          onClick={() => router.push("/dashboard/resumes")}
          className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200"
        >
          Back to Resumes
        </button>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-medium">Resume Not Found</h3>
        <p className="mt-2">
          The resume you're looking for couldn't be found. It may have been
          deleted or you might not have permission to view it.
        </p>
        <button
          onClick={() => router.push("/dashboard/resumes")}
          className="mt-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md hover:bg-yellow-200"
        >
          Back to Resumes
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Resume</h1>
        <p className="text-gray-600 mt-2">{resume.title}</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <p className="text-center text-gray-600">
          Resume editor will be implemented here. You can now access your resume
          with ID: {params.id}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/dashboard/resumes")}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 mr-4"
          >
            Back to Resumes
          </button>
        </div>
      </div>
    </div>
  );
}
