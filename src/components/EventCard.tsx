import { Link } from 'react-router-dom';

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
  className?: string;
  onClick?: () => void;
}

export const EventCard = ({
  id,
  title,
  date,
  location,
  imageUrl,
  category,
  className = '',
  onClick,
  ...props
}: EventCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div id={`event-${id}`} className="mb-4">
      <Link 
        to={`/event/${id}`} 
        className="block"
        onClick={handleClick}
      >
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div 
          className="h-40 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute top-2 right-2 bg-[#46a080] text-white text-xs px-2 py-1 rounded">
            {category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-[#0c1c17] mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <svg 
              className="w-4 h-4 mr-1 text-[#46a080]" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 256 256"
              fill="currentColor"
            >
              <path d="M208,36H180V24a4,4,0,0,0-8,0V36H84V24a4,4,0,0,0-8,0V36H48A20,20,0,0,0,28,56V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V56A20,20,0,0,0,208,36ZM48,52H76V64a4,4,0,0,0,8,0V52h88V64a4,4,0,0,0,8,0V52h28V80H48ZM48,204V88H208V204Z"></path>
            </svg>
            {date}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <svg 
              className="w-4 h-4 mr-1 text-[#46a080]" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 256 256"
              fill="currentColor"
            >
              <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.4,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
            </svg>
            {location}
          </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
