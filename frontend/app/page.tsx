"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/lib/store";
import { selectIsAuthenticated } from "@/app/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";

// Components
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import FeatureCard from "@/app/components/home/FeatureCard";
import TestimonialCard from "@/app/components/home/TestimonialCard";
import FAQAccordion from "@/app/components/home/FAQAccordion";

export default function Home() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      title: "Professional Templates",
      description:
        "Choose from a variety of professionally designed templates to make your resume stand out.",
      icon: "/images/template-icon.svg",
    },
    {
      title: "Easy Customization",
      description:
        "Easily customize your resume with our intuitive drag-and-drop editor.",
      icon: "/images/customize-icon.svg",
    },
    {
      title: "ATS-Friendly",
      description:
        "Our resumes are designed to pass through Applicant Tracking Systems with ease.",
      icon: "/images/ats-icon.svg",
    },
    {
      title: "Export Options",
      description:
        "Download your resume in multiple formats including PDF, DOCX, and TXT.",
      icon: "/images/export-icon.svg",
    },
    {
      title: "Privacy Focused",
      description:
        "Your data is secure and private - we never share your information with third parties.",
      icon: "/images/privacy-icon.svg",
    },
    {
      title: "Expert Tips",
      description:
        "Get expert tips and suggestions to improve your resume and boost your chances of landing an interview.",
      icon: "/images/tips-icon.svg",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      text: "Thanks to this resume builder, I was able to land my dream job! The templates are professional and the customization options are endless.",
      avatar: "/images/testimonial-1.jpg",
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      text: "I was struggling to create a resume that highlighted my skills effectively. This platform made it so easy, and I started getting interview calls within days!",
      avatar: "/images/testimonial-2.jpg",
    },
    {
      name: "Jessica Williams",
      role: "UX Designer",
      text: "As a designer, I needed a resume that showcased my creativity while remaining professional. The templates here are perfect for that balance.",
      avatar: "/images/testimonial-3.jpg",
    },
  ];

  const faqItems = [
    {
      question: "Is this resume builder free to use?",
      answer:
        "We offer both free and premium plans. The free plan includes basic templates and features, while our premium plans offer advanced templates, unlimited exports, and more customization options.",
    },
    {
      question: "Can I download my resume in different formats?",
      answer:
        "Yes, you can download your resume in PDF, DOCX, and TXT formats. Premium users have access to additional export options.",
    },
    {
      question: "Are the resumes created with this builder ATS-friendly?",
      answer:
        "Absolutely! All our templates are designed to be ATS-friendly, ensuring your resume gets past automated screening systems.",
    },
    {
      question: "How can I customize my resume?",
      answer:
        "Our intuitive editor allows you to customize every aspect of your resume including fonts, colors, sections, and layout. You can also drag and drop sections to rearrange them.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take data security seriously. Your information is encrypted and never shared with third parties. You can delete your account and all associated data at any time.",
    },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Floating scroll indicator */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 hidden md:block"
        style={{ opacity, y }}
      >
        <div className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300">
          <svg
            className="w-6 h-6 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
            />
          </svg>
        </div>
      </motion.div>

      {/* Hero Section - Enhanced */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/90 via-white to-secondary-50/70"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03]"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-accent-blue/10 rounded-full opacity-30 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="md:w-1/2 mb-12 md:mb-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
              }}
            >
              <div className="relative mb-4">
                <span className="inline-block py-1 px-3 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-3">
                  Create • Customize • Succeed
                </span>
                <motion.div
                  className="absolute -left-6 top-0 w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-600"
                  animate={{
                    height: [30, 40, 30],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                ></motion.div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                Create
                <span className="relative inline-block mx-3">
                  <span className="gradient-text">Professional</span>
                  <svg
                    className="absolute -bottom-1 w-full"
                    viewBox="0 0 300 15"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,15 C150,-8 200,25 300,2 L300,15 L0,15 Z"
                      fill="rgba(99, 102, 241, 0.2)"
                    />
                  </svg>
                </span>
                Resumes in Minutes
              </h1>

              <p className="text-base md:text-lg mb-8 text-gray-600 max-w-lg leading-relaxed">
                Stand out from the crowd with a professionally designed resume
                that gets you noticed by recruiters and hiring managers.
                <span className="block mt-2 font-medium text-gray-700">
                  Join over 100,000+ successful job seekers today.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/register"
                    className="btn-3d bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 px-8 rounded-xl shadow-lg inline-flex items-center justify-center group"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <span className="mr-2">Get Started Free</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/templates"
                    className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50/60 font-medium py-3 px-8 rounded-xl inline-flex items-center justify-center group"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                    <span>View Templates</span>
                  </Link>
                </motion.div>
              </div>

              <div className="mt-10 flex items-center space-x-4">
                <div className="flex items-center -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-primary-300 to-primary-600 opacity-80"></div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">1,000+</span> resumes created
                  this week
                </div>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2 flex justify-center md:justify-end"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, delay: 0.2 },
                },
              }}
            >
              <div className="relative w-full max-w-lg">
                {/* Background decoration */}
                <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-dot-pattern opacity-10 z-0"></div>

                {/* Main resume mockup */}
                <motion.div
                  className="bg-white rounded-xl shadow-elevation-3 p-4 z-30 relative"
                  animate={{
                    rotate: isHovering ? 0 : 3,
                    y: isHovering ? -10 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative aspect-[1/1.4142] bg-white rounded-lg overflow-hidden border border-gray-100">
                    <Image
                      src="/images/templates/modern-professional.svg"
                      alt="Resume Template Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute -right-3 -top-3 bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                    Popular
                  </div>
                </motion.div>

                {/* Secondary resume mockup */}
                <motion.div
                  className="absolute top-12 -left-12 w-3/4 bg-white rounded-xl shadow-elevation-2 p-3 z-20"
                  animate={{
                    rotate: isHovering ? -5 : -8,
                    x: isHovering ? -15 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="aspect-[1/1.4142] bg-white rounded-lg overflow-hidden border border-gray-100">
                    <Image
                      src="/images/templates/creative-portfolio.svg"
                      alt="Resume Template Preview"
                      width={300}
                      height={424}
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-secondary-100 z-10"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                ></motion.div>

                <motion.div
                  className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-primary-100 z-10"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.6, 0.8, 0.6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                ></motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats/Social Proof */}
          <motion.div
            className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {[
              { value: "100K+", label: "Users" },
              { value: "250+", label: "Templates" },
              { value: "95%", label: "Success Rate" },
              { value: "4.8/5", label: "User Rating" },
            ].map((stat, index) => (
              <div key={index} className="glass p-4 rounded-xl text-center">
                <div className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-blue">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-50/50 opacity-80 transform skew-x-12"></div>
        <div className="absolute -top-24 left-1/4 w-48 h-48 bg-gradient-to-br from-accent-purple/10 to-accent-blue/5 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute -bottom-24 right-1/3 w-64 h-64 bg-gradient-to-tr from-secondary-200/20 to-secondary-100/5 rounded-full blur-3xl opacity-70"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block py-1 px-3 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-3">
              Powerful Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Resume Builder
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              We provide all the tools you need to create a professional,
              standout resume that helps you land your dream job.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-1/3 bg-dot-pattern opacity-[0.03]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block py-1 px-3 bg-secondary-100 text-secondary-700 text-sm font-medium rounded-full mb-3">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Creating a professional resume has never been easier. Just follow
              these simple steps.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-1/2 top-12 bottom-12 w-1 bg-primary-100 -ml-0.5 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
                <motion.div
                  className="flex flex-col items-center text-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center mb-5 text-white font-bold text-xl z-10 shadow-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3">Choose a Template</h3>
                  <p className="text-gray-600">
                    Browse our collection of professionally designed templates
                    and choose the one that fits your style.
                  </p>
                  <div className="mt-6 w-full h-32 rounded-lg bg-white p-2 shadow-elevation-2">
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center mb-5 text-white font-bold text-xl z-10 shadow-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3">Add Your Content</h3>
                  <p className="text-gray-600">
                    Fill in your details, skills, and experience with our
                    easy-to-use editor.
                  </p>
                  <div className="mt-6 w-full h-32 rounded-lg bg-white p-2 shadow-elevation-2">
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center mb-5 text-white font-bold text-xl z-10 shadow-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3">Download & Apply</h3>
                  <p className="text-gray-600">
                    Export your resume in your preferred format and start
                    applying for jobs.
                  </p>
                  <div className="mt-6 w-full h-32 rounded-lg bg-white p-2 shadow-elevation-2">
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-purple/10 rounded-full opacity-70 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary-100/20 rounded-full opacity-70 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block py-1 px-3 bg-accent-purple/10 text-accent-purple text-sm font-medium rounded-full mb-3">
              User Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what job seekers have
              achieved with our resume builder.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                text={testimonial.text}
                avatar={testimonial.avatar}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-gray-50/50 to-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-dot-pattern opacity-[0.03]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block py-1 px-3 bg-secondary-100 text-secondary-700 text-sm font-medium rounded-full mb-3">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our resume builder.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/30 rounded-full opacity-60 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-blue/20 rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute top-10 left-10 w-1/3 md:w-1/4 h-full bg-dot-pattern opacity-[0.04]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="glass backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Ready to Create Your Professional Resume?
              </h2>
              <p className="text-primary-100 mb-8 text-base md:text-lg max-w-2xl mx-auto">
                Join thousands of job seekers who have successfully landed their
                dream jobs with our resume builder. Get started for free today!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/register"
                    className="bg-white text-primary-700 hover:bg-primary-50 font-medium py-3 px-8 rounded-xl inline-flex items-center justify-center shadow-lg group"
                  >
                    <span className="mr-2">Get Started Free</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/templates"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-xl inline-flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                    <span>View Templates</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
