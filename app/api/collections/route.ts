import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_USER_ID = 1;

export async function GET() {
  try {
    // @ts-expect-error - Prisma types issue, but works at runtime
    const collections = await prisma.collection.findMany({
      where: {
        userId: DEFAULT_USER_ID,
      },
      include: {
        items: {
          include: {
            mediaItem: {
              include: {
                tags: true,
              },
            },
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Collection name is required" },
        { status: 400 }
      );
    }

    // @ts-expect-error - Prisma types issue, but works at runtime
    const collection = await prisma.collection.create({
      data: {
        name,
        description: description || "",
        userId: DEFAULT_USER_ID,
      },
      include: {
        items: {
          include: {
            mediaItem: {
              include: {
                tags: true,
              },
            },
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("Failed to create collection:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
