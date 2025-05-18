"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useAppSelector } from "@/app/lib/store";
import { selectIsAuthenticated } from "@/app/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Components
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import FeatureCard from "@/app/components/home/FeatureCard";
import TestimonialCard from "@/app/components/home/TestimonialCard";
import FAQAccordion from "@/app/components/home/FAQAccordion";

export default function Home() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();

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

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.02]"></div>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-100 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary-100 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="md:w-1/2 mb-8 md:mb-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
              }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Create <span className="gradient-text">Professional</span>{" "}
                Resumes in Minutes
              </h1>
              <p className="text-base md:text-lg mb-6 text-gray-600 max-w-lg">
                Stand out from the crowd with a professionally designed resume
                that gets you noticed by recruiters and hiring managers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/register"
                    className="btn-3d bg-primary-600 text-white font-medium py-2 px-6 rounded-md inline-block"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/templates"
                    className="btn border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium py-2 px-6 rounded-md inline-block"
                  >
                    View Templates
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2 flex justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 0.2 },
                },
              }}
            >
              <div className="relative w-full max-w-md">
                <motion.div
                  className="bg-white rounded-md shadow-lg p-3 transform rotate-3 z-20 relative"
                  animate={{ rotate: 3 }}
                  whileHover={{ rotate: 0, transition: { duration: 0.3 } }}
                >
                  <div className="bg-gray-100 h-72 rounded"></div>
                </motion.div>
                <motion.div
                  className="absolute top-4 left-4 bg-white rounded-md shadow-lg p-3 transform -rotate-3 z-10"
                  animate={{ rotate: -3 }}
                  whileHover={{ rotate: 0, transition: { duration: 0.3 } }}
                >
                  <div className="bg-gray-100 h-72 rounded"></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-primary-50 opacity-30 transform skew-x-12"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Why Choose Our Resume Builder
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              We provide all the tools you need to create a professional,
              standout resume that helps you land your dream job.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
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

      {/* How It Works Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              How It Works
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Creating a professional resume has never been easier. Just follow
              these simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 text-primary-600 font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">Choose a Template</h3>
              <p className="text-sm text-gray-600">
                Browse our collection of professionally designed templates and
                choose the one that fits your style.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 text-primary-600 font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">Add Your Content</h3>
              <p className="text-sm text-gray-600">
                Fill in your details, skills, and experience with our
                easy-to-use editor.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 text-primary-600 font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">Download & Apply</h3>
              <p className="text-sm text-gray-600">
                Export your resume in your preferred format and start applying
                for jobs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              What Our Users Say
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what job seekers have
              achieved with our resume builder.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
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

      {/* FAQ Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our resume builder.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              className="text-xl md:text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Create Your Professional Resume?
            </motion.h2>
            <motion.p
              className="text-primary-100 mb-4 text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Join thousands of job seekers who have successfully landed their
              dream jobs with our resume builder.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/register"
                className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-1.5 px-5 rounded-md inline-block text-sm"
              >
                Get Started Free
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
