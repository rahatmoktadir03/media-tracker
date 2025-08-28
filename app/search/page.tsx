"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import MediaGrid from "@/components/media/MediaGrid";
import { useSearch, useDebounce } from "@/lib/hooks";
import { MediaType, MediaFilter, MediaSort } from "@/types";

const mediaTypes = [
  { value: "MOVIE", label: "🎬 Movies", color: "text-red-600" },
  { value: "SHOW", label: "📺 TV Shows", color: "text-blue-600" },
  { value: "BOOK", label: "📚 Books", color: "text-green-600" },
  { value: "DOCUMENTARY", label: "🎞️ Documentaries", color: "text-purple-600" },
  { value: "GAME", label: "🎮 Games", color: "text-pink-600" },
  { value: "ANIME", label: "🎌 Anime", color: "text-orange-600" },
  { value: "MANGA", label: "📖 Manga", color: "text-teal-600" },
  { value: "PODCAST", label: "🎙️ Podcasts", color: "text-yellow-600" },
  { value: "AUDIOBOOK", label: "🎧 Audiobooks", color: "text-indigo-600" },
];

const sortOptions = [
  { value: "createdAt-desc", label: "Recently Added" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "year-desc", label: "Year (Newest)" },
  { value: "year-asc", label: "Year (Oldest)" },
  { value: "rating-desc", label: "Rating (Highest)" },
  { value: "rating-asc", label: "Rating (Lowest)" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { results, loading, search, clearResults } = useSearch();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<MediaFilter>({
    type: [],
    genre: [],
    year: {},
    rating: {},
    status: [],
    tags: [],
  });
  const [sort, setSort] = useState<MediaSort>({
    field: "createdAt",
    direction: "desc",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (
      debouncedQuery ||
      Object.values(filters).some((f) =>
        Array.isArray(f) ? f.length > 0 : Object.keys(f || {}).length > 0
      )
    ) {
      search(debouncedQuery, filters, sort);
    } else {
      clearResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, filters, sort]); // search and clearResults are memoized with useCallback

  const handleTypeFilter = (type: MediaType) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type?.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...(prev.type || []), type],
    }));
  };

  const handleSortChange = (sortValue: string) => {
    const [field, direction] = sortValue.split("-");
    setSort({
      field: field as "title" | "year" | "rating" | "createdAt" | "updatedAt",
      direction: direction as "asc" | "desc",
    });
  };

  const handleMediaDeleted = () => {
    // Re-run the search to refresh results after deletion
    if (
      debouncedQuery ||
      Object.values(filters).some((f) =>
        Array.isArray(f) ? f.length > 0 : Object.keys(f || {}).length > 0
      )
    ) {
      search(debouncedQuery, filters, sort);
    }
  };

  const clearAllFilters = () => {
    setQuery("");
    setFilters({
      type: [],
      genre: [],
      year: {},
      rating: {},
      status: [],
      tags: [],
    });
    setSort({ field: "createdAt", direction: "desc" });
    clearResults();
  };

  const hasActiveFilters =
    query ||
    (filters.type && filters.type.length > 0) ||
    Object.values(filters).some((f) =>
      Array.isArray(f) ? f.length > 0 : Object.keys(f).length > 0
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Your Library
          </h1>
          <p className="text-gray-600">
            Find exactly what you&apos;re looking for in your media collection
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by title, description, director, author..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  leftIcon={<span className="text-gray-400">🔍</span>}
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-blue-50 text-blue-600" : ""}
              >
                🎛️ Filters
              </Button>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters}>
                  ✕ Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6 space-y-6">
              {/* Media Types */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Media Types</h3>
                <div className="flex flex-wrap gap-2">
                  {mediaTypes.map((type) => (
                    <Badge
                      key={type.value}
                      variant={
                        filters.type?.includes(type.value as MediaType)
                          ? "secondary"
                          : "default"
                      }
                      className={`cursor-pointer hover:scale-105 transition-transform ${
                        filters.type?.includes(type.value as MediaType)
                          ? type.color
                          : ""
                      }`}
                      onClick={() => handleTypeFilter(type.value as MediaType)}
                    >
                      {type.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year From
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 2020"
                    value={filters.year?.min || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        year: {
                          ...prev.year,
                          min: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year To
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 2024"
                    value={filters.year?.max || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        year: {
                          ...prev.year,
                          max: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Rating Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Rating
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="e.g., 7.5"
                    value={filters.rating?.min || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        rating: {
                          ...prev.rating,
                          min: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Rating
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="e.g., 10"
                    value={filters.rating?.max || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        rating: {
                          ...prev.rating,
                          max: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sort and View Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              value={`${sort.field}-${sort.direction}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Sort order"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {results && (
            <p className="text-sm text-gray-600">
              {results.total} result{results.total !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Results */}
        {!hasActiveFilters ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                🔍
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Start Searching
              </h3>
              <p className="text-gray-600 mb-6">
                Enter a search term or use filters to find media in your library
              </p>
            </div>
          </div>
        ) : loading ? (
          <MediaGrid
            media={[]}
            loading={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        ) : results ? (
          <MediaGrid
            media={results.items}
            loading={false}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onMediaDeleted={handleMediaDeleted}
            emptyMessage="No media found matching your search criteria. Try adjusting your filters or search terms."
          />
        ) : null}

        {/* Pagination (placeholder for future implementation) */}
        {results && results.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600">
                Page {results.page} of {results.totalPages}
              </p>
              {/* Add pagination controls here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
