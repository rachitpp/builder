'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useAppSelector } from '@/app/lib/store';
import { selectIsAuthenticated } from '@/app/features/auth/authSlice';
import { useRouter } from 'next/navigation';

// Components
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import FeatureCard from '@/app/components/home/FeatureCard';
import TestimonialCard from '@/app/components/home/TestimonialCard';
import FAQAccordion from '@/app/components/home/FAQAccordion';

export default function Home() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      title: 'Professional Templates',
      description: 'Choose from a variety of professionally designed templates to make your resume stand out.',
      icon: '/images/template-icon.svg',
    },
    {
      title: 'Easy Customization',
      description: 'Easily customize your resume with our intuitive drag-and-drop editor.',
      icon: '/images/customize-icon.svg',
    },
    {
      title: 'ATS-Friendly',
      description: 'Our resumes are designed to pass through Applicant Tracking Systems with ease.',
      icon: '/images/ats-icon.svg',
    },
    {
      title: 'Export Options',
      description: 'Download your resume in multiple formats including PDF, DOCX, and TXT.',
      icon: '/images/export-icon.svg',
    },
    {
      title: 'Privacy Focused',
      description: 'Your data is secure and private - we never share your information with third parties.',
      icon: '/images/privacy-icon.svg',
    },
    {
      title: 'Expert Tips',
      description: 'Get expert tips and suggestions to improve your resume and boost your chances of landing an interview.',
      icon: '/images/tips-icon.svg',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      text: 'Thanks to this resume builder, I was able to land my dream job! The templates are professional and the customization options are endless.',
      avatar: '/images/testimonial-1.jpg',
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Manager',
      text: 'I was struggling to create a resume that highlighted my skills effectively. This platform made it so easy, and I started getting interview calls within days!',
      avatar: '/images/testimonial-2.jpg',
    },
    {
      name: 'Jessica Williams',
      role: 'UX Designer',
      text: 'As a designer, I needed a resume that showcased my creativity while remaining professional. The templates here are perfect for that balance.',
      avatar: '/images/testimonial-3.jpg',
    },
  ];

  const faqItems = [
    {
      question: 'Is this resume builder free to use?',
      answer: 'We offer both free and premium plans. The free plan includes basic templates and features, while our premium plans offer advanced templates, unlimited exports, and more customization options.',
    },
    {
      question: 'Can I download my resume in different formats?',
      answer: 'Yes, you can download your resume in PDF, DOCX, and TXT formats. Premium users have access to additional export options.',
    },
    {
      question: 'Are the resumes created with this builder ATS-friendly?',
      answer: 'Absolutely! All our templates are designed to be ATS-friendly, ensuring your resume gets past automated screening systems.',
    },
    {
      question: 'How can I customize my resume?',
      answer: 'Our intuitive editor allows you to customize every aspect of your resume including fonts, colors, sections, and layout. You can also drag and drop sections to rearrange them.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we take data security seriously. Your information is encrypted and never shared with third parties. You can delete your account and all associated data at any time.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Professional Resumes in Minutes</h1>
            <p className="text-lg md:text-xl mb-8">Stand out from the crowd with a professionally designed resume that gets you noticed by recruiters and hiring managers.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="btn bg-white text-primary-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg">
                Get Started Free
              </Link>
              <Link href="/templates" className="btn border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg">
                View Templates
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-lg shadow-2xl p-4 transform rotate-3">
                <div className="bg-gray-100 h-96 rounded"></div>
              </div>
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-2xl p-4 transform -rotate-3 z-10">
                <div className="bg-gray-100 h-96 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Resume Builder</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide all the tools you need to create a professional, standout resume that helps you land your dream job.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create your professional resume in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Choose a Template</h3>
              <p className="text-gray-600">Select from our library of professional templates.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Add Your Content</h3>
              <p className="text-gray-600">Fill in your details or import from LinkedIn.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Customize Design</h3>
              <p className="text-gray-600">Personalize fonts, colors, and layout.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-xl font-semibold mb-2">Download & Share</h3>
              <p className="text-gray-600">Get your resume in PDF, DOCX, or share online.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/register" className="btn btn-primary py-3 px-8 rounded-lg">
              Create Your Resume Now
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thousands of job seekers have used our platform to create professional resumes and land their dream jobs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                text={testimonial.text}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our resume builder.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Your Professional Resume?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully landed their dream jobs with our resume builder.
          </p>
          <Link href="/register" className="btn bg-white text-primary-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg">
            Get Started Free
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}