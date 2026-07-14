// app/layout.tsx or app/rootLayout.tsx depending on your setup
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { Providers } from "./provider";
import { ToastProvider } from "@/components/toast/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aiprepbuddy.com"),
  title: "PrepBuddy AI",
  description:
    "PrepBuddy AI — practice quizzes, coding challenges, and AI mock interviews to get placement-ready.",
  openGraph: {
    title: "PrepBuddy AI",
    description:
      "PrepBuddy AI — practice quizzes, coding challenges, and AI mock interviews to get placement-ready.",
    siteName: "PrepBuddy AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepBuddy AI",
    description:
      "PrepBuddy AI — practice quizzes, coding challenges, and AI mock interviews to get placement-ready.",
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
        <Providers>
          <ToastProvider>{children}</ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
