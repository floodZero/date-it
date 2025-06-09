import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Map } from '../components/Map';
import { EventCard } from '../components/EventCard';

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
  {
    id: '4',
    title: 'Tech Conference 2023',
    date: 'June 20, 10:00 - 18:00',
    location: 'Convention Center',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    category: 'Conference',
    lat: 37.5700,
    lng: 126.9775,
  },
];

export const SearchLocation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.5665, 126.9780]); // Default to Seoul
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // In a real app, you would fetch events based on the search query
    const query = new URLSearchParams(location.search).get('q');
    if (query) {
      setSearchQuery(query);
      // Simulate search with mock data
      const filteredEvents = mockEvents.filter(event => 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase()) ||
        event.category.toLowerCase().includes(query.toLowerCase())
      );
      setEvents(filteredEvents.length > 0 ? filteredEvents : mockEvents);
    } else {
      setEvents(mockEvents);
    }
  }, [location.search]);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setMapCenter([event.lat, event.lng]);
  };

  const handleMarkerClick = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      handleEventSelect(event);
      // Scroll to the selected event in the list
      const element = document.getElementById(`event-${eventId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Map Section */}
      <div className="h-64 w-full relative">
        <Map 
          events={events.map(event => ({
            id: event.id,
            lat: event.lat,
            lng: event.lng,
            title: event.title,
            category: event.category,
          }))}
          center={mapCenter}
          zoom={13}
          onMarkerClick={handleMarkerClick}
          className="absolute inset-0"
        />
      </div>
      
      {/* Search Summary */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#0c1c17] mb-1">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Events'}
        </h1>
        <p className="text-gray-600">{events.length} events found</p>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2 mt-3 overflow-x-auto pb-2 -mx-4 px-4">
          {['All', 'Today', 'Tomorrow', 'This Week', 'Free', 'Nearby'].map((filter) => (
            <button
              key={filter}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                filter === 'All' 
                  ? 'bg-[#46a080] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Events List */}
      <div className="flex-1 overflow-y-auto">
        {events.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <div 
                key={event.id}
                id={`event-${event.id}`}
                className={`p-4 ${selectedEvent?.id === event.id ? 'bg-[#f0f9f5]' : 'bg-white'}`}
                onClick={() => handleEventSelect(event)}
              >
                <EventCard
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  imageUrl={event.imageUrl}
                  category={event.category}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <svg 
              className="w-16 h-16 text-gray-300 mb-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setEvents(mockEvents);
              }}
              className="mt-4 px-4 py-2 bg-[#46a080] text-white rounded-lg hover:bg-[#3a8a6d] text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
      
      {/* Action Button */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={() => navigate('/search/datecourse')}
          className="w-full bg-[#46a080] hover:bg-[#3a8a6d] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Create Date Course
        </button>
      </div>
    </div>
  );
};
