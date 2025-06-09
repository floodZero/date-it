import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  category: string;
  imageUrl: string;
  organizer: string;
  price: string;
  capacity: number;
  registered: number;
  lat: number;
  lng: number;
};

// Mock data for the event
const mockEvent: Event = {
  id: '1',
  title: 'Community Art Workshop',
  description: 'Join us for a fun and creative art workshop where you can explore your artistic talents and connect with fellow art enthusiasts. All skill levels are welcome! We will provide all necessary materials, just bring your creativity!',
  location: 'Community Center, Room 201, 123 Art Street, Seoul',
  date: 'June 15, 2023',
  time: '14:00 - 16:00',
  category: 'Workshop',
  imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
  organizer: 'Seoul Art Collective',
  price: 'Free',
  capacity: 30,
  registered: 18,
  lat: 37.5665,
  lng: 126.9780,
};

export const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you would fetch the event data from an API using the id
    const fetchEvent = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setEvent(mockEvent);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = () => {
    // In a real app, you would handle the registration logic here
    setIsRegistered(true);
  };

  const handleShare = () => {
    // In a real app, you would implement share functionality
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out this event: ${event?.title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#46a080]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <h2 className="text-xl font-bold text-[#0c1c17] mb-2">Event not found</h2>
        <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[#46a080] text-white rounded-lg hover:bg-[#3a8a6d] transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Event Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 rounded-full p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </button>
      </div>

      {/* Event Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-3 py-1 text-sm font-medium text-[#46a080] bg-[#e6f4ef] rounded-full mb-2">
              {event.category}
            </span>
            <h1 className="text-2xl font-bold text-[#0c1c17] mb-2">{event.title}</h1>
            <p className="text-gray-600 mb-4">Hosted by {event.organizer}</p>
          </div>
          <button
            onClick={handleShare}
            className="p-2 text-gray-500 hover:text-[#46a080]"
            aria-label="Share event"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M176,160a39.89,39.89,0,0,0-28.62,12.09l-46.1-29.63a39.8,39.8,0,0,0,0-28.92l46.1-29.63a40,40,0,1,0-8.66-13.45l-46.1,29.67a40,40,0,1,0,0,55.82l46.1,29.63A40,40,0,1,0,176,160Zm0-128a24,24,0,1,1-24,24A24,24,0,0,1,176,32ZM64,152a24,24,0,1,1,24-24A24,24,0,0,1,64,152Zm112,48a24,24,0,1,1,24-24A24,24,0,0,1,176,200Z"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Date & Time */}
          <div className="flex items-start">
            <div className="text-[#46a080] mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM168,56v8a8,8,0,0,0,16,0V56h24V80H48V56H64v8a8,8,0,0,0,16,0V56h80V80H48v24H208V80H168V56Zm40,144H48V112H208v88Z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-[#0c1c17]">Date & Time</h3>
              <p className="text-gray-600">{event.date}</p>
              <p className="text-gray-600">{event.time}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start">
            <div className="text-[#46a080] mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.4,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-[#0c1c17]">Location</h3>
              <p className="text-gray-600">{event.location}</p>
              <button className="text-[#46a080] text-sm mt-1 flex items-center">
                View on map
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="ml-1">
                  <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-medium text-[#0c1c17] mb-2">About this event</h3>
            <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
          </div>

          {/* Price & Capacity */}
          <div className="flex justify-between p-4 bg-[#f8fcfb] rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="font-medium text-[#0c1c17]">{event.price}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Capacity</p>
              <p className="font-medium text-[#0c1c17]">
                {event.registered} / {event.capacity} registered
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleRegister}
          disabled={isRegistered}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            isRegistered 
              ? 'bg-green-600' 
              : 'bg-[#46a080] hover:bg-[#3a8a6d]'
          }`}
        >
          {isRegistered ? 'Registered' : 'Register Now'}
        </button>
      </div>
    </div>
  );
};
