import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { Store } from '../../types/inventory';

interface StoreLocatorProps {
  stores: Store[];
  onStoreSelect: (store: Store) => void;
}

const StoreLocator: React.FC<StoreLocatorProps> = ({ stores, onStoreSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places']
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current) {
          const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // New York City
          
          googleMapRef.current = new google.maps.Map(mapRef.current, {
            center: defaultLocation,
            zoom: 12,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          });

          // Try to get user's location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                googleMapRef.current?.setCenter(pos);

                // Add user's location marker
                new google.maps.Marker({
                  position: pos,
                  map: googleMapRef.current,
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4F46E5",
                    fillOpacity: 0.4,
                    strokeWeight: 2,
                    strokeColor: "#312E81",
                  },
                  title: "Your Location"
                });
              },
              () => {
                console.log('Error: The Geolocation service failed.');
              }
            );
          }

          // Add markers for each store
          stores.forEach((store) => {
            if (store.coordinates) {
              const marker = new google.maps.Marker({
                position: store.coordinates,
                map: googleMapRef.current,
                title: store.name,
                animation: google.maps.Animation.DROP
              });

              const infoWindow = new google.maps.InfoWindow({
                content: `
                  <div class="p-4">
                    <h3 class="font-semibold text-lg">${store.name}</h3>
                    <p class="text-gray-600">${store.address}</p>
                    <p class="text-gray-600">${store.operatingHours}</p>
                    <p class="text-gray-600">${store.contact}</p>
                  </div>
                `,
              });

              marker.addListener('click', () => {
                infoWindow.open(googleMapRef.current, marker);
                onStoreSelect(store);
              });
            }
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [stores, onStoreSelect]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-md">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default StoreLocator;