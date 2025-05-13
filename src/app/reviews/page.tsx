"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import ReviewForm from "@/components/ui/ReviewForm";
import ReviewCard from "@/components/ui/ReviewCard";
import { useReviews } from "@/hooks/useReviews";
import { FaStar, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ReviewsPage() {
  const { reviews, loading, submitReview } = useReviews();
  const [filter, setFilter] = useState<number | null>(null);

  // Filter reviews by rating if filter is set
  const filteredReviews = filter
    ? reviews.filter((review) => Math.floor(review.rating) === filter)
    : reviews;

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  // Count reviews for each star rating
  const ratingCounts = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: reviews.filter((r) => Math.floor(r.rating) === rating).length,
  }));

  return (
    <PageContainer
      title="Customer Reviews"
      subtitle="See what our customers have to say about our food and service"
      className="py-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Review Form and Stats */}
        <div className="lg:col-span-1 space-y-6">
          <ReviewForm onSubmit={submitReview} />

          {/* Review Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Review Statistics</h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-orange-500 text-2xl" />
              </div>
            ) : (
              <>
                <div className="mb-4 text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-1">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-xl ${
                          star <= Math.round(averageRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Based on {reviews.length} reviews
                  </div>
                </div>

                <div className="space-y-2">
                  {ratingCounts
                    .sort((a, b) => b.rating - a.rating)
                    .map(({ rating, count }) => (
                      <button
                        key={rating}
                        onClick={() =>
                          setFilter(filter === rating ? null : rating)
                        }
                        className={`flex items-center w-full p-2 rounded-md transition-colors ${
                          filter === rating
                            ? "bg-orange-100 text-orange-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{rating}</span>
                          <FaStar className="text-yellow-400" />
                        </div>
                        <div className="mx-2 flex-grow bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${
                                reviews.length
                                  ? (count / reviews.length) * 100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-gray-600 text-sm">{count}</span>
                      </button>
                    ))}
                </div>

                {filter !== null && (
                  <button
                    onClick={() => setFilter(null)}
                    className="mt-4 text-orange-500 text-sm hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </>
            )}
          </motion.div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <FaSpinner className="animate-spin text-orange-500 text-3xl" />
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-4">
                {filter
                  ? `No ${filter}-star reviews yet. Try a different filter.`
                  : "Be the first to leave a review!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
