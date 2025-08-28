"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import MediaGrid from "@/components/media/MediaGrid";
import { MediaItem, Priority } from "@/types";
import { getPriorityColor } from "@/lib/utils";
import Link from "next/link";

interface WatchlistItem {
  id: number;
  mediaItem: MediaItem;
  priority: Priority;
  notes?: string;
  createdAt: string;
}

const priorityOrder: Record<Priority, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterPriority, setFilterPriority] = useState<Priority | "ALL">("ALL");

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/watchlist");
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data);
      }
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWatchlist =
    filterPriority === "ALL"
      ? watchlist
      : watchlist.filter((item) => item.priority === filterPriority);

  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const watchlistMedia = sortedWatchlist.map((item) => item.mediaItem);

  const priorityStats = {
    URGENT: watchlist.filter((item) => item.priority === "URGENT").length,
    HIGH: watchlist.filter((item) => item.priority === "HIGH").length,
    MEDIUM: watchlist.filter((item) => item.priority === "MEDIUM").length,
    LOW: watchlist.filter((item) => item.priority === "LOW").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Watchlist 📚
          </h1>
          <p className="text-lg text-gray-600">
            Media you plan to watch, read, or play
          </p>
        </div>

        {/* Priority Filter & Stats */}
        {!loading && watchlist.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              {/* Priority Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {watchlist.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {priorityStats.URGENT}
                  </div>
                  <div className="text-sm text-gray-600">Urgent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {priorityStats.HIGH}
                  </div>
                  <div className="text-sm text-gray-600">High</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {priorityStats.MEDIUM}
                  </div>
                  <div className="text-sm text-gray-600">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {priorityStats.LOW}
                  </div>
                  <div className="text-sm text-gray-600">Low</div>
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Filter by Priority:
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={filterPriority === "ALL" ? "secondary" : "default"}
                    className="cursor-pointer"
                    onClick={() => setFilterPriority("ALL")}
                  >
                    All ({watchlist.length})
                  </Badge>
                  {Object.entries(priorityStats).map(([priority, count]) => (
                    <Badge
                      key={priority}
                      variant={
                        filterPriority === priority ? "secondary" : "default"
                      }
                      className={`cursor-pointer ${getPriorityColor(priority)}`}
                      onClick={() => setFilterPriority(priority as Priority)}
                    >
                      {priority} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Watchlist Grid */}
        {loading ? (
          <MediaGrid
            media={[]}
            loading={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        ) : watchlist.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredWatchlist.length} of {watchlist.length} items
              {filterPriority !== "ALL" &&
                ` • Filtered by ${filterPriority} priority`}
            </div>

            <MediaGrid
              media={watchlistMedia}
              loading={false}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              emptyMessage={`No ${filterPriority.toLowerCase()} priority items in your watchlist.`}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-4xl">
                📋
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Empty Watchlist
              </h3>
              <p className="text-gray-600 mb-8">
                Start building your watchlist by adding media you want to enjoy
                later!
              </p>

              <div className="space-y-4">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                  <Link href="/" className="text-white">
                    📚 Explore Your Library
                  </Link>
                </Button>
                <div className="text-sm text-gray-500">
                  <p>
                    Tip: Click the bookmark icon on any media card to add it to
                    your watchlist
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
