import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchPlaces } from '../searchService';
import PriceFilter from '../components/PriceFilter';

const ITEMS_PER_PAGE = 10;

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [searchQuery, setSearchQuery] = useState(location.state?.searchParams?.destination || '');
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 1000 });
  const [currentPage, setCurrentPage] = useState(1);

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
    navigate(`/place/${place._id}`);
  };

  const calculateRelevance = (place, query) => {
    if (!query) return 0;
    const titleMatch = place.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
    const descriptionMatch = place.description.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
    return titleMatch + descriptionMatch;
  };

  const filterResults = (results) => {
    let filteredResults = results.filter(place => 
      place.price >= priceFilter.min && place.price <= priceFilter.max
    );
    return sortResults(filteredResults);
  };

  const sortResults = (results) => {
    let sortedResults = [...results];

    if (sortBy === 'price') {
      sortedResults = sortedResults.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'relevance') {
      sortedResults = sortedResults.sort((a, b) => {
        const relevanceA = calculateRelevance(a, searchQuery);
        const relevanceB = calculateRelevance(b, searchQuery);
        return relevanceB - relevanceA;
      });
    }

    return sortedResults;
  };

  const getPaginatedResults = (filteredResults) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredResults.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filterResults(results).length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="mt-20 text-center">Loading...</div>;
  if (error) return <div className="mt-20 text-center text-red-500">Error loading results: {error.message}</div>;
  if (results.length === 0) {
    return <div className="mt-20 text-center">No results found</div>;
  }

  const filteredResults = filterResults(results);
  const paginatedResults = getPaginatedResults(filteredResults);

  return (
    <div className="mt-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Search Results ({filteredResults.length} properties found)
          </h1>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="price">Sort by Price</option>
            <option value="relevance">Sort by Relevance</option>
          </select>
        </div>
        
        <div className="flex gap-6">
          <div className="w-1/4">
            <PriceFilter 
              results={results} 
              onFilterChange={setPriceFilter}
            />
          </div>
          
          <div className="w-3/4">
            <div className="space-y-4">
              {paginatedResults.map((place) => (
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
                    <p className="text-gray-700 mb-2 line-clamp-2">
                      {place.description}
                    </p>
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

            {filteredResults.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg">
                <p className="text-gray-600">
                  No properties found matching your current filters.
                </p>
              </div>
            ) : (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 border rounded-lg hover:bg-gray-50 ${
                        currentPage === index + 1 ? 'bg-primary text-white hover:bg-primary' : ''
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}