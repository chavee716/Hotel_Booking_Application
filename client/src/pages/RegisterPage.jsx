import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Slideshow from "../components/Slideshow.jsx"; // Assuming you have the Slideshow component

// SVG Background patterns component
const BackgroundPattern = () => (
  <div className="absolute inset-0 z-0">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4f46e5", stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: "#7c3aed", stopOpacity: 0.9 }} />
        </linearGradient>
        <pattern id="pattern1" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.2)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" />
      <rect width="100%" height="100%" fill="url(#pattern1)" />
    </svg>
  </div>
);

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function registerUser(ev) {
    ev.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
      });
      alert("Registration successful. Now you can log in");
      navigate("/login");
    } catch {
      alert("Registration failed. Please try again later");
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-100">
      {/* Slideshow (Background) */}
      <div className="absolute inset-0 z-0">
        <Slideshow />
      </div>

      {/* Registration Form */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        <div className="backdrop-blur-lg bg-white/60 p-8 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Register
          </h1>

          <form onSubmit={registerUser} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Register
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-gray-600">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-300"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
