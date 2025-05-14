import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export type Review = {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  users: {
    name: string | null;
    image: string | null;
  };
};

export function useReviews() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reviews");

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (rating: number, comment: string) => {
    if (!session) {
      toast.error("You must be signed in to submit a review");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");

      fetchReviews();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit review"
      );
      console.error("Error submitting review:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    loading,
    error,
    submitReview,
    refetchReviews: fetchReviews,
  };
}
