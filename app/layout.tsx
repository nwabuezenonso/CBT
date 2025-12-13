import type React from "react";
import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AuthProvider } from "@/hooks/use-auth";
// import { Toaster } from "@/components/ui/toaster";

import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CBT Pro - Computer-Based Testing Platform",
  description: "Modern CBT platform for educational institutions",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
