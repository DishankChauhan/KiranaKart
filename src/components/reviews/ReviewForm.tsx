import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { createReview } from '../../services/reviews';
import { toast } from 'react-hot-toast';

interface ReviewFormProps {
  productId: string;
  userId: string;
  userName: string;
  onSubmit: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, userId, userName, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({ productId, userId, userName, rating, comment });
      toast.success('Review submitted successfully');
      onSubmit();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full p-2 border rounded-md"
        rows={4}
      />
      <button
        type="submit"
        className="w-full py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
      >
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;