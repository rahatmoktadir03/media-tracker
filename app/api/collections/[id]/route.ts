import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_USER_ID = 1;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collectionId = parseInt(id);

    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
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

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collectionId = parseInt(id);
    const body = await request.json();
    const { name, description } = body;

    const collection = await prisma.collection.updateMany({
      where: {
        id: collectionId,
        userId: DEFAULT_USER_ID,
      },
      data: {
        name,
        description,
      },
    });

    if (collection.count === 0) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    const updatedCollection = await prisma.collection.findUnique({
      where: { id: collectionId },
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

    return NextResponse.json(updatedCollection);
  } catch (error) {
    console.error("Failed to update collection:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collectionId = parseInt(id);

    const deletedCollection = await prisma.collection.deleteMany({
      where: {
        id: collectionId,
        userId: DEFAULT_USER_ID,
      },
    });

    if (deletedCollection.count === 0) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete collection:", error);
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}
