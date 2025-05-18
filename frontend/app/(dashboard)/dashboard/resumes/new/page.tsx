"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/lib/store";
import {
  createEmptyResume,
  createResume,
  selectResumeLoading,
  selectResumeError,
} from "@/app/features/resume/resumeSlice";
import {
  getTemplates,
  selectTemplates,
  selectTemplateLoading,
  getTemplateById,
} from "@/app/features/templates/templateSlice";
import { setCurrentStep, nextStep, prevStep } from "@/app/features/ui/uiSlice";
import { resetAuthError } from "@/app/features/auth/authSlice";
import { mockTemplates } from "@/app/lib/mockData";
import TemplateCard from "@/app/components/dashboard/TemplateCard";
import ResumeBasicInfoForm from "@/app/components/resume/ResumeBasicInfoForm";
import { toast } from "react-hot-toast";
import TemplateSelector from "@/app/components/resume/TemplateSelector";

export default function NewResumePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const templates = useAppSelector(selectTemplates);
  const templatesLoading = useAppSelector(selectTemplateLoading);
  const resumeLoading = useAppSelector(selectResumeLoading);
  const resumeError = useAppSelector(selectResumeError);

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState(createEmptyResume());
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [templateRequested, setTemplateRequested] = useState(false);
  const [displayTemplates, setDisplayTemplates] = useState(
    templates.length > 0 ? templates : mockTemplates
  );

  useEffect(() => {
    // Reset any previous errors
    dispatch(resetAuthError());

    // Load templates if not already loaded and not already requested
    if (templates.length === 0 && !templatesLoading && !templateRequested) {
      setTemplateRequested(true);
      dispatch(getTemplates({}));
    }

    // Update displayTemplates when templates change
    if (templates.length > 0) {
      setDisplayTemplates(templates);
    }

    // Check if template ID is provided in URL
    const templateId = searchParams.get("template");
    if (templateId) {
      setSelectedTemplate(templateId);
      setResumeData((prevData) => ({
        ...prevData,
        templateId,
      }));
      setStep(2); // Skip to the next step
    }
  }, [dispatch, templates, templatesLoading, searchParams, templateRequested]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);

    // Find the template details to attach to resume data
    const selectedTemplateData = displayTemplates.find(
      (t) => t._id === templateId
    );

    setResumeData((prevData) => ({
      ...prevData,
      templateId,
      // Store additional template info if needed for mock templates
      _templateDetails: selectedTemplateData
        ? {
            name: selectedTemplateData.name,
            category: selectedTemplateData.category,
            isMock: templateId.startsWith("template"),
          }
        : undefined,
    }));

    // If selecting a mock template (ID starts with "template"), no need to fetch details
    if (templateId.startsWith("template")) {
      console.log("Selected mock template:", templateId);
      setStep(2);
    } else {
      // For real templates, fetch details first
      dispatch(getTemplateById(templateId))
        .unwrap()
        .then(() => {
          setStep(2);
        })
        .catch((error) => {
          console.error("Failed to get template details:", error);
          toast.error(`Failed to get template details: ${error}`);
        });
    }
  };

  const handleBasicInfoSubmit = (basicInfo: any) => {
    const updatedResumeData = {
      ...resumeData,
      title: basicInfo.resumeTitle,
      personalInfo: {
        ...resumeData.personalInfo,
        firstName: basicInfo.firstName,
        lastName: basicInfo.lastName,
        email: basicInfo.email,
        phone: basicInfo.phone,
        jobTitle: basicInfo.jobTitle,
        summary: basicInfo.summary,
      },
    };

    setResumeData(updatedResumeData);

    // Create the resume
    dispatch(createResume(updatedResumeData))
      .unwrap()
      .then((response) => {
        if (response && response.data && response.data._id) {
          // Navigate to the edit page with the new resume ID
          toast.success("Resume created successfully!");
          router.push(`/dashboard/resumes/edit/${response.data._id}`);
        } else {
          // Handle unexpected response format
          console.error("Invalid response format:", response);
          toast.error("Unexpected response format. Please try again.");
          router.push("/dashboard/resumes");
        }
      })
      .catch((error) => {
        console.error("Failed to create resume:", error);
        // Display specific error message to the user
        toast.error(`Failed to create resume: ${error || "Unknown error"}`);
        // Redirect to the dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard/resumes");
        }, 1500);
      });
  };

  // Filter templates based on search and category
  const filteredTemplates = displayTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !categoryFilter || template.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(displayTemplates.map((template) => template.category))
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Choose a Template
            </h2>

            <TemplateSelector
              templates={displayTemplates}
              onSelect={handleTemplateSelect}
              loading={templatesLoading}
            />
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Enter Basic Information
            </h2>
            <ResumeBasicInfoForm
              onSubmit={handleBasicInfoSubmit}
              loading={resumeLoading}
              error={resumeError}
              onCancel={() => setStep(1)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create New Resume</h1>
        <p className="text-gray-600 mt-2">
          Follow the steps to create your professional resume
        </p>
      </div>

      {/* Steps indicator */}
      <div className="mb-8">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${
              step >= 2 ? "bg-primary-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600">
            3
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm font-medium text-gray-600">
            Choose Template
          </div>
          <div className="text-sm font-medium text-gray-600">
            Basic Information
          </div>
          <div className="text-sm font-medium text-gray-600">
            Complete Resume
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white shadow-sm rounded-lg p-6">{renderStep()}</div>
    </div>
  );
}
