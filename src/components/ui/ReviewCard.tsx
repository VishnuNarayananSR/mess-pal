import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Review } from "@/hooks/useReviews";
import Image from "next/image";

export default function ReviewCard({ review }: { review: Review }) {
  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-4"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Image
            width={32}
            height={32}
            src={review.users?.image || "/images/default-avatar.png"}
            alt={review.users?.name || "User"}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h4 className="font-medium text-gray-800">
              {review.users?.name || "Anonymous User"}
            </h4>
            <div className="flex mt-1">{renderStars(review.rating)}</div>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(review.created_at), {
            addSuffix: true,
          })}
        </div>
      </div>

      {review.comment && <p className="text-gray-600">{review.comment}</p>}
    </motion.div>
  );
}
