"use client";

import React from "react";
import { MediaItem } from "@/types";
import MediaCard from "./MediaCard";
import { Button } from "@/components/ui/Button";

interface MediaGridProps {
  media: MediaItem[];
  loading?: boolean;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  showViewToggle?: boolean;
  emptyMessage?: string;
  className?: string;
  onMediaDeleted?: () => void; // Callback when a media item is deleted
}

export default function MediaGrid({
  media,
  loading = false,
  viewMode = "grid",
  onViewModeChange,
  showViewToggle = true,
  emptyMessage = "No media found. Try adjusting your filters or add some media to get started!",
  className = "",
  onMediaDeleted,
}: MediaGridProps) {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showViewToggle && (
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="flex space-x-2">
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        )}

        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-64 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 text-gray-400">📺</div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Media Found
          </h3>
          <p className="text-gray-500 mb-6">{emptyMessage}</p>
          <Button>
            <a href="/add-media" className="text-white">
              Add Your First Media
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showViewToggle && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {media.length} {media.length === 1 ? "item" : "items"}
          </p>

          {onViewModeChange && (
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="px-3"
              >
                <span className="w-4 h-4">⚏</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="px-3"
              >
                <span className="w-4 h-4">☰</span>
              </Button>
            </div>
          )}
        </div>
      )}

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
            : "space-y-4"
        }
      >
        {media.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            compact={viewMode === "list"}
            onDelete={onMediaDeleted}
          />
        ))}
      </div>
    </div>
  );
}
