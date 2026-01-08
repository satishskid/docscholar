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
  title: "Aiper - The Privacy-First AI Co-Pilot for Medical Research",
  description: "Transform your evidence-based medicine workflow. Aiper unifies discovery, gap analysis, and writing in a zero-retention, secure environment for researchers.",
  keywords: ["medical research AI", "evidence-based medicine", "systematic review automation", "pico search", "medical writing assistant", "privacy-first AI"],
  openGraph: {
    title: "Aiper - The Future of Medical Research",
    description: "Accelerate your discovery with the only AI built for data sovereignty and clinical rigor.",
    url: "https://aiper.io",
    siteName: "Aiper",
    images: [
      {
        url: "/og-image.png", // We'll need to generate this later or use a placeholder
        width: 1200,
        height: 630,
        alt: "Aiper Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aiper - AI for Medical Sovereignty",
    description: "Your research, your data. The privacy-first AI co-pilot.",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
