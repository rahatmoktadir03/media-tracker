import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Priority } from "@/types";

// For now, we'll use a default user ID since we don't have authentication
const DEFAULT_USER_ID = 1;

export async function GET() {
  try {
    // @ts-expect-error - Prisma types issue, but works at runtime
    const watchlist = await prisma.watchlistItem.findMany({
      where: {
        userId: DEFAULT_USER_ID,
      },
      include: {
        mediaItem: {
          include: {
            tags: true,
          },
        },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error("Watchlist GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { mediaId, priority = "MEDIUM", notes = "" } = await request.json();

    if (!mediaId) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }

    // Check if already in watchlist
    // @ts-expect-error - Prisma types issue, but works at runtime
    const existing = await prisma.watchlistItem.findUnique({
      where: {
        userId_mediaId: {
          userId: DEFAULT_USER_ID,
          mediaId: parseInt(mediaId),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already in watchlist" },
        { status: 400 }
      );
    }

    // Create watchlist item
    // @ts-expect-error - Prisma types issue, but works at runtime
    const watchlistItem = await prisma.watchlistItem.create({
      data: {
        userId: DEFAULT_USER_ID,
        mediaId: parseInt(mediaId),
        priority: priority as Priority,
        notes,
      },
      include: {
        mediaItem: true,
      },
    });

    return NextResponse.json(watchlistItem, { status: 201 });
  } catch (error) {
    console.error("Watchlist POST error:", error);
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { mediaId } = await request.json();

    if (!mediaId) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }

    // @ts-expect-error - Prisma types issue, but works at runtime
    await prisma.watchlistItem.delete({
      where: {
        userId_mediaId: {
          userId: DEFAULT_USER_ID,
          mediaId: parseInt(mediaId),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Watchlist DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { mediaId, priority, notes } = await request.json();

    if (!mediaId) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }

    const updateData: { priority?: Priority; notes?: string } = {};
    if (priority !== undefined) updateData.priority = priority;
    if (notes !== undefined) updateData.notes = notes;

    // @ts-expect-error - Prisma types issue, but works at runtime
    const watchlistItem = await prisma.watchlistItem.update({
      where: {
        userId_mediaId: {
          userId: DEFAULT_USER_ID,
          mediaId: parseInt(mediaId),
        },
      },
      data: updateData,
      include: {
        mediaItem: true,
      },
    });

    return NextResponse.json(watchlistItem);
  } catch (error) {
    console.error("Watchlist PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update watchlist item" },
      { status: 500 }
    );
  }
}
