import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// For now, we'll use a default user ID since we don't have authentication
const DEFAULT_USER_ID = 1;

export async function GET() {
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: DEFAULT_USER_ID,
      },
      include: {
        mediaItem: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Favorites GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { mediaId } = await request.json();

    if (!mediaId) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: DEFAULT_USER_ID,
        mediaId: parseInt(mediaId),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: DEFAULT_USER_ID,
        mediaId: parseInt(mediaId),
      },
      include: {
        mediaItem: true,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Favorites POST error:", error);
    return NextResponse.json(
      { error: "Failed to add to favorites" },
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

    await prisma.favorite.deleteMany({
      where: {
        userId: DEFAULT_USER_ID,
        mediaId: parseInt(mediaId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Favorites DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
