'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/store';
import { selectIsAuthenticated, getCurrentUser } from '@/app/features/auth/authSlice';
import Sidebar from '@/app/components/dashboard/Sidebar';
import Navbar from '@/app/components/dashboard/Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Fetch current user data if authenticated
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, router, dispatch]);

  if (!isAuthenticated) {
    // Return null or a loading indicator while redirecting
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <Navbar />
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;