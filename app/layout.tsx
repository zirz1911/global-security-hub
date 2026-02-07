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
  title: "Global Security Hub - Directory of Security Agencies Worldwide",
  description: "Comprehensive directory of 150+ security agencies, law enforcement, intelligence services, and government organizations from around the world. Search and explore organizations and their key personnel.",
  keywords: ["security agencies", "law enforcement", "intelligence", "government organizations", "police", "cyber security"],
  authors: [{ name: "Global Security Hub" }],
  openGraph: {
    title: "Global Security Hub",
    description: "Directory of Security Agencies Worldwide",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Security Hub",
    description: "Directory of Security Agencies Worldwide",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
        {children}
      </body>
    </html>
  );
}
