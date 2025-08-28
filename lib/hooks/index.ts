"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MediaItem,
  MediaFilter,
  MediaSort,
  SearchResults,
  WatchlistItem,
} from "@/types";

export function useMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/media");
      if (!response.ok) throw new Error("Failed to fetch media");
      const data = await response.json();
      setMedia(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return { media, loading, error, refetch: fetchMedia };
}

export function useSearch() {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (
      query: string,
      filters?: MediaFilter,
      sort?: MediaSort,
      page = 1,
      limit = 20
    ) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          q: query,
          page: page.toString(),
          limit: limit.toString(),
        });

        if (filters) {
          if (filters.type?.length)
            params.append("type", filters.type.join(","));
          if (filters.genre?.length)
            params.append("genre", filters.genre.join(","));
          if (filters.year?.min)
            params.append("yearMin", filters.year.min.toString());
          if (filters.year?.max)
            params.append("yearMax", filters.year.max.toString());
          if (filters.rating?.min)
            params.append("ratingMin", filters.rating.min.toString());
          if (filters.rating?.max)
            params.append("ratingMax", filters.rating.max.toString());
          if (filters.status?.length)
            params.append("status", filters.status.join(","));
          if (filters.tags?.length)
            params.append("tags", filters.tags.join(","));
        }

        if (sort) {
          params.append("sortBy", sort.field);
          params.append("sortDir", sort.direction);
        }

        const response = await fetch(`/api/search?${params}`);
        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(
          new Set(data.map((fav: { mediaId: number }) => fav.mediaId))
        );
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const toggleFavorite = async (mediaId: number) => {
    setLoading(true);
    try {
      const isFavorite = favorites.has(mediaId);
      const response = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
      });

      if (response.ok) {
        setFavorites((prev) => {
          const newSet = new Set(prev);
          if (isFavorite) {
            newSet.delete(mediaId);
          } else {
            newSet.add(mediaId);
          }
          return newSet;
        });
        return !isFavorite;
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setLoading(false);
    }
    return favorites.has(mediaId);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return { favorites, loading, toggleFavorite, refetch: fetchFavorites };
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/watchlist");
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data);
      }
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (
    mediaId: number,
    priority = "MEDIUM",
    notes = ""
  ) => {
    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, priority, notes }),
      });

      if (response.ok) {
        fetchWatchlist();
        return true;
      }
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
    }
    return false;
  };

  const removeFromWatchlist = async (mediaId: number) => {
    try {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
      });

      if (response.ok) {
        fetchWatchlist();
        return true;
      }
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
    }
    return false;
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    refetch: fetchWatchlist,
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDeleteMedia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMedia = useCallback(async (mediaId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/media/${mediaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to delete media item"
        );
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete media item";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteMedia, loading, error };
}

export function useEditMedia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editMedia = useCallback(
    async (mediaId: number, data: Partial<MediaItem>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/media/${mediaId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.details ||
              errorData.error ||
              "Failed to update media item"
          );
        }

        return await response.json();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update media item";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { editMedia, loading, error };
}
