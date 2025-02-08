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
    const newValue = parseInt(value) || 0;
    if (type === 'min' && newValue <= tempRange.max) {
      setTempRange(prev => ({ ...prev, min: newValue }));
    } else if (type === 'max' && newValue >= tempRange.min) {
      setTempRange(prev => ({ ...prev, max: newValue }));
    }
  };

  const handleSliderChange = (type, value) => {
    const newValue = parseInt(value);
    if (type === 'min' && newValue <= tempRange.max) {
      setTempRange(prev => ({ ...prev, min: newValue }));
    } else if (type === 'max' && newValue >= tempRange.min) {
      setTempRange(prev => ({ ...prev, max: newValue }));
    }
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
    <div className="bg-gray-200 p-4 rounded-lg shadow mb-4">
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

        {/* Dual Range Slider */}
        <div className="mt-6 mb-2">
          <label className="block text-sm text-gray-600 mb-3">Price Range</label>
          <div className="relative h-2">
            <div className="absolute w-full h-full bg-gray-200 rounded"></div>
            <div
              className="absolute h-full bg-primary rounded"
              style={{
                left: `${((tempRange.min - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                right: `${100 - ((tempRange.max - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`
              }}
            ></div>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={tempRange.min}
              onChange={(e) => handleSliderChange('min', e.target.value)}
              className="absolute w-full h-full appearance-none pointer-events-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:appearance-none"
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={tempRange.max}
              onChange={(e) => handleSliderChange('max', e.target.value)}
              className="absolute w-full h-full appearance-none pointer-events-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:appearance-none"
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