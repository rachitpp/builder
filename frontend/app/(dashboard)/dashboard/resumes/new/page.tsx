'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/store';
import { createEmptyResume, createResume, selectResumeLoading, selectResumeError } from '@/app/features/resume/resumeSlice';
import { getTemplates, selectTemplates, selectTemplateLoading } from '@/app/features/templates/templateSlice';
import { setCurrentStep, nextStep, prevStep, resetAuthError } from '@/app/features/ui/uiSlice';
import TemplateCard from '@/app/components/dashboard/TemplateCard';
import ResumeBasicInfoForm from '@/app/components/resume/ResumeBasicInfoForm';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    // Reset any previous errors
    dispatch(resetAuthError());
    
    // Load templates if not already loaded
    if (templates.length === 0 && !templatesLoading) {
      dispatch(getTemplates({}));
    }
    
    // Check if template ID is provided in URL
    const templateId = searchParams.get('template');
    if (templateId) {
      setSelectedTemplate(templateId);
      setResumeData(prevData => ({
        ...prevData,
        templateId,
      }));
      setStep(2); // Skip to the next step
    }
  }, [dispatch, templates.length, templatesLoading, searchParams]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setResumeData(prevData => ({
      ...prevData,
      templateId,
    }));
    setStep(2);
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
        // Navigate to the edit page with the new resume ID
        router.push(`/dashboard/resumes/edit/${response.data._id}`);
      })
      .catch((error) => {
        console.error('Failed to create resume:', error);
      });
  };

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(templates.map(template => template.category)));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose a Template</h2>
            
            {/* Filter controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/2">
                <label htmlFor="search" className="sr-only">Search templates</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search templates..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:w-1/2">
                <label htmlFor="category" className="sr-only">Filter by category</label>
                <select
                  id="category"
                  name="category"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={categoryFilter || ''}
                  onChange={(e) => setCategoryFilter(e.target.value || null)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {templatesLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div 
                    key={template._id} 
                    onClick={() => handleTemplateSelect(template._id)}
                    className="cursor-pointer"
                  >
                    <TemplateCard template={template} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No templates found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Basic Information</h2>
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
        <p className="text-gray-600 mt-2">Follow the steps to create your professional resume</p>
      </div>

      {/* Steps indicator */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600">
            3
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm font-medium text-gray-600">Choose Template</div>
          <div className="text-sm font-medium text-gray-600">Basic Information</div>
          <div className="text-sm font-medium text-gray-600">Complete Resume</div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        {renderStep()}
      </div>
    </div>
  );
}