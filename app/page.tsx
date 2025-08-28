"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MediaItem } from "@/types";
import MediaGrid from "@/components/media/MediaGrid";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface DashboardStats {
  totalMedia: number;
  totalBooks: number;
  totalMovies: number;
  totalShows: number;
  totalGames: number;
  recentlyAdded: MediaItem[];
  topRated: MediaItem[];
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Hero Section Skeleton */}
            <div className="text-center py-12">
              <div className="h-12 bg-gray-200 rounded-lg w-1/2 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-48 mx-auto"></div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>

            {/* Recent Media Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center py-12 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Your Media{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Universe
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track, rate, and organize all your favorite movies, shows, books,
            games, and more in one beautiful place.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/add-media" className="text-white">
                ➕ Add Your First Media
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/search">🔍 Explore Library</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">
                      Total Media
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {stats.totalMedia}
                    </p>
                  </div>
                  <div className="text-3xl">📚</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">Movies</p>
                    <p className="text-3xl font-bold text-red-900">
                      {stats.totalMovies}
                    </p>
                  </div>
                  <div className="text-3xl">🎬</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Books</p>
                    <p className="text-3xl font-bold text-green-900">
                      {stats.totalBooks}
                    </p>
                  </div>
                  <div className="text-3xl">📖</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Shows</p>
                    <p className="text-3xl font-bold text-purple-900">
                      {stats.totalShows}
                    </p>
                  </div>
                  <div className="text-3xl">📺</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recently Added Section */}
        {stats && stats.recentlyAdded.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recently Added
                </h2>
                <p className="text-gray-600">
                  Your latest additions to the library
                </p>
              </div>
              <Button variant="outline">
                <Link href="/media">View All</Link>
              </Button>
            </div>

            <MediaGrid
              media={stats.recentlyAdded.slice(0, 8)}
              loading={false}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showViewToggle={false}
              onMediaDeleted={fetchDashboardData}
            />
          </div>
        )}

        {/* Top Rated Section */}
        {stats && stats.topRated.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Top Rated</h2>
                <p className="text-gray-600">Your highest rated media</p>
              </div>
              <Button variant="outline">
                <Link href="/stats">View Stats</Link>
              </Button>
            </div>

            <MediaGrid
              media={stats.topRated.slice(0, 8)}
              loading={false}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showViewToggle={false}
              onMediaDeleted={fetchDashboardData}
            />
          </div>
        )}

        {/* Empty State */}
        {stats && stats.totalMedia === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-4xl">
                🎭
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Start Your Media Journey
              </h3>
              <p className="text-gray-600 mb-8">
                Begin tracking your favorite movies, shows, books, and games.
                Build your personal media library and never forget what
                you&apos;ve enjoyed!
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <Button className="bg-gradient-to-r from-red-500 to-red-600">
                  <Link href="/add-media?type=MOVIE" className="text-white">
                    🎬 Add Movie
                  </Link>
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-green-600">
                  <Link href="/add-media?type=BOOK" className="text-white">
                    📚 Add Book
                  </Link>
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
                  <Link href="/add-media?type=SHOW" className="text-white">
                    📺 Add Show
                  </Link>
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600">
                  <Link href="/add-media?type=GAME" className="text-white">
                    🎮 Add Game
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline">
              <Link href="/search">🔍 Search Media</Link>
            </Button>
            <Button variant="outline">
              <Link href="/favorites">❤️ View Favorites</Link>
            </Button>
            <Button variant="outline">
              <Link href="/watchlist">📚 Watchlist</Link>
            </Button>
            <Button variant="outline">
              <Link href="/stats">📊 Statistics</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
