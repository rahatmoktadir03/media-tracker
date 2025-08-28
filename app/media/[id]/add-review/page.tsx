"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";

export default function AddReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/add-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mediaId: Number(resolvedParams.id),
        rating,
        comment,
      }),
    });

    if (res.ok) {
      router.push(`/media/${resolvedParams.id}`);
    } else {
      alert("Error adding review");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Rating (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            title="Rating"
            placeholder="Enter a rating from 1 to 5"
          />
        </div>
        <div>
          <label className="block font-medium">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Write your review here..."
            title="Comment"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
