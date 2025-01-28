import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherSection = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch weather data via backend proxy
  useEffect(() => {
    const cities = ["Colombo", "Kandy", "Galle", "Jaffna", "Trincomalee", "Nuwara Eliya", "Matara","Hambantota"];
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

  // Handle automatic slideshow for locations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % weatherData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [weatherData]);

  return (
    <div className="relative w-full h-full p-6 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-indigo-100 via-green-200 to-blue-300">
      {/* Cloud Animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="cloud cloud-1 absolute left-4 top-4 w-16 h-8 bg-gray-200 rounded-full opacity-70 animate-float"></div>
        <div className="cloud cloud-2 absolute right-4 top-8 w-20 h-10 bg-gray-200 rounded-full opacity-70 animate-float-delayed"></div>
        <div className="rain absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="raindrop absolute bg-blue-300 w-[2px] h-6 opacity-70 animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Title at the top */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 relative z-10 text-center pt-4">Weather Today</h2>

      {weatherData.length > 0 ? (
        <div className="relative z-10 pt-12">
          {/* Weather Slideshow */}
          <div className="h-full transition-all duration-1000 ease-in-out text-gray-800">
            {weatherData.map((weather, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-between ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } transition-opacity duration-1000`}
              >
                <div className="pl-6">
                  <h3 className="font-bold text-lg">{weather.city}</h3>
                  <p className="text-gray-600">{weather.description}</p>
                </div>
                <span className="text-xl font-bold pr-6">{weather.temp}°C</span>
              </div>
            ))}
          </div>

          {/* Dots for Slideshow - Adjusted position */}
          <div className="absolute bottom--30 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {weatherData.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? "bg-blue-500" : "bg-gray-400"
                }`}
              ></span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-600 relative z-10 text-center">Loading weather data...</p>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes rain {
          0% {
            transform: translateY(0);
            opacity: 0.7;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite 1s;
        }

        .animate-rain {
          animation: rain 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WeatherSection;
