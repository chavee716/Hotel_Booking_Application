import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Slideshow() {
  const [places, setPlaces] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/places').then(({ data }) => {
      setPlaces(Array.isArray(data) ? data : []);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % places.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [places]);

  return (
    <div className="relative w-full h-full">
      {places.length > 0 && places.map((place, index) => (
        <div
          key={place._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'
          }`}
        >
          <img
            src={`http://localhost:5000${place.photos?.[0]?.url}`}
            alt={place.title || "Place Image"}
            className="w-full h-full object-cover rounded-2xl scale-90"
          />
        </div>
      ))}
    </div>
  );
}
