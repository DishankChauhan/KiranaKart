import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

interface WishlistButtonProps {
  productId: string;
  productName: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, productName }) => {
  const { user } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please sign in to use wishlist');
      return;
    }

    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className="p-2 rounded-full hover:bg-gray-100"
      title={isInWishlist(productId) ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <Heart
        className={`h-6 w-6 ${
          isInWishlist(productId)
            ? 'text-red-500 fill-current'
            : 'text-gray-400'
        }`}
      />
    </button>
  );
};

export default WishlistButton;