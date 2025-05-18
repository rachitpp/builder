"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

interface ResumeBasicInfoFormProps {
  onSubmit: (values: BasicInfoValues) => void;
  loading: boolean;
  error: string | null;
  onCancel: () => void;
}

export interface BasicInfoValues {
  resumeTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  summary?: string;
}

const initialValues: BasicInfoValues = {
  resumeTitle: "My Professional Resume",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  summary: "",
};

const BasicInfoSchema = Yup.object().shape({
  resumeTitle: Yup.string().required("Resume title is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string(),
  jobTitle: Yup.string(),
  summary: Yup.string().max(500, "Summary should be at most 500 characters"),
});

// Animation variants
const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const ResumeBasicInfoForm: React.FC<ResumeBasicInfoFormProps> = ({
  onSubmit,
  loading,
  error,
  onCancel,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={BasicInfoSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formVariants}
          className="form-section relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-50 opacity-30 rounded-bl-[200px] transform translate-x-20 -translate-y-20 z-0"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-50 opacity-20 rounded-tr-[200px] transform -translate-x-20 translate-y-20 z-0"></div>

          <Form className="space-y-6 relative z-10">
            {error && (
              <motion.div
                variants={formItemVariants}
                className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-r-lg shadow-sm"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              variants={formItemVariants}
              className="form-section-title"
            >
              Personal Information
            </motion.div>

            <motion.div variants={formItemVariants}>
              <label
                htmlFor="resumeTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Resume Title
              </label>
              <div className="relative group">
                <Field
                  id="resumeTitle"
                  name="resumeTitle"
                  type="text"
                  placeholder="e.g., Software Engineer Resume"
                  className={`input group-hover:border-primary-400 ${
                    errors.resumeTitle && touched.resumeTitle
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {errors.resumeTitle && touched.resumeTitle ? (
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    touched.resumeTitle && (
                      <svg
                        className="h-5 w-5 text-green-500"
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
                    )
                  )}
                </div>
              </div>
              <ErrorMessage
                name="resumeTitle"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </motion.div>

            <motion.div
              variants={formItemVariants}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <div className="relative group">
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="e.g., John"
                    className={`input group-hover:border-primary-400 ${
                      errors.firstName && touched.firstName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {errors.firstName && touched.firstName ? (
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      touched.firstName && (
                        <svg
                          className="h-5 w-5 text-green-500"
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
                      )
                    )}
                  </div>
                </div>
                <ErrorMessage
                  name="firstName"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <div className="relative group">
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="e.g., Doe"
                    className={`input group-hover:border-primary-400 ${
                      errors.lastName && touched.lastName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {errors.lastName && touched.lastName ? (
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      touched.lastName && (
                        <svg
                          className="h-5 w-5 text-green-500"
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
                      )
                    )}
                  </div>
                </div>
                <ErrorMessage
                  name="lastName"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </motion.div>

            <motion.div
              variants={formItemVariants}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative group">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g., john.doe@example.com"
                    className={`input group-hover:border-primary-400 ${
                      errors.email && touched.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {errors.email && touched.email ? (
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      touched.email && (
                        <svg
                          className="h-5 w-5 text-green-500"
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
                      )
                    )}
                  </div>
                </div>
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number{" "}
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <div className="relative group">
                  <Field
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="e.g., (123) 456-7890"
                    className={`input group-hover:border-primary-400 ${
                      errors.phone && touched.phone
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    }`}
                  />
                </div>
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </motion.div>

            <motion.div variants={formItemVariants}>
              <label
                htmlFor="jobTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Title{" "}
                <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <div className="relative group">
                <Field
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  className={`input group-hover:border-primary-400 ${
                    errors.jobTitle && touched.jobTitle
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  }`}
                />
              </div>
              <ErrorMessage
                name="jobTitle"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <label
                htmlFor="summary"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Professional Summary{" "}
                <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <div className="relative group">
                <Field
                  as="textarea"
                  id="summary"
                  name="summary"
                  rows={4}
                  placeholder="Brief overview of your professional background and key strengths..."
                  className={`input group-hover:border-primary-400 ${
                    errors.summary && touched.summary
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  }`}
                />
              </div>
              <ErrorMessage
                name="summary"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
              <p className="mt-1 text-sm text-gray-500">
                A brief 2-3 sentence overview of your professional background,
                skills, and career goals.
              </p>
            </motion.div>

            <motion.div
              variants={formItemVariants}
              className="flex justify-end space-x-4 pt-6"
            >
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-outline flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back
              </button>
              <motion.button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn btn-primary flex items-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
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
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                Continue
              </motion.button>
            </motion.div>
          </Form>
        </motion.div>
      )}
    </Formik>
  );
};

export default ResumeBasicInfoForm;
