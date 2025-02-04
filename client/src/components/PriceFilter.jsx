import React, { useState, useEffect } from 'react';

const PriceFilter = ({ results, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentRange, setCurrentRange] = useState({ min: 0, max: 1000 });
  const [tempRange, setTempRange] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    if (results.length > 0) {
      const prices = results.map(place => place.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange({ min: minPrice, max: maxPrice });
      setCurrentRange({ min: minPrice, max: maxPrice });
      setTempRange({ min: minPrice, max: maxPrice });
    }
  }, [results]);

  const handleInputChange = (type, value) => {
    const newRange = {
      ...tempRange,
      [type]: parseInt(value)
    };
    setTempRange(newRange);
  };

  const handleSliderChange = (type, value) => {
    const newRange = {
      ...tempRange,
      [type]: parseInt(value)
    };
    setTempRange(newRange);
  };

  const applyFilter = () => {
    setCurrentRange(tempRange);
    onFilterChange(tempRange);
  };

  const resetFilter = () => {
    setTempRange(priceRange);
    setCurrentRange(priceRange);
    onFilterChange(priceRange);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold mb-4">Price Range</h3>
      
      {/* Price Range Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-2/5">
            <label className="block text-sm text-gray-600 mb-1">Min Price</label>
            <div className="relative">
              <span className="absolute left-1 top-4 text-gray-500">$</span>
              <input
                type="number"
                value={tempRange.min}
                onChange={(e) => handleInputChange('min', e.target.value)}
                min={priceRange.min}
                max={tempRange.max}
                className="w-full pl-7 pr-3 py-1 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="w-2/5">
            <label className="block text-sm text-gray-600 mb-1">Max Price</label>
            <div className="relative">
              <span className="absolute left-1 top-4 text-gray-500">$</span>
              <input
                type="number"
                value={tempRange.max}
                onChange={(e) => handleInputChange('max', e.target.value)}
                min={tempRange.min}
                max={priceRange.max}
                className="w-full pl-7 pr-3 py-1 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Price Range Sliders */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum Price</label>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={tempRange.min}
              onChange={(e) => handleSliderChange('min', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Maximum Price</label>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={tempRange.max}
              onChange={(e) => handleSliderChange('max', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={applyFilter}
            className="flex-1 bg-primary text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            Apply Filter
          </button>
          <button
            onClick={resetFilter}
            className="px-4 py-2 text-sm text-gray-600 hover:text-primary border rounded hover:border-primary transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;