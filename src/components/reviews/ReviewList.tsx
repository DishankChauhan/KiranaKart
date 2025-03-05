import React from 'react';
import { Star } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import type { Review } from '../../types/review';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <p className="mt-2 text-gray-700">{review.comment}</p>
          <p className="mt-1 text-sm text-gray-500">By {review.userName}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;