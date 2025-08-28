"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMediaPage() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to create media item"
        );
      }

      const result = await response.json();
      console.log("Created media item:", result);
      router.push("/");
    } catch (err: unknown) {
      console.error("Error creating media:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create media item";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Add New Media</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
            <label htmlFor="year" className="block text-sm font-medium mb-1">
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
            <label htmlFor="rating" className="block text-sm font-medium mb-1">
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
          <label htmlFor="status" className="block text-sm font-medium mb-1">
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
              <label htmlFor="pages" className="block text-sm font-medium mb-1">
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
          <label htmlFor="poster" className="block text-sm font-medium mb-1">
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

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Add Media"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
