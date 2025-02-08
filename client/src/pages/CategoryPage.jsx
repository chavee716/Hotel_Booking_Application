import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Real hotel data
const hotelData = [
  {
    _id: "6713ec26e6357575738c1b2d",
    title: "Cinnamon Life at City of Dreams",
    address: "No. 01, Justice Akbar Mawatha, 00200 Colombo, Sri Lanka",
    price: 306,
    features: ["Swimming Pool", "Fitness Center", "Restaurant", "Bar", "24/7 Service", "Ocean View"],
    rating: 4.8,
    reviews: 245,
    category: "luxury"
  },
  {
    _id: "6713ed65e6357575738c1b53",
    title: "Shangri-La Colombo",
    address: "Colombo, Sri Lanka",
    price: 200,
    features: ["Pool", "Spa", "Fine Dining", "Ocean View", "Business Center"],
    rating: 4.9,
    reviews: 380,
    category: "luxury"
  },
  {
    _id: "6713eee3e6357575738c1bda",
    title: "The Kingsbury Colombo",
    address: "Colombo, Sri Lanka",
    price: 141,
    features: ["Harbor View", "Multiple Restaurants", "Rooftop Bar", "Spa", "Pool"],
    rating: 4.7,
    reviews: 290,
    category: "top-cities"
  },
  {
    _id: "6713efb7e6357575738c1c18",
    title: "Sheraton Kosgoda Turtle Beach Resort",
    address: "1 Okanda Road, Hiddaruwa, Naape, 80570 Bentota, Sri Lanka",
    price: 141,
    features: ["Beach Access", "Turtle Watching", "Spa", "Pool", "Water Sports"],
    rating: 4.6,
    reviews: 215,
    category: "beach"
  },
  {
    _id: "6713f045e6357575738c1c65",
    title: "Taj Bentota Resort & Spa",
    address: "Bentota, 80500 Bentota, Sri Lanka",
    price: 90,
    features: ["Beachfront", "Spa", "Multiple Pools", "Water Sports", "Fine Dining"],
    rating: 4.7,
    reviews: 325,
    category: "beach"
  },
  {
    _id: "6713f0e5e6357575738c1cba",
    title: "Marino Beach Colombo",
    address: "590 Marine Drive, 00300 Colombo, Sri Lanka",
    price: 100,
    features: ["Beach View", "Rooftop Pool", "Fitness Center", "Restaurant", "Bar"],
    rating: 4.5,
    reviews: 180,
    category: "beach"
  },
  {
    _id: "6713f8fc31848329188bf385",
    title: "Heritance Kandalama",
    address: "P.O Box 11, Heritance Kandalama, 21100 Sigiriya, Sri Lanka",
    price: 187,
    features: ["Lake View", "Infinity Pool", "Eco-Friendly", "Spa", "Nature Trails", "Wildlife"],
    rating: 4.8,
    reviews: 420,
    category: "amazing-views"
  },
  {
    _id: "6713f98d31848329188bf3f4",
    title: "Jetwing Lighthouse",
    address: "Dadella, Galle, 80000 Galle, Sri Lanka",
    price: 210,
    features: ["Ocean View", "Colonial Architecture", "Spa", "Pool", "Fine Dining"],
    rating: 4.7,
    reviews: 265,
    category: "historic-sites"
  },
  {
    _id: "6713fa1931848329188bf46b",
    title: "Earl's Regency Hotel",
    address: "Earl's Regency Tennekumbura, 20000 Kandy, Sri Lanka",
    price: 150,
    features: ["Mountain View", "Spa", "Pool", "Cultural Tours", "Gardens"],
    rating: 4.6,
    reviews: 195,
    category: "mountains"
  },
  {
    _id: "6798d9d173f68bb9c023a6bc",
    title: "Hilton Colombo",
    address: "2 Sir Chittampalam A Gardiner Mawatha, Colombo 02, Fort, 00200 Colombo",
    price: 196,
    features: ["Ocean View", "Business Center", "Multiple Restaurants", "Spa", "Pool"],
    rating: 4.7,
    reviews: 450,
    category: "top-cities"
  },
  {
    _id: "6798da6873f68bb9c023a6cc",
    title: "Taj Samudra, Colombo",
    address: "25, Galle Face Centre Road, 09411 Colombo, Sri Lanka",
    price: 200,
    features: ["Ocean View", "Luxury Spa", "Fine Dining", "Pool", "Fitness Center", "Business Center"],
    rating: 4.8,
    reviews: 380,
    category: "luxury"
  },
  {
    _id: "6798dae873f68bb9c023a6e4",
    title: "Amari Colombo, Sri Lanka",
    address: "254 Galle Road, Kollupitiya, 00300 Colombo, Sri Lanka",
    price: 299,
    features: ["Beach Access", "Rooftop Pool", "Spa", "Restaurants", "Fitness Center", "City View"],
    rating: 4.6,
    reviews: 210,
    category: "top-cities"
  },
  {
    _id: "6798db7a73f68bb9c023a723",
    title: "Fairway Colombo",
    address: "No. 07, Hospital Street, Colombo 01, Fort, 10000 Colombo, Sri Lanka",
    price: 130,
    features: ["City View", "Restaurant", "Business Center", "Fitness Center", "Modern Design", "Central Location"],
    rating: 4.5,
    reviews: 175,
    category: "top-cities"
  }
];

// Modified function to use real hotel data
const getHotelsByCategory = (category) => {
  // If no category is specified, return all hotels
  if (!category) return hotelData;
  
  // Convert category to URL-friendly format
  const formattedCategory = category.toLowerCase().replace(' ', '-');
  
  // Filter hotels by category
  return hotelData.filter(hotel => hotel.category === formattedCategory);
};

const CategoryPage = () => {
  const { category } = useParams();
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const filteredHotels = getHotelsByCategory(category);
        setHotels(filteredHotels);
        setError(null);
      } catch (err) {
        setError('Failed to load hotels. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [category]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {category.replace('-', ' ')} Destinations
      </h1>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {hotels.map((hotel) => (
          <Link
            key={hotel._id}
            to={`/place/${hotel._id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            <div className="relative pb-[75%]">
              <img
                src={`/api/placeholder/400/300`}
                alt={hotel.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="font-bold text-lg mb-2 truncate">{hotel.title}</h2>
              <p className="text-gray-600 text-sm mb-2 truncate">{hotel.address}</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-gray-700">{hotel.rating}</span>
                <span className="text-gray-500 text-sm ml-1">({hotel.reviews} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {hotel.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <div className="text-lg font-bold">
                ${hotel.price}
                <span className="text-gray-500 text-sm font-normal"> /night</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;