import React, { useState } from 'react';

const FilteredHotels = () => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  
  // Sample hotel data - in practice, this would come from your API
  const hotels = [
    {
      id: 1,
      name: "Beachfront Resort",
      category: "beach",
      price: 299,
      location: "Miami Beach, FL",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "Mountain Lodge",
      category: "mountains",
      price: 199,
      location: "Aspen, CO",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      name: "Historic Castle Hotel",
      category: "castles",
      price: 499,
      location: "Edinburgh, Scotland",
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      name: "Luxury Island Resort",
      category: "islands",
      price: 599,
      location: "Maldives",
      image: "/api/placeholder/300/200"
    }
  ];

  // Filter icons
  const FilterIcons = [
    {
      name: 'Beach',
      category: 'beach',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.073 0-4.114.224-6 .655V21" />
        </svg>
      )
    },
    {
      name: 'Mountains',
      category: 'mountains',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-1.86 8.269 8.269 0 003 2.274 8.216 8.216 0 00-1 4.338 8.256 8.256 0 003 3z" />
        </svg>
      )
    },
    {
      name: 'Castles',
      category: 'castles',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934a1.12 1.12 0 01-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934a1.125 1.125 0 011.006 0l4.994 2.497a1.125 1.125 0 001.006 0l4.994-2.497a1.125 1.125 0 011.006 0l3.869 1.934c.748.374 1.628-.17 1.628-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934a1.125 1.125 0 01-1.006 0L15 3.75" />
        </svg>
      )
    },
    {
      name: 'Islands',
      category: 'islands',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47-2.657A3.001 3.001 0 0015.5 9h-7c-1.054 0-1.875.897-1.875 2l2.25 2h7a2 2 0 012 2v1.5m-19-11l19 11m-19-11a3 3 0 013-3h14a3 3 0 013 3m-19 11v-3.5c0-.621.504-1.125 1.125-1.125h.375c.621 0 1.125.504 1.125 1.125v3.5" />
        </svg>
      )
    }
  ];

  // Filter hotels based on selected category
  const filteredHotels = selectedFilter
    ? hotels.filter(hotel => hotel.category === selectedFilter.toLowerCase())
    : hotels;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Icons */}
      <div className="flex justify-center gap-6 mb-8">
        {FilterIcons.map((filter) => (
          <button
            key={filter.name}
            onClick={() => setSelectedFilter(selectedFilter === filter.category ? null : filter.category)}
            className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
              selectedFilter === filter.category
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {filter.icon}
            <span className="text-sm mt-2">{filter.name}</span>
          </button>
        ))}
      </div>

      {/* Hotel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{hotel.name}</h3>
              <p className="text-gray-600 mb-2">{hotel.location}</p>
              <p className="text-blue-600 font-bold">${hotel.price} per night</p>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredHotels.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No hotels found for this category.
        </div>
      )}
    </div>
  );
};

export default FilteredHotels;