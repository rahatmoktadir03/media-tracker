"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import MediaGrid from "@/components/media/MediaGrid";
import { MediaItem } from "@/types";

interface Collection {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  items: Array<{
    id: number;
    mediaItem: MediaItem;
    addedAt: string;
  }>;
  _count: {
    items: number;
  };
}

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const router = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const loadCollection = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/collections/${resolvedParams.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Collection not found");
          } else {
            setError("Failed to load collection");
          }
          return;
        }

        const data = await response.json();
        setCollection(data);
      } catch (err) {
        console.error("Error loading collection:", err);
        setError("Failed to load collection");
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [params]);

  const handleDeleteCollection = async () => {
    if (!collection) return;

    if (
      confirm(
        `Are you sure you want to delete "${collection.name}"? This action cannot be undone.`
      )
    ) {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/collections/${resolvedParams.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/collections");
        }
      } catch (err) {
        console.error("Error deleting collection:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Collection Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push("/collections")}>
            Back to Collections
          </Button>
        </div>
      </div>
    );
  }

  if (!collection) {
    return null;
  }

  const mediaItems = collection.items.map((item) => item.mediaItem);

  return (
    <div className="container mx-auto p-6">
      {/* Collection Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {collection.name}
            </h1>
            <p className="text-gray-600 mb-4">{collection.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{collection._count.items} items</span>
              <span>•</span>
              <span>
                Created {new Date(collection.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <Badge variant={collection.isPublic ? "default" : "secondary"}>
                {collection.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/collections")}
            >
              Back to Collections
            </Button>
            <Button variant="outline" onClick={handleDeleteCollection}>
              Delete Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Media Items */}
      {mediaItems.length > 0 ? (
        <MediaGrid
          media={mediaItems}
          loading={false}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onMediaDeleted={() => {
            // Refresh collection when media is deleted
            window.location.reload();
          }}
          emptyMessage="This collection is empty. Add some media to get started!"
        />
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Empty Collection
          </h2>
          <p className="text-gray-600 mb-6">
            This collection doesn&apos;t have any media items yet.
          </p>
          <Button onClick={() => router.push("/")}>Browse Media to Add</Button>
        </div>
      )}
    </div>
  );
}
