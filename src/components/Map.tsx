import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type EventLocation = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  category: string;
};

export interface MapProps {
  events: EventLocation[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMarkerClick?: (eventId: string) => void;
  onMapReady?: (map: L.Map) => void;
  showRoute?: boolean;
}

export const Map = ({
  events = [],
  center = [37.5665, 126.9780],
  zoom = 13,
  className = 'h-64 w-full',
  onMarkerClick,
  onMapReady,
  showRoute = false,
}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map on component mount
  useEffect(() => {
    if (mapInitialized || mapError || !mapContainerRef.current) return;

    // Ensure the container is visible and has dimensions
    if (mapContainerRef.current.offsetWidth === 0 || mapContainerRef.current.offsetHeight === 0) {
      console.warn('Map container has no dimensions, waiting for layout...');
      return;
    }

    try {
      // Initialize the map with default view
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        doubleClickZoom: false,
        closePopupOnClick: false,
        scrollWheelZoom: true,
        touchZoom: true,
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        inertia: false
      });
      console.log("map", map);

      // Set initial view after a small delay to ensure the container is ready
      setTimeout(() => {
        try {
          map.setView(center, zoom, { animate: false });
        } catch (e) {
          console.error('Error setting initial map view:', e);
        }
      }, 50);

      // Add tile layer (OpenStreetMap)
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control
      L.control.zoom({
        position: 'topright'
      }).addTo(map);

      // Store the map instance
      mapRef.current = map;
      setMapInitialized(true);

      // Force a resize after the map is initialized
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize({ pan: false });
        }
      }, 100);

      // Call onMapReady callback if provided
      if (onMapReady) {
        try {
          onMapReady(map);
        } catch (e) {
          console.error('Error in onMapReady callback:', e);
        }
      }

      // Cleanup function
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapError('Failed to load map. Please try again later.');
    }
  }, [center, zoom, mapInitialized, mapError, onMapReady]);

  // Update markers when events change
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    events.forEach(event => {
      const marker = L.marker([event.lat, event.lng])
        .addTo(map)
        .bindPopup(`<b>${event.title}</b><br>${event.description || ''}`);

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(event.id));
      }

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers if there are any
    if (events.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1) as L.LatLngBoundsExpression);
    }

    // Draw route if showRoute is true and there are at least 2 events
    if (showRoute && events.length >= 2) {
      const routePoints = events.map(event => L.latLng(event.lat, event.lng));
      
      // Remove existing route if any
      if (routeLineRef.current) {
        routeLineRef.current.remove();
      }
      
      // Create a new route line
      routeLineRef.current = L.polyline(routePoints, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(map);
    }

    // Cleanup function
    return () => {
      if (routeLineRef.current) {
        routeLineRef.current.remove();
        routeLineRef.current = null;
      }
    };
  }, [events, onMarkerClick, showRoute, mapInitialized]);

  // Handle window resize with debounce
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      if (!mapRef.current) return;
      
      // Clear any pending resize
      if (resizeTimer) clearTimeout(resizeTimer);
      
      // Debounce the resize
      resizeTimer = setTimeout(() => {
        try {
          const map = mapRef.current;
          if (map) {
            // Store current center and zoom
            const center = map.getCenter();
            const zoom = map.getZoom();
            
            // Invalidate size and restore view
            map.invalidateSize({ pan: false });
            
            // Restore the view after a small delay
            setTimeout(() => {
              if (mapRef.current) {
                mapRef.current.setView(center, zoom, { animate: false });
              }
            }, 50);
          }
        } catch (e) {
          console.error('Error during resize:', e);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial check after mount
    const timer = setTimeout(handleResize, 300);
    
    return () => {
      clearTimeout(timer);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (mapError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center p-4">
          <p className="text-red-500">{mapError}</p>
        </div>
      </div>
    );
  }


  return (
    <div
      ref={mapContainerRef}
      className={`${className} bg-gray-100`}
      style={{ minHeight: '300px', width: "100%" }}
    >
      {!mapInitialized && (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}
    </div>
  );
};

export default Map;
