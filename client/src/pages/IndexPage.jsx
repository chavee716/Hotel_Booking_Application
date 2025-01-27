import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import WeatherSection from "../components/WeatherSection";
import PromotionalBanner from "../components/Banner";

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
  }
];

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Fetch hotel data
  useEffect(() => {
    axios.get("http://localhost:5000/api/places").then(({ data }) => {
      setPlaces(Array.isArray(data) ? data : []);
    });
  }, []);

  // Slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % places.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [places]);

  return (
    <div className="mt-20">
      {/* Filter Row */}
      <div className="flex justify-center items-center space-x-6 mb-6 px-4">
        {FilterIcons.map((filterItem) => (
          <button
            key={filterItem.name}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 ${
              selectedFilter === filterItem.name 
                ? 'bg-gray-200 text-primary' 
                : 'text-gray-600'
            }`}
            onClick={() => setSelectedFilter(
              selectedFilter === filterItem.name ? null : filterItem.name
            )}
          >
            {filterItem.icon}
            <span className="text-xs mt-1">{filterItem.name}</span>
          </button>
        ))}
      </div>
      {/* Add the Promotional Banner here */}
<PromotionalBanner />

      {/* Weather and Slideshow Section */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 mb-6">
        {/* Rest of the existing IndexPage code remains the same */}
        {/* Slideshow */}
        <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-2xl">
          {places.length > 0 &&
            places.map((place, index) => {
              const imageUrl = place.photos?.[0]?.url
                ? `http://localhost:5000${place.photos[0].url}`
                : null;
              return (
                <div
                  key={place._id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? "opacity-100 z-10" : "opacity-0"
                  }`}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={place.title || "Hotel"}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-2xl">
                      <span className="text-gray-500">Image not available</span>
                    </div>
                  )}
                  {/* Title Overlay */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                    <h2 className="text-lg font-bold">{place.title || "Hotel"}</h2>
                  </div>
                </div>
              );
            })}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {places.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? "bg-blue-600" : "bg-gray-400"
                }`}
              ></span>
            ))}
          </div>
        </div>

        {/* Weather Section */}
        <div className="w-full h-full">
          <WeatherSection />
        </div>
      </div>

      {/* Place Cards */}
      <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {places.length > 0 &&
          places
            .filter(place => 
              !selectedFilter || 
              place.categories?.includes(selectedFilter.toLowerCase())
            )
            .map((place) => (
              <Link
                to={`/place/${place._id}`}
                key={place._id}
                className="transform transition duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="bg-gray-500 mb-2 rounded-2xl flex overflow-hidden">
                  {place.photos?.[0]?.url ? (
                    <img
                      className="rounded-2xl object-cover aspect-square transition duration-300 hover:opacity-90"
                      src={`http://localhost:5000${place.photos[0].url}`}
                      alt={place.title || "Hotel"}
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
            ))}
      </div>
    </div>
  );
}