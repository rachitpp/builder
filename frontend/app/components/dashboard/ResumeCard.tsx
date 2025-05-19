import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/lib/store";
import {
  deleteResume,
  toggleResumeVisibility,
  cloneResume,
  downloadResumePdf,
} from "@/app/features/resume/resumeSlice";
import { openModal, addNotification } from "@/app/features/ui/uiSlice";
import { Resume } from "@/app/features/resume/resumeSlice";

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
          message: "Generating PDF resume, please wait...",
          type: "info",
        })
      );

      await dispatch(
        downloadResumePdf({ id: resume._id, template: "modern" })
      ).unwrap();

      dispatch(
        addNotification({
          message: "Resume opened in new tab. You can print it from there!",
          type: "success",
        })
      );
    } catch (error: any) {
      console.error("Failed to generate PDF resume:", error);
      dispatch(
        addNotification({
          message: error || "Failed to generate PDF resume",
          type: "error",
        })
      );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
        <div className="relative aspect-[1/1.4142] bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center bg-primary-50">
            <svg
              className="w-16 h-16 text-primary-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          {/* Status badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={resume.isPublic ? "default" : "secondary"}
              className="capitalize"
            >
              {resume.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-lg mb-1 truncate">{resume.title}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Last modified:{" "}
            {resume.updatedAt
              ? new Date(resume.updatedAt).toLocaleDateString()
              : "Not modified"}
          </p>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/resume/${resume._id}/edit`}>Edit</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/resume/${resume._id}/preview`}>Preview</Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ResumeCard;
