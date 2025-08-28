"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import MediaGrid from "@/components/media/MediaGrid";
import { MediaItem } from "@/types";
import Link from "next/link";

interface FavoriteItem {
  id: number;
  mediaItem: MediaItem;
  createdAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const favoriteMedia = favorites.map((fav) => fav.mediaItem);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Favorites ❤️
          </h1>
          <p className="text-lg text-gray-600">
            All the media you&apos;ve marked as favorites
          </p>
        </div>

        {/* Stats */}
        {!loading && favorites.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {favorites.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Favorites</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {new Set(favorites.map((f) => f.mediaItem.type)).size}
                  </div>
                  <div className="text-sm text-gray-600">Media Types</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(
                      (favorites.reduce(
                        (acc, f) => acc + (f.mediaItem.rating || 0),
                        0
                      ) /
                        favorites.length) *
                        10
                    ) / 10 || 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Favorites Grid */}
        {loading ? (
          <MediaGrid
            media={[]}
            loading={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        ) : favorites.length > 0 ? (
          <MediaGrid
            media={favoriteMedia}
            loading={false}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            emptyMessage="You haven't favorited any media yet."
          />
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center text-4xl">
                💔
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Favorites Yet
              </h3>
              <p className="text-gray-600 mb-8">
                Start building your favorites collection by adding hearts to
                media you love!
              </p>

              <div className="space-y-4">
                <Button className="bg-gradient-to-r from-red-500 to-pink-500">
                  <Link href="/" className="text-white">
                    ❤️ Explore Your Library
                  </Link>
                </Button>
                <div className="text-sm text-gray-500">
                  <p>
                    Tip: Click the heart icon on any media card to add it to
                    favorites
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
