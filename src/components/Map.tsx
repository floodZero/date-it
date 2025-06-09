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
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Initialize map on component mount
  useEffect(() => {
    if (mapInitialized || !mapContainerRef.current) return;

    console.log('Initializing map...');

    try {
      // Initialize the map
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        doubleClickZoom: false,
        closePopupOnClick: false,
        scrollWheelZoom: true,
        touchZoom: true,
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        inertia: false,
        preferCanvas: true
      });

      console.log('Map instance created');

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        detectRetina: true
      }).addTo(map);

      // Add zoom control
      L.control.zoom({
        position: 'topright'
      }).addTo(map);

      // Set initial view
      map.setView(center, zoom, { animate: false });
      console.log('Map view set to:', { center, zoom });
      
      // Store the map instance
      mapRef.current = map;
      setMapInitialized(true);
      console.log('Map initialized successfully');

      // Set up resize observer for the container
      const resizeObserver = new ResizeObserver(() => {
        console.log('Container resized, invalidating map size');
        map.invalidateSize({ pan: false });
      });

      resizeObserver.observe(mapContainerRef.current);
      resizeObserverRef.current = resizeObserver;

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
        resizeObserver.disconnect();
        map.remove();
        mapRef.current = null;
        setMapInitialized(false);
      };
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapError('Failed to load map. Please try again later.');
      return () => {}; // No-op cleanup if initialization failed
    }
  }, []); // Empty dependency array to run only once on mount

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
    if (!mapRef.current) return;
    
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      if (!mapRef.current) return;
      
      // Clear any pending resize
      if (resizeTimer) clearTimeout(resizeTimer);
      
      // Debounce the resize
      resizeTimer = setTimeout(() => {
        try {
          mapRef.current?.invalidateSize({ pan: false });
        } catch (e) {
          console.error('Error during resize:', e);
        }
      }, 150);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Initial resize check
    handleResize();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  if (mapError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 text-red-600`}>
        {mapError}
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <div className="absolute inset-0 w-full h-full" ref={mapContainerRef} />
      {!mapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="animate-pulse text-gray-500">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default Map;
