import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PathoScan | Early Contamination Detection",
  description: "Detect biological contamination instantly with PathoStrip and PathoScan.",
};

import { AuthProvider } from "@/context/auth-context";
import { UserNav } from "@/components/user-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="relative min-h-screen flex flex-col">
            {/* Global Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-panel border-b border-white/5 flex items-center justify-between backdrop-blur-xl bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-medical-blue flex items-center justify-center shadow-lg shadow-medical-blue/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-white"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">PathoScan</span>
              </div>
              <UserNav />
            </header>

            <div className="flex-1 pt-20">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
