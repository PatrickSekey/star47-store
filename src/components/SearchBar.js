import React, { useState } from 'react';
import { Search, Mic, X } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="flex-1 max-w-2xl">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, brands and more..."
          className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
        />
        
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-12 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition-colors flex items-center space-x-2">
          <Search size={20} />
          <span className="hidden sm:inline">Search</span>
        </button>
        
        <button className="ml-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
          <Mic size={20} className="text-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;