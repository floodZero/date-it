import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchBar } from './SearchBar';

type LayoutProps = {
  children: ReactNode;
  showSearchBar?: boolean;
};

export const Layout = ({ children, showSearchBar = true }: LayoutProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fcfa] font-['Plus_Jakarta_Sans',_sans-serif]">
      <header className="sticky top-0 z-10 bg-[#f8fcfa] shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="w-12">
            {!isActive('/') && (
              <Link to="/" className="text-[#0c1c17]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                </svg>
              </Link>
            )}
          </div>
          <h1 className="text-lg font-bold text-[#0c1c17]">
            {location.pathname === '/' && 'Events'}
            {location.pathname === '/event/new' && 'Create Event'}
            {location.pathname.startsWith('/event/') && location.pathname !== '/event/new' && 'Event Details'}
            {location.pathname === '/search/datecourse' && 'Date Course'}
            {location.pathname === '/search/location' && 'Location Search'}
          </h1>
          <div className="w-12"></div>
        </div>
        {showSearchBar && <SearchBar />}
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <nav className="flex justify-around items-center border-t border-[#e6f4ef] bg-[#f8fcfa] p-3">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-[#46a080]' : 'text-[#0c1c17]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/search/datecourse" className={`flex flex-col items-center ${isActive('/search/datecourse') ? 'text-[#46a080]' : 'text-[#0c1c17]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M200,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V40A16,16,0,0,0,200,24Zm0,192H56V40H200V216ZM88,80a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,80Zm0,32a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,144Z"></path>
          </svg>
          <span className="text-xs mt-1">Courses</span>
        </Link>
        <Link to="/search/location" className={`flex flex-col items-center ${isActive('/search/location') ? 'text-[#46a080]' : 'text-[#0c1c17]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.4,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
          </svg>
          <span className="text-xs mt-1">Nearby</span>
        </Link>
        <Link to="/event/new" className={`flex flex-col items-center ${isActive('/event/new') ? 'text-[#46a080]' : 'text-[#0c1c17]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
          </svg>
          <span className="text-xs mt-1">New Event</span>
        </Link>
      </nav>
    </div>
  );
};
