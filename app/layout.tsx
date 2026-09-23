import type { Metadata } from "next";
import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Disclaimer from '@/app/components/Disclaimer';
import ChatWidget from '@/app/components/ChatWidget';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reaus Spa — Concept Redesign & AI Concierge",
  description: "A luxury boutique spa concept offering automated bookings, wellness treatments, and AI concierge assistance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-amber-50/20 text-stone-800">
        <Header />
        <main className="flex-1">{children}</main>
        <ChatWidget />
        <Disclaimer />
        <Footer />
      </body>
    </html>
  );
}
