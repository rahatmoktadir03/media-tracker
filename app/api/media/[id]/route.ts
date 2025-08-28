import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
        reviews: true,
        favorites: true,
      },
    });

    if (!mediaItem) {
      return NextResponse.json(
        { error: "Media item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(mediaItem);
  } catch (error: unknown) {
    console.error("Error fetching media item:", error);
    return NextResponse.json(
      { error: "Failed to fetch media item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const mediaId = parseInt(resolvedParams.id);
    const body = await request.json();

    console.log("Updating media item with ID:", mediaId, "Data:", body); // Debug log

    const {
      title,
      type,
      genre,
      year,
      rating,
      status,
      description,
      director,
      author,
      duration,
      pages,
      seasons,
      episodes,
      imdbId,
      tmdbId,
      isbn,
      poster,
    } = body;

    // Validate required fields
    if (!title || !type) {
      return NextResponse.json(
        { error: "Title and type are required" },
        { status: 400 }
      );
    }

    // Convert genre array to string if needed
    const genreString = Array.isArray(genre) ? genre.join(", ") : genre || "";

    // Check if media item exists
    const existingMedia = await prisma.mediaItem.findUnique({
      where: { id: mediaId },
    });

    if (!existingMedia) {
      return NextResponse.json(
        { error: "Media item not found" },
        { status: 404 }
      );
    }

    // Update the media item
    const updatedMediaItem = await prisma.mediaItem.update({
      where: { id: mediaId },
      data: {
        title,
        type: type as "MOVIE" | "TV_SHOW" | "BOOK",
        genre: genreString,
        year: year ? parseInt(year) : null,
        rating: rating ? parseFloat(rating) : null,
        status: status || "RELEASED",
        description: description || null,
        director: director || null,
        author: author || null,
        duration: duration ? parseInt(duration) : null,
        pages: pages ? parseInt(pages) : null,
        seasons: seasons ? parseInt(seasons) : null,
        episodes: episodes ? parseInt(episodes) : null,
        imdbId: imdbId || null,
        tmdbId: tmdbId || null,
        isbn: isbn || null,
        poster: poster || null,
      },
      include: {
        reviews: true,
        favorites: true,
      },
    });

    console.log("Updated media item:", updatedMediaItem); // Debug log
    return NextResponse.json(updatedMediaItem, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating media item:", error);

    let errorMessage = "Unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: "Failed to update media item",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const mediaId = parseInt(resolvedParams.id);

    console.log("Deleting media item with ID:", mediaId); // Debug log

    // Check if media item exists
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id: mediaId },
    });

    if (!mediaItem) {
      return NextResponse.json(
        { error: "Media item not found" },
        { status: 404 }
      );
    }

    // Delete the media item (this will cascade delete related records)
    await prisma.mediaItem.delete({
      where: { id: mediaId },
    });

    console.log("Successfully deleted media item:", mediaId); // Debug log
    return NextResponse.json(
      { message: "Media item deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting media item:", error);

    let errorMessage = "Unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code?: string; meta?: unknown };
      console.error("Prisma error details:", {
        code: prismaError.code,
        meta: prismaError.meta,
      });
    }

    return NextResponse.json(
      {
        error: "Failed to delete media item",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
