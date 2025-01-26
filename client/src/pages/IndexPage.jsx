import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [weatherData, setWeatherData] = useState([]);

  // Fetch hotel data
  useEffect(() => {
    axios.get('http://localhost:5000/api/places').then(({ data }) => {
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

  // Fetch weather data via backend proxy
  useEffect(() => {
    const cities = ["Colombo", "Kandy", "Galle", "Jaffna"];
    const fetchWeather = async () => {
      try {
        const weatherPromises = cities.map((city) =>
          axios.get(`http://localhost:5000/api/weather?city=${city}`)
        );
        const responses = await Promise.all(weatherPromises);
        const weather = responses.map((res) => ({
          city: res.data.name,
          temp: res.data.main.temp,
          description: res.data.weather[0].description,
        }));
        setWeatherData(weather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="mt-20">
      {/* Weather and Slideshow Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Slideshow */}
        <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-2xl">
          {places.length > 0 && places.map((place, index) => {
            const imageUrl = place.photos?.[0]?.url
              ? `http://localhost:5000${place.photos[0].url}`
              : null;
            return (
              <div
                key={place._id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'
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
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              ></span>
            ))}
          </div>
        </div>

        {/* Weather Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Current Weather in Sri Lanka</h2>
          {weatherData.length > 0 ? (
            <ul>
              {weatherData.map((weather, index) => (
                <li key={index} className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{weather.city}</h3>
                    <p className="text-gray-500">{weather.description}</p>
                  </div>
                  <span className="text-xl font-bold">{weather.temp}°C</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Loading weather data...</p>
          )}
        </div>
      </div>

      {/* Place Cards */}
      <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {places.length > 0 &&
          places.map((place) => (
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