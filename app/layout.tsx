import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediaTracker - Track Your Media Journey",
  description:
    "A comprehensive platform to track, rate, and organize your movies, shows, books, games, and more.",
  keywords:
    "media tracker, movie tracker, book tracker, TV shows, games, entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                © 2024 MediaTracker. Built with ❤️ for media enthusiasts.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
