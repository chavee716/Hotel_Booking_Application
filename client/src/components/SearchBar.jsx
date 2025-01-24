import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSearchSuggestions } from '../searchService';

const SearchBar = () => {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    sortBy: '',
    priceRange: ''
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchParams.destination.length > 2) {
        try {
          const results = await getSearchSuggestions(searchParams.destination);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchParams.destination]);

  const handleSearch = () => {
    navigate('/search', { state: { searchParams } });
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchParams(prev => ({
      ...prev,
      destination: suggestion.title
    }));
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto" ref={searchRef}>
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Where are you going?"
            value={searchParams.destination}
            onChange={(e) => setSearchParams(prev => ({
              ...prev,
              destination: e.target.value
            }))}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-medium">{suggestion.title}</div>
                  <div className="text-sm text-gray-500">{suggestion.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="date"
          value={searchParams.checkIn}
          onChange={(e) => setSearchParams(prev => ({
            ...prev,
            checkIn: e.target.value
          }))}
          className="p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
        />

        <input
          type="date"
          value={searchParams.checkOut}
          onChange={(e) => setSearchParams(prev => ({
            ...prev,
            checkOut: e.target.value
          }))}
          className="p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
        />

        <input
          type="number"
          min="1"
          value={searchParams.guests}
          onChange={(e) => setSearchParams(prev => ({
            ...prev,
            guests: e.target.value
          }))}
          className="w-24 p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
        />

        <button
          onClick={handleSearch}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;