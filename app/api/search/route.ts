import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Filters
    const typeFilter = searchParams.get("type")?.split(",") as MediaType[];
    const genreFilter = searchParams.get("genre")?.split(",");
    const yearMin = searchParams.get("yearMin")
      ? parseInt(searchParams.get("yearMin")!)
      : undefined;
    const yearMax = searchParams.get("yearMax")
      ? parseInt(searchParams.get("yearMax")!)
      : undefined;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "title";
    const sortDir = searchParams.get("sortDir") || "desc";

    // Build where clause
    const where: Prisma.MediaItemWhereInput = {};

    // Text search - simplified to only search title
    if (query) {
      where.OR = [{ title: { contains: query, mode: "insensitive" } }];
    }

    // Type filter
    if (typeFilter && typeFilter.length > 0) {
      where.type = { in: typeFilter };
    }

    // Genre filter - simplified since genre is now a string
    if (genreFilter && genreFilter.length > 0) {
      where.genre = { in: genreFilter };
    }

    // Year filter
    if (yearMin !== undefined || yearMax !== undefined) {
      where.year = {};
      if (yearMin !== undefined) where.year.gte = yearMin;
      if (yearMax !== undefined) where.year.lte = yearMax;
    }

    // Skip rating, status, and tags filters for now due to schema issues

    // Build order by
    const orderBy: Record<string, Prisma.SortOrder> = {
      [sortBy]: sortDir as Prisma.SortOrder,
    };

    // Execute search
    const [items, total] = await Promise.all([
      prisma.mediaItem.findMany({
        where,
        include: {
          reviews: true,
          favorites: true,
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.mediaItem.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search media" },
      { status: 500 }
    );
  }
}
