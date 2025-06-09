import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Map } from '../components/Map';

type Place = {
  id: string;
  name: string;
  category: string;
  address: string;
  timeSpent: string;
  lat: number;
  lng: number;
};

// Mock data for date course places
const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Café Miel',
    category: 'Coffee',
    address: '123 Coffee Street, Seoul',
    timeSpent: '45 min',
    lat: 37.5665,
    lng: 126.9780,
  },
  {
    id: '2',
    name: 'Art Gallery',
    category: 'Museum',
    address: '456 Art Avenue, Seoul',
    timeSpent: '1.5 hours',
    lat: 37.5730,
    lng: 126.9768,
  },
  {
    id: '3',
    name: 'Riverside Park',
    category: 'Outdoor',
    address: '789 Riverside Road, Seoul',
    timeSpent: '1 hour',
    lat: 37.5758,
    lng: 126.9734,
  },
  {
    id: '4',
    name: 'Italian Restaurant',
    category: 'Dining',
    address: '101 Pasta Street, Seoul',
    timeSpent: '1.5 hours',
    lat: 37.5770,
    lng: 126.9710,
  },
];

export const SearchDateCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery] = useState(new URLSearchParams(location.search).get('q') || '');

  // In a real app, you would fetch places based on the search query
  const places = mockPlaces;
  
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    // You could also center the map on the selected place
  };

  const handleStartNavigation = () => {
    // In a real app, you would open a maps app with directions
    alert('Opening navigation to the first location');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Map Section */}
      <div className="h-64 w-full relative">
        <Map 
          events={places.map(place => ({
            id: place.id,
            lat: place.lat,
            lng: place.lng,
            title: place.name,
            category: place.category,
          }))}
          center={[37.5665, 126.9780]}
          zoom={14}
          showRoute={true}
          onMarkerClick={(id) => {
            const place = places.find(p => p.id === id);
            if (place) {
              handlePlaceSelect(place);
            }
          }}
          className="absolute inset-0"
        />
      </div>
      
      {/* Search Summary */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#0c1c17] mb-1">Perfect Date Course</h1>
        <p className="text-gray-600">Based on your preferences</p>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <span>Total time: ~4 hours</span>
          <span className="mx-2">•</span>
          <span>4 stops</span>
        </div>
      </div>
      
      {/* Places List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {places.map((place, index) => (
            <div 
              key={place.id}
              className={`p-4 ${selectedPlace?.id === place.id ? 'bg-[#f0f9f5]' : 'bg-white'}`}
              onClick={() => handlePlaceSelect(place)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#e6f4ef] flex items-center justify-center text-[#46a080] font-bold mr-3">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0c1c17] truncate">{place.name}</p>
                  <p className="text-sm text-gray-500">{place.category}</p>
                  <p className="text-xs text-gray-400 mt-1">{place.address}</p>
                </div>
                <div className="ml-2 text-sm text-gray-500">
                  {place.timeSpent}
                </div>
              </div>
              {index < places.length - 1 && (
                <div className="flex justify-center -mt-2 mb-1">
                  <div className="h-4 w-0.5 bg-gray-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-3">
          <button
            onClick={handleStartNavigation}
            className="flex-1 bg-[#46a080] hover:bg-[#3a8a6d] text-white font-medium py-2 px-4 rounded-lg"
          >
            Start Navigation
          </button>
          <button className="p-2 text-gray-500 hover:text-[#46a080] border border-gray-300 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M200,128a40,40,0,0,1-28.28,38.15l-37.4,37.39a8,8,0,0,1-13.44-5.54V136h40a8,8,0,0,0,0-16H120V80a8,8,0,0,1,13.66-5.66l37.39,37.38A40,40,0,0,1,200,128Zm40,0A88,88,0,1,1,128,40,88.1,88.1,0,0,1,216,128Zm-16,0a72,72,0,1,0-72,72A72.08,72.08,0,0,0,240,128Z"></path>
            </svg>
          </button>
        </div>
        <button className="w-full mt-3 text-center text-[#46a080] text-sm font-medium">
          Regenerate Course
        </button>
      </div>
    </div>
  );
};
