import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface MediaPageProps {
  params: Promise<{ id: string }>;
}

export default async function MediaPage({ params }: MediaPageProps) {
  const resolvedParams = await params;
  const media = await prisma.mediaItem.findUnique({
    where: { id: Number(resolvedParams.id) },
    include: {
      reviews: true, // fetch reviews for this media
    },
  });

  if (!media) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link href="/" className="text-blue-600 underline mb-4 block">
        ← Back to Media List
      </Link>

      <h1 className="text-3xl font-bold mb-2">{media.title}</h1>
      <p className="text-gray-600 mb-6">
        {media.type} • {media.genre} {media.year && `• ${media.year}`}
      </p>

      <h2 className="text-xl font-semibold mb-2">Reviews</h2>
      {media.reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {media.reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-3 bg-white shadow-sm"
            >
              <p className="font-medium">⭐ {review.rating}/5</p>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/media/${media.id}/add-review`}
        className="inline-block mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Add Review
      </Link>
    </div>
  );
}
