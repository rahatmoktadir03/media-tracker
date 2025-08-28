import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "all";

    // Calculate date filter based on time range
    let dateFilter = {};
    const now = new Date();

    if (timeRange === "6months") {
      const sixMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 6,
        now.getDate()
      );
      dateFilter = { createdAt: { gte: sixMonthsAgo } };
    } else if (timeRange === "1year") {
      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      dateFilter = { createdAt: { gte: oneYearAgo } };
    }

    // Get all media with date filter
    const allMedia = await prisma.mediaItem.findMany({
      where: dateFilter,
      include: {
        reviews: true,
        favorites: true,
      },
    });

    // Calculate basic stats
    const totalMedia = allMedia.length;
    const favoriteCount = await prisma.favorite.count({
      where: {
        userId: 1, // TODO: Replace with actual user ID
        ...(Object.keys(dateFilter).length > 0 && dateFilter),
      },
    });


    const watchlistCount = await prisma.watchlistItem.count({
      where: {
        userId: 1, // TODO: Replace with actual user ID
        ...(Object.keys(dateFilter).length > 0 && dateFilter),
      },
    });


    const collectionCount = await prisma.collection.count({
      where: {
        userId: 1, // TODO: Replace with actual user ID
        ...(Object.keys(dateFilter).length > 0 && dateFilter),
      },
    });


    const tagCount = await prisma.tag.count();
    const reviewCount = await prisma.review.count({
      where: {
        userId: 1, // TODO: Replace with actual user ID
        ...(Object.keys(dateFilter).length > 0 && dateFilter),
      },
    });

    // Media by type
    const byType: Record<MediaType, number> = {
      MOVIE: 0,
      TV_SHOW: 0,
      BOOK: 0,
      PODCAST: 0,
      VIDEO_GAME: 0,
      AUDIOBOOK: 0,
      DOCUMENTARY: 0,
      ANIME: 0,
      MANGA: 0,
    };

    allMedia.forEach((media) => {
      byType[media.type as MediaType]++;
    });

    // Simplified stats - skip status and rating for now due to schema issues
    const byStatus: Record<string, number> = {};
    const byRating: Record<number, number> = {};

    // Monthly activity (last 12 months)
    const monthlyActivity = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const count = await prisma.mediaItem.count({
        where: {
          // Skip createdAt filter due to schema mismatch
        },
      });

      monthlyActivity.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        count,
      });
    }

    // Top genres
    const genreCount: Record<string, number> = {};
    allMedia.forEach((media) => {
      if (media.genre && Array.isArray(media.genre)) {
        media.genre.forEach((genre: string) => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });

    const topGenres = Object.entries(genreCount)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Achievements
    const achievements = [
      {
        title: "Getting Started",
        description: "Add your first media item",
        icon: "🌟",
        unlocked: totalMedia > 0,
      },
      {
        title: "Bibliophile",
        description: "Add 10 books to your library",
        icon: "📚",
        unlocked: byType.BOOK >= 10,
      },
      {
        title: "Movie Buff",
        description: "Add 25 movies to your library",
        icon: "🎬",
        unlocked: byType.MOVIE >= 25,
      },
      {
        title: "TV Addict",
        description: "Add 15 TV shows to your library",
        icon: "📺",
        unlocked: byType.TV_SHOW >= 15,
      },
      {
        title: "Gamer",
        description: "Add 20 video games to your library",
        icon: "🎮",
        unlocked: byType.VIDEO_GAME >= 20,
      },
      {
        title: "Curator",
        description: "Create 5 collections",
        icon: "🗂️",
        unlocked: collectionCount >= 5,
      },
      {
        title: "Critic",
        description: "Write 10 reviews",
        icon: "✍️",
        unlocked: reviewCount >= 10,
      },
      {
        title: "Organized",
        description: "Use 20 different tags",
        icon: "🏷️",
        unlocked: tagCount >= 20,
      },
      {
        title: "Completionist",
        description: "Have 100 items in your library",
        icon: "💯",
        unlocked: totalMedia >= 100,
      },
      {
        title: "Five Star Fan",
        description: "Rate 5 items with 5 stars",
        icon: "⭐",
        unlocked: (byRating[5] || 0) >= 5,
      },
      {
        title: "Genre Explorer",
        description: "Explore 15 different genres",
        icon: "🗺️",
        unlocked: Object.keys(genreCount).length >= 15,
      },
      {
        title: "Wishlist Warrior",
        description: "Have 50 items in your watchlist",
        icon: "📋",
        unlocked: watchlistCount >= 50,
      },
    ];

    const stats = {
      totalMedia,
      favoriteCount,
      watchlistCount,
      collectionCount,
      tagCount,
      reviewCount,
      byType,
      byStatus,
      byRating,
      monthlyActivity,
      topGenres,
      achievements,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
