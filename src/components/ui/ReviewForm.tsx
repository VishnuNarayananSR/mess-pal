"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      alert("Please select a rating");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(rating, comment);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
        <p className="mb-4">Please sign in to leave a review.</p>
        <button
          onClick={() => signIn("google")}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl ${
                  (hoverRating || rating) >= star
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2">
            Your Comments (optional)
          </label>
          <textarea
            id="comment"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with our food and service..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !rating}
          className={`w-full px-4 py-2 rounded-md text-white transition-colors ${
            isSubmitting || !rating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </motion.div>
  );
}
