"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/app/lib/store";
import {
  selectIsAuthenticated,
  selectUser,
  logoutUser,
} from "@/app/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed w-full z-30 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.span
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800 group-hover:from-primary-500 group-hover:to-primary-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              ResumeBuilder
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/templates">Templates</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/blog">Blog</NavLink>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300">
                  <span className="mr-2">{user?.firstName || "User"}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300"
                >
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/register"
                    className="btn btn-primary px-6 py-2.5 rounded-full shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </nav>

          {/* Mobile Navigation Toggle */}
          <motion.button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatedMobileMenu
          isOpen={isMenuOpen}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        />
      </div>
    </motion.header>
  );
};

// NavLink component for consistent styling
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300 group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
  </Link>
);

// Animated Mobile Menu
const AnimatedMobileMenu = ({
  isOpen,
  isAuthenticated,
  handleLogout,
}: {
  isOpen: boolean;
  isAuthenticated: boolean;
  handleLogout: () => void;
}) => (
  <motion.div
    className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg overflow-hidden"
    initial={{ height: 0, opacity: 0 }}
    animate={{
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
    }}
    transition={{ duration: 0.3 }}
  >
    {isOpen && (
      <div className="space-y-1">
        <MobileNavLink href="/templates">Templates</MobileNavLink>
        <MobileNavLink href="/pricing">Pricing</MobileNavLink>
        <MobileNavLink href="/about">About</MobileNavLink>
        <MobileNavLink href="/blog">Blog</MobileNavLink>

        {isAuthenticated ? (
          <>
            <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
            <MobileNavLink href="/profile">Profile</MobileNavLink>
            <button
              onClick={handleLogout}
              className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="pt-2 pb-4 px-4 space-y-3">
            <Link
              href="/login"
              className="block w-full py-2.5 text-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block w-full py-2.5 text-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    )}
  </motion.div>
);

// Mobile NavLink component
const MobileNavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
  >
    {children}
  </Link>
);

export default Header;
