import { useState } from 'react';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
  showPopularSearches?: boolean;
}

export const SearchBar = ({
  onSearch,
  className = '',
  placeholder = 'Search for events...',
  showPopularSearches = true,
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const popularSearches = ['Today', 'Tomorrow', 'This week', 'Next week'];

  return (
    <div className={`px-4 py-3 ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg 
              className="w-5 h-5 text-[#46a080]" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 256 256" 
              fill="currentColor"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </div>
          <input
            type="text"
            className="w-full h-12 pl-10 pr-4 rounded-lg bg-[#e6f4ef] text-[#0c1c17] placeholder-[#46a080] focus:outline-none focus:ring-2 focus:ring-[#46a080] focus:border-transparent"
            placeholder="Search events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {popularSearches.map((search) => (
          <button
            key={search}
            className="px-3 py-1 text-sm rounded-full bg-[#e6f4ef] text-[#0c1c17] hover:bg-[#d0e8de] transition-colors"
            onClick={() => setSearchQuery(search)}
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};
