import React, { useState } from 'react';
import { User } from '../../types/auth';
import { updateUserProfile } from '../../services/users';
import { uploadProfileImage } from '../../services/images';
import { toast } from 'react-hot-toast';

interface EnhancedProfileProps {
  user: User;
  onUpdate: () => void;
}

const EnhancedProfile: React.FC<EnhancedProfileProps> = ({ user, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    preferences: user.preferences || {},
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadProfileImage(file, user.id);
        await updateUserProfile(user.id, { ...formData, imageUrl });
        toast.success('Profile image updated');
        onUpdate();
      } catch (error) {
        toast.error('Failed to update profile image');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(user.id, formData);
      toast.success('Profile updated successfully');
      onUpdate();
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                rows={3}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.imageUrl || 'https://via.placeholder.com/100'}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {user.phone && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Phone</h4>
              <p>{user.phone}</p>
            </div>
          )}

          {user.address && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Address</h4>
              <p>{user.address}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};