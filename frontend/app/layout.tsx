import './globals.css';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Resume Builder - Create professional resumes',
  description: 'Create professional resumes with our easy-to-use builder. Choose from various templates and customize your resume in minutes.',
  keywords: 'resume, resume builder, cv, curriculum vitae, job application, career, professional resume',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}