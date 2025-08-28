import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getMediaTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    MOVIE: "🎬",
    SHOW: "📺",
    BOOK: "📚",
    DOCUMENTARY: "🎞️",
    PODCAST: "🎙️",
    AUDIOBOOK: "🎧",
    GAME: "🎮",
    ANIME: "🎌",
    MANGA: "📖",
  };
  return icons[type] || "📄";
}

export function getMediaTypeColor(type: string): string {
  const colors: Record<string, string> = {
    MOVIE: "bg-red-100 text-red-800",
    SHOW: "bg-blue-100 text-blue-800",
    BOOK: "bg-green-100 text-green-800",
    DOCUMENTARY: "bg-purple-100 text-purple-800",
    PODCAST: "bg-yellow-100 text-yellow-800",
    AUDIOBOOK: "bg-indigo-100 text-indigo-800",
    GAME: "bg-pink-100 text-pink-800",
    ANIME: "bg-orange-100 text-orange-800",
    MANGA: "bg-teal-100 text-teal-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    URGENT: "bg-red-100 text-red-800",
  };
  return colors[priority] || "bg-gray-100 text-gray-800";
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function getStarRating(rating: number): string {
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return "★".repeat(fullStars) + "☆".repeat(halfStar) + "☆".repeat(emptyStars);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= 1800 && year <= currentYear + 10;
}

export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}
