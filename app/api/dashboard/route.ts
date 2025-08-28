import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";

export async function GET() {
  try {
    // Get total counts
    const totalMedia = await prisma.mediaItem.count();

    const mediaByType = await prisma.mediaItem.groupBy({
      by: ["type"],
      _count: {
        type: true,
      },
    });

    // Convert to the format we need
    const stats = {
      totalMedia,
      totalMovies:
        mediaByType.find((item) => item.type === MediaType.MOVIE)?._count
          .type || 0,
      totalShows:
        mediaByType.find((item) => item.type === MediaType.TV_SHOW)?._count
          .type || 0,
      totalBooks:
        mediaByType.find((item) => item.type === MediaType.BOOK)?._count.type ||
        0,
      totalGames:
        mediaByType.find((item) => item.type === MediaType.VIDEO_GAME)?._count
          .type || 0,
    };

    // Get recently added media
    const recentlyAdded = await prisma.mediaItem.findMany({
      take: 8,
      orderBy: {
        id: "desc",
      },
    });

    // Get top rated media - simplified due to schema issues
    const topRated = await prisma.mediaItem.findMany({
      take: 8,
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      ...stats,
      recentlyAdded,
      topRated,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
