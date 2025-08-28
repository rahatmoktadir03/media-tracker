"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Link from "next/link";

interface Collection {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  _count: {
    items: number;
  };
  items: Array<{
    mediaItem: {
      id: number;
      title: string;
      type: string;
      poster?: string;
      rating?: number;
    };
  }>;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/collections");
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    if (!newCollection.name.trim()) return;

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCollection),
      });

      if (response.ok) {
        const createdCollection = await response.json();
        setCollections([createdCollection, ...collections]);
        setNewCollection({ name: "", description: "" });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Collections 🗂️
          </h1>
          <p className="text-lg text-gray-600">
            Organize your media into custom collections
          </p>
        </div>

        {/* Create Collection Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          >
            {showCreateForm ? "❌ Cancel" : "➕ New Collection"}
          </Button>
        </div>

        {/* Create Collection Form */}
        {showCreateForm && (
          <Card className="mb-8 max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Create New Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Collection name"
                value={newCollection.name}
                onChange={(e) =>
                  setNewCollection({ ...newCollection, name: e.target.value })
                }
              />
              <Textarea
                placeholder="Description (optional)"
                value={newCollection.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewCollection({
                    ...newCollection,
                    description: e.target.value,
                  })
                }
              />
              <Button
                onClick={createCollection}
                disabled={!newCollection.name.trim()}
                className="w-full"
              >
                Create Collection
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Collections Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card
                key={collection.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Link href={`/collections/${collection.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {collection.name}
                      </CardTitle>
                      <Badge variant="secondary">
                        {collection._count.items} items
                      </Badge>
                    </div>
                    {collection.description && (
                      <p className="text-gray-600 text-sm">
                        {collection.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {collection.items.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">
                          Recent items:
                        </h4>
                        <div className="space-y-1">
                          {collection.items.slice(0, 3).map((item) => (
                            <div
                              key={item.mediaItem.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {item.mediaItem.type.replace("_", " ")}
                              </span>
                              <span className="text-gray-700 truncate">
                                {item.mediaItem.title}
                              </span>
                              {item.mediaItem.rating && (
                                <span className="text-yellow-500">
                                  {"⭐".repeat(item.mediaItem.rating)}
                                </span>
                              )}
                            </div>
                          ))}
                          {collection.items.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{collection.items.length - 3} more items
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-2xl mb-2">📦</div>
                        <p className="text-sm text-gray-500">
                          No items yet. Start adding media to this collection!
                        </p>
                      </div>
                    )}
                    <div className="mt-4 text-xs text-gray-400">
                      Created{" "}
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-4xl">
                🗂️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Collections Yet
              </h3>
              <p className="text-gray-600 mb-8">
                Create your first collection to organize your media into themed
                groups!
              </p>

              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                🎨 Create Your First Collection
              </Button>

              <div className="mt-6 text-sm text-gray-500">
                <p>Ideas: Favorites, To Watch, Classics, Horror Movies, etc.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
