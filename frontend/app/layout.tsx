import "./globals.css";
import { Providers } from "./providers";
import { Inter, Poppins, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

// Define fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Resume Builder - Create professional resumes",
  description:
    "Create professional resumes with our easy-to-use builder. Choose from various templates and customize your resume in minutes.",
  keywords:
    "resume, resume builder, cv, curriculum vitae, job application, career, professional resume",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${montserrat.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased">
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
                borderRadius: "8px",
              },
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
