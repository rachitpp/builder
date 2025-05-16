'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/store';
import { selectUser } from '@/app/features/auth/authSlice';
import { toggleSidebar } from '@/app/features/ui/uiSlice';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  // Get the page title based on the pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/dashboard/resumes') return 'My Resumes';
    if (pathname === '/dashboard/resumes/new') return 'Create New Resume';
    if (pathname.startsWith('/dashboard/resumes/edit')) return 'Edit Resume';
    if (pathname === '/dashboard/templates') return 'Templates';
    if (pathname === '/dashboard/profile') return 'Profile';
    if (pathname === '/dashboard/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={handleSidebarToggle}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out md:hidden"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page title */}
            <h1 className="text-xl font-semibold text-gray-800 ml-2 md:ml-0">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="relative ml-3">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              {/* Notification dropdown */}
              {notificationsOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg z-50"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <div className="rounded-md bg-white shadow-xs">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                        <button className="text-xs text-primary-600 hover:text-primary-500">
                          Mark all as read
                        </button>
                      </div>
                      <div className="divide-y divide-gray-200">
                        <div className="py-3">
                          <p className="text-sm text-gray-600">No new notifications.</p>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <Link
                          href="/dashboard/notifications"
                          className="text-sm text-primary-600 hover:text-primary-500"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <div>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                </button>
              </div>

              {/* Profile dropdown panel */}
              {dropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="py-1 rounded-md bg-white shadow-xs">
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <Link
                      href="/dashboard/help"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Help Center
                    </Link>
                    <button
                      onClick={() => {
                        // Handle logout logic
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;