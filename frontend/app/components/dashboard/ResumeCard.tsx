import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/lib/store";
import {
  deleteResume,
  toggleResumeVisibility,
  cloneResume,
  downloadResumePdf,
} from "@/app/features/resume/resumeSlice";
import { openModal, addNotification } from "@/app/features/ui/uiSlice";
import type { Resume } from "@/app/features/resume/resumeSlice";

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Format date to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = () => {
    router.push(`/dashboard/resumes/edit/${resume._id}`);
  };

  const handleDelete = async () => {
    dispatch(
      openModal({
        type: "confirm",
        data: {
          title: "Delete Resume",
          message:
            "Are you sure you want to delete this resume? This action cannot be undone.",
          confirmText: "Delete",
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              await dispatch(deleteResume(resume._id!)).unwrap();
              dispatch(
                addNotification({
                  message: "Resume deleted successfully",
                  type: "success",
                })
              );
            } catch (error: any) {
              dispatch(
                addNotification({
                  message: error.message || "Failed to delete resume",
                  type: "error",
                })
              );
            }
          },
        },
      })
    );
  };

  const handleToggleVisibility = async () => {
    try {
      await dispatch(
        toggleResumeVisibility({
          id: resume._id!,
          isPublic: !resume.isPublic,
        })
      ).unwrap();

      dispatch(
        addNotification({
          message: resume.isPublic
            ? "Resume is now private"
            : "Resume is now public",
          type: "success",
        })
      );
    } catch (error: any) {
      dispatch(
        addNotification({
          message: error.message || "Failed to update resume visibility",
          type: "error",
        })
      );
    }
  };

  const handleClone = async () => {
    try {
      await dispatch(cloneResume(resume._id!)).unwrap();
      dispatch(
        addNotification({
          message: "Resume cloned successfully",
          type: "success",
        })
      );
    } catch (error: any) {
      dispatch(
        addNotification({
          message: error.message || "Failed to clone resume",
          type: "error",
        })
      );
    }
  };

  const handleDownload = async () => {
    if (!resume._id) {
      dispatch(
        addNotification({
          message: "Resume ID is missing",
          type: "error",
        })
      );
      return;
    }

    try {
      dispatch(
        addNotification({
          message: "Generating printable resume, please wait...",
          type: "info",
        })
      );

      await dispatch(downloadResumePdf(resume._id)).unwrap();

      dispatch(
        addNotification({
          message: "Resume opened in new tab. You can print it from there!",
          type: "success",
        })
      );
    } catch (error: any) {
      console.error("Failed to generate printable resume:", error);
      dispatch(
        addNotification({
          message: error || "Failed to generate printable resume",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary-100 hover:shadow transition-all duration-200">
      {/* Resume Preview */}
      <div className="h-24 bg-gray-50 relative border-b border-gray-100">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
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
        </div>
      </div>

      {/* Resume Info */}
      <div className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm text-gray-800 truncate">
            {resume.title}
          </h3>
          {resume.isPublic && (
            <span className="bg-green-50 text-green-700 text-xs px-1.5 py-0.5 rounded-full">
              Public
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Updated: {formatDate(resume.updatedAt)}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-3">
          <button
            onClick={handleEdit}
            className="flex-1 inline-flex justify-center items-center text-xs px-2 py-1 border border-gray-200 text-gray-700 bg-white rounded hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 inline-flex justify-center items-center text-xs px-2 py-1 border border-gray-200 text-gray-700 bg-white rounded hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            PDF
          </button>

          <div className="relative group">
            <button className="inline-flex justify-center items-center text-xs px-2 py-1 border border-gray-200 text-gray-700 bg-white rounded hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>

            <div className="absolute right-0 mt-1 w-36 bg-white rounded shadow-lg overflow-hidden z-20 invisible group-hover:visible border border-gray-100">
              <div className="py-1">
                <button
                  onClick={handleToggleVisibility}
                  className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                >
                  {resume.isPublic ? "Make Private" : "Make Public"}
                </button>
                <button
                  onClick={handleClone}
                  className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Clone Resume
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
