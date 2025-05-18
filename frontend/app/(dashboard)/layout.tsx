"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/lib/store";
import {
  selectIsAuthenticated,
  getCurrentUser,
} from "@/app/features/auth/authSlice";
import DashNavbar from "@/app/components/dashboard/DashNavbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      // Fetch current user data if authenticated
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, router, dispatch]);

  if (!isAuthenticated) {
    // Return loading indicator while redirecting
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <DashNavbar />

      {/* Main Content */}
      <main className="flex-1 pt-4 pb-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
