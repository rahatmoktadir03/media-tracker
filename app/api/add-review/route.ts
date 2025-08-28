import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received review data:", body); // Debug log

    const { mediaId, rating, comment } = body;

    // Validate required fields
    if (!mediaId || !rating) {
      return NextResponse.json(
        { error: "Media ID and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        mediaId: parseInt(mediaId),
        rating: parseInt(rating), // Use parseInt for integer rating
        comment: comment || null,
        isPublic: true, // Default to public
        userId: 1, // TODO: Replace with actual user ID from auth
      },
      include: {
        mediaItem: {
          select: {
            title: true,
            type: true,
          },
        },
      },
    });

    console.log("Created review:", review); // Debug log
    return NextResponse.json(review, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating review:", error);

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
        error: "Failed to create review",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
