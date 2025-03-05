import { collection, query, where, getDocs, GeoPoint } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Store } from '../types/inventory';

export const getNearbyStores = async (
  latitude: number,
  longitude: number,
  radiusInKm: number = 10
) => {
  // Create a GeoPoint for the user's location
  const center = new GeoPoint(latitude, longitude);

  // Calculate the rough bounding box for the query
  const lat = 0.0089831; // Approximately 1km in latitude degrees
  const lng = 0.0089831 / Math.cos(latitude * Math.PI / 180);

  const bounds = {
    north: latitude + (lat * radiusInKm),
    south: latitude - (lat * radiusInKm),
    east: longitude + (lng * radiusInKm),
    west: longitude - (lng * radiusInKm),
  };

  const q = query(
    collection(db, 'stores'),
    where('coordinates.latitude', '>=', bounds.south),
    where('coordinates.latitude', '<=', bounds.north)
  );

  const snapshot = await getDocs(q);
  const stores = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Store[];

  // Further filter stores within the radius using the Haversine formula
  return stores.filter(store => {
    if (!store.coordinates) return false;
    
    const distance = getDistanceFromLatLonInKm(
      latitude,
      longitude,
      store.coordinates.lat,
      store.coordinates.lng
    );
    
    return distance <= radiusInKm;
  });
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}