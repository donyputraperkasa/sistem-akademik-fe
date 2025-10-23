"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getUserFromToken = useAuthStore((state) => state.getUserFromToken);

  // ✅ Saat layout dimuat (refresh/pindah page), ambil token & isi user Zustand
  useEffect(() => {
    getUserFromToken();
  }, [getUserFromToken]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Head>
          <title>Sistem Akademik</title>
          <meta name="description" content="Sistem Informasi Akademik SMP BOSA" />
        </Head>
        {children}
      </body>
    </html>
  );
}