import React, { useState } from 'react';
import { useInventoryStore } from '../../store/inventoryStore';
import { uploadProductImage } from '../../services/images';
import { toast } from 'react-hot-toast';

// Define the props interface
interface AddInventoryFormProps {
  storeId: string;
  onClose: () => void; // Define the type for onClose function
}

const AddInventoryForm: React.FC<AddInventoryFormProps> = ({ storeId, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    quantity: 0,
    category: 'general',
    description: '',
    image: null as File | null
  });

  const { addItem } = useInventoryStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (formData.image) {
        imageUrl = await uploadProductImage(formData.image, storeId);
      }

      await addItem({
        ...formData,
        storeId,
        image: imageUrl,
        lowStockThreshold: 5
      });

      toast.success('Item added successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Product Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Price</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border p-2"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border p-2"
          required
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
          className="mt-1 block w-full"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 text-white rounded-md py-2 hover:bg-emerald-700"
      >
        Add Item
      </button>
    </form>
  );
};

export default AddInventoryForm;