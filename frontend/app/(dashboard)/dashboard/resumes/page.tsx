'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/app/lib/store';
import { getResumes, selectResumes, selectResumeLoading, selectTotalResumes, selectCurrentPage, selectTotalPages } from '@/app/features/resume/resumeSlice';
import ResumeCard from '@/app/components/dashboard/ResumeCard';

export default function ResumesPage() {
  const dispatch = useAppDispatch();
  const resumes = useAppSelector(selectResumes);
  const loading = useAppSelector(selectResumeLoading);
  const totalResumes = useAppSelector(selectTotalResumes);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'title'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    dispatch(getResumes({ page: currentPage, limit: 9 }));
  }, [dispatch, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'newest' || value === 'oldest') {
      setSortBy('updatedAt');
      setSortOrder(value === 'newest' ? 'desc' : 'asc');
    } else if (value === 'titleAZ' || value === 'titleZA') {
      setSortBy('title');
      setSortOrder(value === 'titleAZ' ? 'asc' : 'desc');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(getResumes({ page: newPage, limit: 9 }));
    }
  };

  // Filter and sort resumes
  const filteredResumes = resumes
    .filter(resume => 
      resume.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'updatedAt') {
        const dateA = new Date(a.updatedAt || '').getTime();
        const dateB = new Date(b.updatedAt || '').getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return sortOrder === 'asc' 
          ? titleA.localeCompare(titleB) 
          : titleB.localeCompare(titleA);
      }
    });

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">My Resumes</h2>
        <Link
          href="/dashboard/resumes/new"
          className="inline-flex items-center justify-center btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Resume
        </Link>
      </div>

      {/* Filter and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="sm:w-1/2">
          <label htmlFor="search" className="sr-only">Search</label>
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
              placeholder="Search resumes..."
              type="search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="sm:w-1/2">
          <label htmlFor="sort" className="sr-only">Sort by</label>
          <select
            id="sort"
            name="sort"
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={sortBy === 'updatedAt' ? (sortOrder === 'desc' ? 'newest' : 'oldest') : (sortOrder === 'asc' ? 'titleAZ' : 'titleZA')}
            onChange={handleSortChange}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="titleAZ">Title (A-Z)</option>
            <option value="titleZA">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Total Count */}
      <div className="mb-4 text-sm text-gray-500">
        {totalResumes} {totalResumes === 1 ? 'resume' : 'resumes'} found
      </div>

      {/* Resume Grid */}
      {loading && filteredResumes.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <ResumeCard key={resume._id} resume={resume} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {searchTerm ? (
            <>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No matching resumes found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-4">Create your first resume to get started</p>
              <Link href="/dashboard/resumes/new" className="btn btn-primary">
                Create Resume
              </Link>
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 mx-1 text-sm rounded-md ${
                    currentPage === page
                      ? 'bg-primary-600 text-white font-medium'
                      : 'text-gray-700 bg-white border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md ml-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}