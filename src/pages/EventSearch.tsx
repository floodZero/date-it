import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Map } from '../components/Map';
import { EventCard, EventCardProps } from '../components/EventCard';
import { SearchBar, SearchBarProps } from '../components/SearchBar';

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
  lat: number;
  lng: number;
};

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Community Art Workshop',
    date: 'Today, 14:00 - 16:00',
    location: 'Community Center, Room 201',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    category: 'Workshop',
    lat: 37.5665,
    lng: 126.9780,
  },
  {
    id: '2',
    title: 'Jazz Night at Blue Note',
    date: 'Tomorrow, 20:00 - 23:00',
    location: 'Blue Note Jazz Club',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    category: 'Music',
    lat: 37.5730,
    lng: 126.9768,
  },
  {
    id: '3',
    title: 'Weekend Farmers Market',
    date: 'This Saturday, 09:00 - 15:00',
    location: 'Central Park',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    category: 'Market',
    lat: 37.5758,
    lng: 126.9734,
  },
];

export const EventSearch = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch events from an API here
    setLoading(false);
  }, []);

  // Handle map ready event
  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    // Fit bounds to show all markers
    if (events.length > 0) {
      const bounds = L.latLngBounds(
        events.map(event => [event.lat, event.lng])
      );
      map.fitBounds(bounds.pad(0.1));
    }
  };

  // Handle marker click
  const handleMarkerClick = (eventId: string) => {
    setSelectedEventId(eventId);
    // Scroll the event into view in the list
    const eventElement = document.getElementById(`event-${eventId}`);
    if (eventElement) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        eventElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  };
  
  // Handle event card click
  const handleEventCardClick = (event: Event) => {
    setSelectedEventId(event.id);
    // Center map on selected event
    if (mapRef.current) {
      mapRef.current.flyTo([event.lat, event.lng], 15, {
        duration: 0.5
      });
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    // In a real app, this would filter events based on the search query
    console.log('Searching for:', query);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Map section - Ensure proper dimensions */}
        <div className="relative" style={{ height: '40vh', minHeight: '300px' }}>
          <div className="absolute inset-0 w-full h-full bg-gray-200">
            <Map 
              key="map-container"
              events={events.map(event => ({
                ...event,
                description: event.location,
                category: event.category
              }))}
              onMarkerClick={handleMarkerClick}
              onMapReady={handleMapReady}
              className="w-full h-full"
            />
          </div>
        </div>
        
        {/* Events list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Nearby Events</h2>
            <button 
              className="text-sm text-primary-600 hover:text-primary-800"
              onClick={() => {
                // Scroll to top and fit bounds
                if (mapRef.current && events.length > 0) {
                  const bounds = L.latLngBounds(
                    events.map(event => [event.lat, event.lng])
                  );
                  mapRef.current.fitBounds(bounds.pad(0.1));
                }
              }}
            >
              Show all on map
            </button>
          </div>
          
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map(event => (
                <div 
                  key={event.id}
                  className={`transition-all duration-200 ${
                    selectedEventId === event.id 
                      ? 'ring-2 ring-primary-500 rounded-lg transform -translate-y-0.5' 
                      : 'hover:shadow-md hover:border-gray-300'
                  }`}
                >
                  <EventCard 
                    id={event.id}
                    title={event.title}
                    date={event.date}
                    location={event.location}
                    imageUrl={event.imageUrl}
                    category={event.category}
                    onClick={() => handleEventCardClick(event)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No events found. Create one or check back later!
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-200 flex justify-around items-center p-2">
        <button className="flex flex-col items-center p-2 text-primary-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          className="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900"
          onClick={() => navigate('/search/date-course')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs mt-1">Date Course</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};
