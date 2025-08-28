"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MediaItem } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EditMediaModal from "@/components/media/EditMediaModal";
import {
  getMediaTypeIcon,
  getMediaTypeColor,
  formatDate,
  formatDuration,
  truncateText,
} from "@/lib/utils";
import { useFavorites, useWatchlist, useDeleteMedia } from "@/lib/hooks";

interface MediaCardProps {
  media: MediaItem;
  showActions?: boolean;
  compact?: boolean;
  onDelete?: () => void; // Callback for when item is deleted
}

export default function MediaCard({
  media,
  showActions = true,
  compact = false,
  onDelete,
}: MediaCardProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { deleteMedia, loading: deleting } = useDeleteMedia();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isFavorite = favorites.has(media.id);
  const isInWatchlist = watchlist.some((item) => item.mediaId === media.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(media.id);
  };

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      await removeFromWatchlist(media.id);
    } else {
      await addToWatchlist(media.id);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleEdit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMedia(media.id);
      setShowDeleteConfirm(false);
      onDelete?.(); // Call the callback to refresh the list
    } catch (error) {
      console.error("Failed to delete media item:", error);
      alert("Failed to delete media item. Please try again.");
    }
  };

  const handleEditSuccess = () => {
    onDelete?.(); // Refresh the list after edit
  };

  if (compact) {
    return (
      <Link href={`/media/${media.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {media.poster ? (
                <div className="relative w-12 h-16 rounded overflow-hidden">
                  <Image
                    src={media.poster}
                    alt={media.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xl">
                  {getMediaTypeIcon(media.type)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {media.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" size="sm">
                    {getMediaTypeIcon(media.type)} {media.type}
                  </Badge>
                  {media.year && (
                    <span className="text-sm text-gray-500">{media.year}</span>
                  )}
                </div>
                {media.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {media.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <Link href={`/media/${media.id}`}>
        <div className="relative">
          {media.poster ? (
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={media.poster}
                alt={media.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-200">
              {getMediaTypeIcon(media.type)}
            </div>
          )}

          <div className="absolute top-3 left-3">
            <Badge className={getMediaTypeColor(media.type)} size="sm">
              {getMediaTypeIcon(media.type)} {media.type}
            </Badge>
          </div>

          {media.rating && (
            <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
              <span className="text-yellow-400 text-xs mr-1">⭐</span>
              {media.rating.toFixed(1)}
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/media/${media.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {media.title}
          </h3>
        </Link>

        <div className="space-y-2 text-sm text-gray-600">
          {media.genre && media.genre.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {media.genre
                .split(", ")
                .slice(0, 3)
                .map((genre: string, index: number) => (
                  <Badge key={`${genre}-${index}`} variant="default" size="sm">
                    {genre.trim()}
                  </Badge>
                ))}
              {media.genre.split(", ").length > 3 && (
                <Badge variant="default" size="sm">
                  +{media.genre.split(", ").length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {media.year && (
              <div className="flex items-center">
                <span className="text-sm mr-1">📅</span>
                {media.year}
              </div>
            )}

            {media.duration && (
              <div className="flex items-center">
                <span className="text-sm mr-1">⏱️</span>
                {formatDuration(media.duration)}
              </div>
            )}
          </div>

          {(media.director || media.author) && (
            <div className="flex items-center">
              <span className="text-sm mr-1">👤</span>
              {media.director || media.author}
            </div>
          )}

          {media.description && (
            <p className="text-gray-700 text-sm line-clamp-2">
              {truncateText(media.description, 100)}
            </p>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={isFavorite ? "text-red-600" : "text-gray-400"}
            >
              <span className={`text-base ${isFavorite ? "" : "grayscale"}`}>
                ❤️
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleWatchlist}
              className={
                isInWatchlist
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-blue-600"
              }
              title={
                isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
              }
            >
              <span className={`text-base ${isInWatchlist ? "" : "grayscale"}`}>
                📚
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-gray-400 hover:text-blue-600"
            >
              <span className="text-base">✏️</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-gray-400 hover:text-red-600"
            >
              <span className="text-base">{deleting ? "⏳" : "🗑️"}</span>
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            Added {formatDate(media.createdAt)}
          </div>
        </CardFooter>
      )}

      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Media"
        message={`Are you sure you want to delete "${media.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <EditMediaModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        media={media}
        onSuccess={handleEditSuccess}
      />
    </Card>
  );
}
