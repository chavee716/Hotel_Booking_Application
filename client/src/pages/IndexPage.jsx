import React, { useState, useEffect, useMemo, Suspense, lazy } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const WeatherSection = lazy(() => import("../components/WeatherSection"));
const PromotionalBanner = lazy(() => import("../components/Banner"));

// Icons for filter categories
const FilterIcons = [
  {
    name: 'Beach',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.073 0-4.114.224-6 .655V21" />
      </svg>
    )
  },
  {
    name: 'Amazing Views',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    )
  },
  {
    name: 'Top Cities',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    )
  },
  {
    name: 'Islands',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47-2.657A3.001 3.001 0 0015.5 9h-7c-1.054 0-1.875.897-1.875 2l2.25 2h7a2 2 0 012 2v1.5m-19-11l19 11m-19-11a3 3 0 013-3h14a3 3 0 013 3m-19 11v-3.5c0-.621.504-1.125 1.125-1.125h.375c.621 0 1.125.504 1.125 1.125v3.5" />
      </svg>
    )
  },
  {
    name: 'Castles',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934a1.12 1.12 0 01-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934a1.125 1.125 0 011.006 0l4.994 2.497a1.125 1.125 0 001.006 0l4.994-2.497a1.125 1.125 0 011.006 0l3.869 1.934c.748.374 1.628-.17 1.628-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934a1.125 1.125 0 01-1.006 0L15 3.75" />
      </svg>
    )
  },
  {
    name: 'Cabins',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    )
  },
  {
    name: 'Mountains',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-1.86 8.269 8.269 0 003 2.274 8.216 8.216 0 00-1 4.338 8.256 8.256 0 003 3z" />
      </svg>
    )
  },
  {
    name: 'Luxury',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.6l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.6l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    )
  },
  {
    name: 'National Parks',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621.504 1.125 1.125 1.125m-9.75 0V5.625m9.75 12.75v-1.5c0-.621.504-1.125 1.125-1.125m0 0h7.5c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125M9 12l3 3 3-3m-3 3V3" />
      </svg>
    )
  },
  {
    name: 'Historic Sites',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.073 0-4.114.224-6 .655V21" />
      </svg>
    )
  },
  {
    name: 'Eco Retreats',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    )
  }
];
const PlaceCard = React.memo(({ place }) => (
  <Link
    to={`/place/${place._id}`}
    className="transform transition duration-300 hover:scale-105 hover:shadow-lg"
  >
    <div className="bg-gray-500 mb-2 rounded-2xl flex overflow-hidden">
      {place.photos?.[0]?.url ? (
        <img
          className="rounded-2xl object-cover aspect-square transition duration-300 hover:opacity-90"
          src={`http://localhost:5000${place.photos[0].url}`}
          alt={place.title || "Hotel"}
          loading="lazy" // Native lazy loading
          decoding="async" // Async image decoding
        />
      ) : (
        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
    </div>
    <h2 className="font-bold truncate transition duration-300 hover:text-blue-600">
      {place.title}
    </h2>
    <h3 className="text-sm text-gray-500 truncate">{place.address}</h3>
    <div className="mt-1">
      <span className="font-bold">${place.price}</span> per night
    </div>
  </Link>
));

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination and filtering states
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Optimization: Configurable places per page
  const PLACES_PER_PAGE = 8;

  // Fetch places with error handling and loading state
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/places", {
          // Add caching headers
          headers: {
            'Cache-Control': 'max-age=3600' // Cache for 1 hour
          }
        });
        
        // Validate and set places
        setPlaces(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError('Failed to load places. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Memoized filtering and pagination logic
  const { 
    filteredPlaces, 
    currentPlaces, 
    totalPages 
  } = useMemo(() => {
    // Filter places based on selected category
    const filtered = selectedFilter
      ? places.filter(place => 
          place.categories?.includes(selectedFilter.toLowerCase())
        )
      : places;

    // Pagination calculations
    const startIndex = (currentPage - 1) * PLACES_PER_PAGE;
    const endIndex = startIndex + PLACES_PER_PAGE;
    
    return {
      filteredPlaces: filtered,
      currentPlaces: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / PLACES_PER_PAGE)
    };
  }, [places, selectedFilter, currentPage]);

  // Slideshow effect with optimization
  useEffect(() => {
    if (places.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % places.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [places]);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-20 container mx-auto px-4">
      {/* Filter Row */}
      <div className="flex justify-center items-center space-x-6 mb-6">
        {FilterIcons.map((filterItem) => (
          <button
            key={filterItem.name}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 ${
              selectedFilter === filterItem.name 
                ? 'bg-gray-200 text-primary' 
                : 'text-gray-600'
            }`}
            onClick={() => {
              setSelectedFilter(
                selectedFilter === filterItem.name ? null : filterItem.name
              );
              // Reset to first page when filter changes
              setCurrentPage(1);
            }}
          >
            {filterItem.icon}
            <span className="text-xs mt-1">{filterItem.name}</span>
          </button>
        ))}
      </div>

      {/* Suspend lazy-loaded components */}
      <Suspense fallback={<div>Loading...</div>}>
        <PromotionalBanner />
      </Suspense>

      {/* Place Cards Grid */}
      <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
        {currentPlaces.map((place) => (
          <PlaceCard key={place._id} place={place} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}