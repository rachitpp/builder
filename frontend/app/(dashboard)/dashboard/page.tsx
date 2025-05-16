'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/app/lib/store';
import { selectUser } from '@/app/features/auth/authSlice';
import { getResumes, selectResumes, selectResumeLoading } from '@/app/features/resume/resumeSlice';
import { getTemplates, selectTemplates } from '@/app/features/templates/templateSlice';
import DashboardCard from '@/app/components/dashboard/DashboardCard';
import ResumeCard from '@/app/components/dashboard/ResumeCard';
import TemplateCard from '@/app/components/dashboard/TemplateCard';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const resumes = useAppSelector(selectResumes);
  const loading = useAppSelector(selectResumeLoading);
  const templates = useAppSelector(selectTemplates);

  useEffect(() => {
    // Fetch user resumes
    dispatch(getResumes({ page: 1, limit: 3 }));
    
    // Fetch templates
    dispatch(getTemplates({ page: 1, limit: 4 }));
  }, [dispatch]);

  // Summary stats
  const stats = [
    { 
      title: 'Total Resumes', 
      value: resumes.length, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600',
    },
    { 
      title: 'Downloads', 
      value: 0, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      color: 'bg-green-100 text-green-600',
    },
    { 
      title: 'Views', 
      value: 0, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  const recentActivity = [
    { id: 1, action: 'Created resume', target: 'Software Engineer Resume', date: '2 days ago' },
    { id: 2, action: 'Updated resume', target: 'Marketing Specialist CV', date: '1 week ago' },
    { id: 3, action: 'Downloaded resume', target: 'Project Manager Resume', date: '2 weeks ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.firstName || 'User'}!
        </h2>
        <p className="mt-2 text-gray-600">
          Create, edit, and manage your professional resumes with our easy-to-use tools.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link 
            href="/dashboard/resumes/new" 
            className="btn btn-primary inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Resume
          </Link>
          <Link 
            href="/dashboard/templates" 
            className="btn btn-outline inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Browse Templates
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Resumes Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Recent Resumes</h3>
          <Link href="/dashboard/resumes" className="text-sm text-primary-600 hover:text-primary-700">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.slice(0, 3).map((resume) => (
              <ResumeCard key={resume._id} resume={resume} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-4">Create your first resume to get started</p>
            <Link href="/dashboard/resumes/new" className="btn btn-primary">
              Create Resume
            </Link>
          </div>
        )}
      </div>

      {/* Featured Templates Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Featured Templates</h3>
          <Link href="/dashboard/templates" className="text-sm text-primary-600 hover:text-primary-700">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.slice(0, 4).map((template) => (
            <TemplateCard key={template._id} template={template} />
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        
        <div className="divide-y divide-gray-200">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="py-3 flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {activity.action} - <span className="text-primary-600">{activity.target}</span>
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="py-3 text-gray-500 text-center">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}