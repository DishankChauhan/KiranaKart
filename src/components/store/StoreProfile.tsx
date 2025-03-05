import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Store } from '../../types/inventory';
import { toast } from 'react-hot-toast';
import { Clock, MapPin, Phone } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

interface StoreProfileProps {
  store: Store;
  onUpdate: () => void;
}

const StoreProfile: React.FC<StoreProfileProps> = ({ store, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: store.name || '',
    address: store.address || '',
    contact: store.contact || '',
    operatingHours: store.operatingHours || '',
    coordinates: store.coordinates || null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'stores', store.id), formData);
      toast.success('Store profile updated successfully');
      onUpdate();
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update store profile');
    }
  };

  const handleAddressChange = async (address: string) => {
    try {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: "weekly"
      });
      const google = await loader.load();
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const location = results[0].geometry.location;
          setFormData({
            ...formData,
            address,
            coordinates: {
              lat: location.lat(),
              lng: location.lng()
            }
          });
        }
      });
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Store Profile</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
                handleAddressChange(e.target.value);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="tel"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Operating Hours</label>
            <input
              type="text"
              value={formData.operatingHours}
              onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
              placeholder="e.g., Mon-Fri: 9AM-6PM"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
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
          <h3 className="text-xl font-semibold text-gray-800">{formData.name}</h3>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <span className="text-gray-600">{formData.address || 'No address set'}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">{formData.contact || 'No contact set'}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">{formData.operatingHours || 'No hours set'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreProfile;