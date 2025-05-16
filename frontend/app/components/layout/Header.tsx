'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/app/lib/store';
import { selectIsAuthenticated, selectUser, logoutUser } from '@/app/features/auth/authSlice';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  return (
    <header className={`fixed w-full z-30 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">ResumeBuilder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/templates" className="text-gray-700 hover:text-primary-600 font-medium">
              Templates
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-primary-600 font-medium">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium">
              About
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary-600 font-medium">
              Blog
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-primary-600 font-medium">
                  <span className="mr-2">{user?.firstName || 'User'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <Link href="/templates" className="block py-2 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
              Templates
            </Link>
            <Link href="/pricing" className="block py-2 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
              Pricing
            </Link>
            <Link href="/about" className="block py-2 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
              About
            </Link>
            <Link href="/blog" className="block py-2 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
              Blog
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block py-2 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link href="/profile" className="block py-2 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2 pb-4 px-4 space-y-2">
                <Link href="/login" className="block w-full py-2 text-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Login
                </Link>
                <Link href="/register" className="block w-full py-2 text-center rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;