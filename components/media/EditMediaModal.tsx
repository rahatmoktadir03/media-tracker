"use client";

import React, { useState, useEffect } from "react";
import { MediaItem, MediaType, MediaStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { useEditMedia } from "@/lib/hooks";

interface EditMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem;
  onSuccess?: () => void;
}

export default function EditMediaModal({
  isOpen,
  onClose,
  media,
  onSuccess,
}: EditMediaModalProps) {
  const { editMedia, loading } = useEditMedia();
  const [formData, setFormData] = useState({
    title: "",
    type: "MOVIE",
    genre: "",
    year: "",
    rating: "",
    status: "RELEASED",
    description: "",
    director: "",
    author: "",
    duration: "",
    pages: "",
    seasons: "",
    episodes: "",
    imdbId: "",
    tmdbId: "",
    isbn: "",
    poster: "",
  });

  useEffect(() => {
    if (media) {
      setFormData({
        title: media.title || "",
        type: media.type || "MOVIE",
        genre: media.genre || "",
        year: media.year?.toString() || "",
        rating: media.rating?.toString() || "",
        status: media.status || "RELEASED",
        description: media.description || "",
        director: media.director || "",
        author: media.author || "",
        duration: media.duration?.toString() || "",
        pages: media.pages?.toString() || "",
        seasons: media.seasons?.toString() || "",
        episodes: media.episodes?.toString() || "",
        imdbId: media.imdbId || "",
        tmdbId: media.tmdbId || "",
        isbn: media.isbn || "",
        poster: media.poster || "",
      });
    }
  }, [media]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updateData = {
        title: formData.title,
        type: formData.type as MediaType,
        genre: formData.genre,
        year: formData.year ? parseInt(formData.year) : undefined,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        status: formData.status as MediaStatus,
        description: formData.description,
        director: formData.director,
        author: formData.author,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        seasons: formData.seasons ? parseInt(formData.seasons) : undefined,
        episodes: formData.episodes ? parseInt(formData.episodes) : undefined,
        imdbId: formData.imdbId,
        tmdbId: formData.tmdbId,
        isbn: formData.isbn,
        poster: formData.poster,
      };

      await editMedia(media.id, updateData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update media:", error);
      alert("Failed to update media item. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Media</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MOVIE">Movie</option>
                <option value="TV_SHOW">TV Show</option>
                <option value="BOOK">Book</option>
              </select>
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium mb-1">
                Genre
              </label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Action, Drama, Comedy"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium mb-1"
                >
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium mb-1"
                >
                  Rating (1-10)
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="RELEASED">Released</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
            </div>

            {/* Conditional fields based on type */}
            {formData.type === "MOVIE" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="director"
                    className="block text-sm font-medium mb-1"
                  >
                    Director
                  </label>
                  <input
                    type="text"
                    id="director"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium mb-1"
                  >
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {formData.type === "TV_SHOW" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="seasons"
                    className="block text-sm font-medium mb-1"
                  >
                    Seasons
                  </label>
                  <input
                    type="number"
                    id="seasons"
                    name="seasons"
                    value={formData.seasons}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="episodes"
                    className="block text-sm font-medium mb-1"
                  >
                    Episodes
                  </label>
                  <input
                    type="number"
                    id="episodes"
                    name="episodes"
                    value={formData.episodes}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {formData.type === "BOOK" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium mb-1"
                  >
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pages"
                    className="block text-sm font-medium mb-1"
                  >
                    Pages
                  </label>
                  <input
                    type="number"
                    id="pages"
                    name="pages"
                    value={formData.pages}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="poster"
                className="block text-sm font-medium mb-1"
              >
                Poster URL
              </label>
              <input
                type="url"
                id="poster"
                name="poster"
                value={formData.poster}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Updating..." : "Update Media"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
