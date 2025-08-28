import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mediaId, rating, comment } = body;

    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        mediaId: Number(mediaId),
        userId: 1, // temp hardcoded user (auth comes later)
      },
    });

    return NextResponse.json(review);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 }
    );
  }
}
