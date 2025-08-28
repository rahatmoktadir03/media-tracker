// src/app/api/media/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const media = await prisma.mediaItem.findMany({
      include: {
        reviews: true,
        favorites: true,
      },
      orderBy: {
        id: "desc",
      },
    });
    return NextResponse.json(media);
  } catch (error) {
    console.error("Media fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received data:", body); // Debug log

    // Extract and validate required fields
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

    // Create media item with only the fields that exist in the schema
    const mediaItem = await prisma.mediaItem.create({
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

    console.log("Created media item:", mediaItem); // Debug log
    return NextResponse.json(mediaItem, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating media item:", error);

    let errorMessage = "Unknown error occurred";
    let errorDetails = {};

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code?: string; meta?: unknown };
      errorDetails = {
        code: prismaError.code,
        meta: prismaError.meta,
      };
    }

    console.error("Error details:", {
      message: errorMessage,
      ...errorDetails,
    });

    return NextResponse.json(
      {
        error: "Failed to create media item",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
