"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MediaType } from "@/types";

interface MediaStats {
  totalMedia: number;
  favoriteCount: number;
  watchlistCount: number;
  collectionCount: number;
  tagCount: number;
  reviewCount: number;
  byType: Record<MediaType, number>;
  byStatus: Record<string, number>;
  byRating: Record<number, number>;
  monthlyActivity: Array<{
    month: string;
    count: number;
  }>;
  topGenres: Array<{
    genre: string;
    count: number;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }>;
}

const typeIcons: Record<MediaType, string> = {
  MOVIE: "🎬",
  TV_SHOW: "📺",
  BOOK: "📚",
  PODCAST: "🎧",
  VIDEO_GAME: "🎮",
  AUDIOBOOK: "🎵",
  DOCUMENTARY: "📽️",
  ANIME: "🎌",
  MANGA: "📖",
};

export default function StatsPage() {
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"all" | "6months" | "1year">(
    "all"
  );

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stats?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Your Stats 📊
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Stats Unavailable
            </h1>
            <p className="text-gray-600">
              Unable to load your statistics at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Stats 📊
          </h1>
          <p className="text-lg text-gray-600">
            Track your media consumption and discovery patterns
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={timeRange === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTimeRange("all")}
            >
              All Time
            </Button>
            <Button
              variant={timeRange === "1year" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTimeRange("1year")}
            >
              Past Year
            </Button>
            <Button
              variant={timeRange === "6months" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTimeRange("6months")}
            >
              Past 6 Months
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalMedia}
              </div>
              <div className="text-sm text-gray-600">Total Media</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.favoriteCount}
              </div>
              <div className="text-sm text-gray-600">Favorites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.watchlistCount}
              </div>
              <div className="text-sm text-gray-600">Watchlist</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.collectionCount}
              </div>
              <div className="text-sm text-gray-600">Collections</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.tagCount}
              </div>
              <div className="text-sm text-gray-600">Tags</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-teal-600">
                {stats.reviewCount}
              </div>
              <div className="text-sm text-gray-600">Reviews</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Media by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Media by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.byType)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {typeIcons[type as MediaType]}
                        </span>
                        <span className="font-medium">
                          {type.replace("_", " ")}
                        </span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Genres */}
          <Card>
            <CardHeader>
              <CardTitle>Top Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topGenres.slice(0, 8).map((genre, index) => (
                  <div
                    key={genre.genre}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">#{index + 1}</span>
                      <span className="font-medium">{genre.genre}</span>
                    </div>
                    <Badge variant="secondary">{genre.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.byRating)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([rating, count]) => (
                  <div key={rating} className="text-center">
                    <div className="text-xl mb-2">
                      {"⭐".repeat(Number(rating))}
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {count}
                    </div>
                    <div className="text-sm text-gray-600">
                      {rating} Star{Number(rating) !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.monthlyActivity.map((month) => (
                <div
                  key={month.month}
                  className="text-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-lg font-bold text-blue-600">
                    {month.count}
                  </div>
                  <div className="text-sm text-gray-600">{month.month}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.unlocked
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                    {achievement.unlocked && (
                      <Badge
                        variant="secondary"
                        className="mt-2 bg-yellow-100 text-yellow-800"
                      >
                        Unlocked! 🎉
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
