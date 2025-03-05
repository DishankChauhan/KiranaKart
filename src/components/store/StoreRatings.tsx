import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { addStoreRating, getStoreRatings, getAverageRating } from '../../services/ratings';
import { toast } from 'react-hot-toast';
import type { StoreRating } from '../../types/store';

interface StoreRatingsProps {
  storeId: string;
}

const StoreRatings: React.FC<StoreRatingsProps> = ({ storeId }) => {
  const { user } = useAuthStore();
  const [ratings, setRatings] = useState<StoreRating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    loadRatings();
  }, [storeId]);

  const loadRatings = async () => {
    try {
      const [ratingsList, avgRating] = await Promise.all([
        getStoreRatings(storeId),
        getAverageRating(storeId)
      ]);
      setRatings(ratingsList);
      setAverageRating(avgRating);
    } catch (error) {
      toast.error('Failed to load ratings');
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a rating');
      return;
    }

    try {
      await addStoreRating({
        storeId,
        userId: user.id,
        userName: user.name,
        rating: newRating.rating,
        comment: newRating.comment
      });
      toast.success('Rating submitted successfully');
      setNewRating({ rating: 0, comment: '' });
      setShowForm(false);
      loadRatings();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Store Ratings</h2>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= averageRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600">
              ({ratings.length} reviews)
            </span>
          </div>
        </div>
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-emerald-600 hover:text-emerald-700"
          >
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitRating}
          className="mb-8 bg-gray-50 p-4 rounded-lg"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating({ ...newRating, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= newRating.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              value={newRating.comment}
              onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Submit Review
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {ratings.map((rating) => (
          <motion.div
            key={rating.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-b last:border-0 pb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-8 w-8 text-gray-400 mr-2" />
                <div>
                  <p className="font-medium">{rating.userName}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rating.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {rating.createdAt.toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{rating.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StoreRatings;