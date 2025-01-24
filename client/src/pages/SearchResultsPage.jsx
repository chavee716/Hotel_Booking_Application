import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchPlaces } from '../searchService';

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    const searchParams = location.state?.searchParams || {};
    const fetchResults = async () => {
      try {
        const places = await searchPlaces(searchParams);
        setResults(places);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchResults();
  }, [location.state]);

  const viewDetails = (place) => {
    navigate(`/place/${place._id}`);  // Fixed navigation path with proper ID
  };

  const sortResults = (results) => {
    return [...results].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });
  };

  if (loading) return <div className="mt-20 text-center">Loading...</div>;
  if (error) return <div className="mt-20 text-center text-red-500">Error loading results: {error.message}</div>;
  if (results.length === 0) {
    return <div className="mt-20 text-center">No results found</div>;
  }

  const sortedResults = sortResults(results);

  return (
    <div className="mt-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Search Results ({results.length} properties found)</h1>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="price">Sort by Price</option>
          </select>
        </div>

        <div className="space-y-4">
          {sortedResults.map((place) => (
            <div key={place._id} className="flex border rounded-lg p-4 hover:shadow-lg transition bg-white">
              <div className="w-1/4 pr-4">
                {place.photos && place.photos[0] && (
                  <img 
                    src={`http://localhost:5000${place.photos[0].url}`} 
                    alt={place.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="w-1/2 px-4">
                <h2 className="text-xl font-semibold mb-2">{place.title}</h2>
                <p className="text-gray-600 mb-2">{place.address}</p>
                <p className="text-gray-700 mb-2 line-clamp-2">{place.description}</p>
                <div className="text-sm text-gray-600">
                  <span>Check-in: {place.checkIn}:00</span>
                  <span className="mx-2">|</span>
                  <span>Check-out: {place.checkOut}:00</span>
                  <span className="mx-2">|</span>
                  <span>Max guests: {place.maxGuests}</span>
                </div>
              </div>
              <div className="w-1/4 pl-4 border-l flex flex-col justify-between">
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    ${place.price}
                    <span className="text-sm font-normal text-gray-600"> per night</span>
                  </div>
                </div>
                <button 
                  className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-red-600 transition" 
                  onClick={() => viewDetails(place)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}