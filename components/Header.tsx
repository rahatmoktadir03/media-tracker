"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Search", href: "/search", icon: "🔍" },
  { name: "Favorites", href: "/favorites", icon: "❤️" },
  { name: "Watchlist", href: "/watchlist", icon: "📚" },
  { name: "Collections", href: "/collections", icon: "🗂️" },
  { name: "Stats", href: "/stats", icon: "📊" },
];

const quickAdd = [
  {
    name: "Movie",
    href: "/add-media?type=MOVIE",
    icon: "🎬",
    color: "text-red-600",
  },
  {
    name: "Show",
    href: "/add-media?type=SHOW",
    icon: "📺",
    color: "text-blue-600",
  },
  {
    name: "Book",
    href: "/add-media?type=BOOK",
    icon: "📚",
    color: "text-green-600",
  },
  {
    name: "Game",
    href: "/add-media?type=GAME",
    icon: "🎮",
    color: "text-purple-600",
  },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform text-white text-sm">
              🎬
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">
              MediaTracker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Add & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Quick Add Dropdown */}
            <div className="relative">
              <button
                onClick={() => setQuickAddOpen(!quickAddOpen)}
                className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <span className="text-base">➕</span>
                <span className="hidden sm:block">Add Media</span>
              </button>

              {quickAddOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setQuickAddOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {quickAdd.map((item) => {
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setQuickAddOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className={cn("text-base", item.color)}>
                            {item.icon}
                          </span>
                          <span>Add {item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <button
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="User menu"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
