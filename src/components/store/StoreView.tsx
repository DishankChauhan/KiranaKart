import React from 'react';
import { GroceryItem, Store } from '../../types/inventory';
import { useCartStore } from '../../store/cartStore';
import { toast } from 'react-hot-toast';
import { updateInventoryQuantity } from '../../services/inventory';
import StoreRatings from './StoreRatings';

interface StoreViewProps {
  store: Store;
}

const StoreView: React.FC<StoreViewProps> = ({ store }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = async (item: GroceryItem) => {
    try {
      await updateInventoryQuantity(item.id, 1, store.id, item.lowStockThreshold);
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        storeId: store.id
      });
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">{store.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Store items grid */}
        </div>
      </div>

      <StoreRatings storeId={store.id} />
    </div>
  );
};

export default StoreView;