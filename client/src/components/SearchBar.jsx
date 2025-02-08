import React, { useState } from 'react';

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [guests, setGuests] = useState(1);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleGuestChange = (type) => {
    if (type === 'increment') {
      setGuests(prev => prev + 1);
    } else if (type === 'decrement' && guests > 1) {
      setGuests(prev => prev - 1);
    }
  };

  const handleSearch = () => {
    // Handle search logic here
    console.log('Searching for:', searchValue, 'with', guests, 'guests');
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Where</label>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder="Where to?"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Guests</label>
        <div className="flex items-center border rounded">
          <button
            onClick={() => handleGuestChange('decrement')}
            className="px-4 py-2 border-r hover:bg-gray-100"
          >
            -
          </button>
          <span className="flex-1 text-center py-2">{guests}</span>
          <button
            onClick={() => handleGuestChange('increment')}
            className="px-4 py-2 border-l hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;