export interface MediaItem {
  id: number;
  title: string;
  type: MediaType;
  genre?: string;
  year?: number;
  director?: string;
  author?: string;
  description?: string;
  poster?: string;
  rating?: number;
  duration?: number;
  pages?: number;
  seasons?: number;
  episodes?: number;
  status: MediaStatus;
  imdbId?: string;
  tmdbId?: string;
  isbn?: string;
  createdAt: Date;
  updatedAt: Date;
  reviews?: Review[];
  favorites?: Favorite[];
  tags?: Tag[];
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  isPublic: boolean;
  userId: number;
  mediaId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  mediaItem?: MediaItem;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  id: number;
  userId: number;
  mediaId: number;
  createdAt: Date;
  user?: User;
  mediaItem?: MediaItem;
}

export interface WatchlistItem {
  id: number;
  userId: number;
  mediaId: number;
  priority: Priority;
  notes?: string;
  createdAt: Date;
  user?: User;
  mediaItem?: MediaItem;
}

export interface Collection {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  items?: CollectionItem[];
}

export interface CollectionItem {
  id: number;
  collectionId: number;
  mediaId: number;
  order?: number;
  notes?: string;
  addedAt: Date;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
  createdAt: Date;
}

export enum MediaType {
  BOOK = "BOOK",
  MOVIE = "MOVIE",
  TV_SHOW = "TV_SHOW",
  DOCUMENTARY = "DOCUMENTARY",
  PODCAST = "PODCAST",
  AUDIOBOOK = "AUDIOBOOK",
  VIDEO_GAME = "VIDEO_GAME",
  ANIME = "ANIME",
  MANGA = "MANGA",
}

export enum MediaStatus {
  RELEASED = "RELEASED",
  UPCOMING = "UPCOMING",
  IN_PROGRESS = "IN_PROGRESS",
  CANCELLED = "CANCELLED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface MediaFilter {
  type?: MediaType[];
  genre?: string[];
  year?: { min?: number; max?: number };
  rating?: { min?: number; max?: number };
  status?: MediaStatus[];
  tags?: string[];
}

export interface MediaSort {
  field: "title" | "year" | "rating" | "createdAt" | "updatedAt";
  direction: "asc" | "desc";
}

export interface SearchResults {
  items: MediaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalMedia: number;
  totalReviews: number;
  totalFavorites: number;
  averageRating: number;
  mediaByType: Record<MediaType, number>;
  recentActivity: Array<{
    type: "review" | "favorite" | "watchlist";
    mediaItem: MediaItem;
    createdAt: Date;
  }>;
}
