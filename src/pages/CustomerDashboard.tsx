import React, { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Store, GroceryItem } from '../types/inventory';
import StoreLocator from '../components/maps/StoreLocator';
import SearchBar from '../components/search/SearchBar';
import { getCurrentLocation } from '../utils/geolocation';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Store as StoreIcon, ShoppingBag } from 'lucide-react';

const CustomerDashboard = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesSnapshot = await getDocs(collection(db, 'stores'));
        const storesData = storesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Store[];
        setStores(storesData);
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Failed to load stores');
      }
    };

    const getLocation = async () => {
      try {
        const position = await getCurrentLocation();
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      } catch (error) {
        toast.error('Unable to get your location');
      }
    };

    fetchStores();
    getLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Nearby Stores</h1>
          <SearchBar onSearch={() => {}} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stores.map((store) => (
                <Link
                  key={store.id}
                  to={`/store/${store.id}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <StoreIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>
                      <p className="text-sm text-gray-500">{store.address}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{store.operatingHours}</span>
                    {userLocation && store.coordinates && (
                      <span className="text-emerald-600 font-medium">
                        {calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          store.coordinates.lat,
                          store.coordinates.lng
                        ).toFixed(1)} km away
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <StoreLocator
                stores={stores}
                onStoreSelect={(store) => window.location.href = `/store/${store.id}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

export default CustomerDashboard;