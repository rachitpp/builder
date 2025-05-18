"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-10 pb-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-900/20 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary-900/20 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2 lg:col-span-1"
          >
            <Link href="/" className="flex items-center mb-3 group">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400 group-hover:from-primary-300 group-hover:to-secondary-300 transition-all duration-300">
                ResumeBuilder
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Create professional resumes in minutes with our easy-to-use resume
              builder. Stand out from the crowd and land your dream job.
            </p>
            <div className="flex space-x-3">
              <SocialIcon href="https://twitter.com" name="Twitter">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" name="LinkedIn">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </SocialIcon>
              <SocialIcon href="https://github.com" name="GitHub">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </SocialIcon>
            </div>
          </motion.div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links" delay={0.1}>
            <FooterLink href="/templates">Templates</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
          </FooterColumn>

          {/* Resources */}
          <FooterColumn title="Resources" delay={0.2}>
            <FooterLink href="/resume-tips">Resume Tips</FooterLink>
            <FooterLink href="/career-advice">Career Advice</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/help">Help Center</FooterLink>
          </FooterColumn>

          {/* Legal */}
          <FooterColumn title="Legal" delay={0.3}>
            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
            <FooterLink href="/cookies">Cookies Policy</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
          </FooterColumn>
        </div>

        <motion.div
          className="border-t border-gray-800 mt-6 pt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500 text-center text-xs">
            &copy; {currentYear} ResumeBuilder. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

// Footer link component
const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li className="mb-1">
    <Link
      href={href}
      className="text-gray-400 hover:text-white transition-colors duration-300 inline-block relative group text-sm"
    >
      <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
        {children}
      </span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 group-hover:w-full transition-all duration-300"></span>
    </Link>
  </li>
);

// Footer column component
const FooterColumn = ({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <h3 className="text-base font-medium mb-3 text-white relative inline-block">
      {title}
      <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-500"></span>
    </h3>
    <ul>{children}</ul>
  </motion.div>
);

// Social icon component
const SocialIcon = ({
  href,
  name,
  children,
}: {
  href: string;
  name: string;
  children: React.ReactNode;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors duration-300 bg-gray-800 hover:bg-primary-800 p-1.5 rounded-full flex items-center justify-center"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <span className="sr-only">{name}</span>
    <svg
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {children}
    </svg>
  </motion.a>
);

export default Footer;
