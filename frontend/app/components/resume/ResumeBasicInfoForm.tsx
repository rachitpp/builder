'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
  resumeTitle: 'My Professional Resume',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  jobTitle: '',
  summary: '',
};

const BasicInfoSchema = Yup.object().shape({
  resumeTitle: Yup.string().required('Resume title is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string(),
  jobTitle: Yup.string(),
  summary: Yup.string().max(500, 'Summary should be at most 500 characters'),
});

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
        <Form className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Resume Title
            </label>
            <Field
              id="resumeTitle"
              name="resumeTitle"
              type="text"
              placeholder="e.g., Software Engineer Resume"
              className={`block w-full px-3 py-2 border ${
                errors.resumeTitle && touched.resumeTitle
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
            />
            <ErrorMessage name="resumeTitle" component="p" className="mt-1 text-sm text-red-600" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Field
                id="firstName"
                name="firstName"
                type="text"
                placeholder="e.g., John"
                className={`block w-full px-3 py-2 border ${
                  errors.firstName && touched.firstName
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
              />
              <ErrorMessage name="firstName" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Field
                id="lastName"
                name="lastName"
                type="text"
                placeholder="e.g., Doe"
                className={`block w-full px-3 py-2 border ${
                  errors.lastName && touched.lastName
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
              />
              <ErrorMessage name="lastName" component="p" className="mt-1 text-sm text-red-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="e.g., john.doe@example.com"
                className={`block w-full px-3 py-2 border ${
                  errors.email && touched.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
              />
              <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <Field
                id="phone"
                name="phone"
                type="text"
                placeholder="e.g., (123) 456-7890"
                className={`block w-full px-3 py-2 border ${
                  errors.phone && touched.phone
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
              />
              <ErrorMessage name="phone" component="p" className="mt-1 text-sm text-red-600" />
            </div>
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <Field
              id="jobTitle"
              name="jobTitle"
              type="text"
              placeholder="e.g., Senior Software Engineer"
              className={`block w-full px-3 py-2 border ${
                errors.jobTitle && touched.jobTitle
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
            />
            <ErrorMessage name="jobTitle" component="p" className="mt-1 text-sm text-red-600" />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Professional Summary <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <Field
              as="textarea"
              id="summary"
              name="summary"
              rows={4}
              placeholder="Brief overview of your professional background and key strengths..."
              className={`block w-full px-3 py-2 border ${
                errors.summary && touched.summary
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
            />
            <ErrorMessage name="summary" component="p" className="mt-1 text-sm text-red-600" />
            <p className="mt-1 text-sm text-gray-500">
              A brief 2-3 sentence overview of your professional background, skills, and career goals.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
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
              )}
              Continue
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ResumeBasicInfoForm;