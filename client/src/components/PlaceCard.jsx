import React from 'react';
import { Link } from 'react-router-dom';

const PlaceCard = React.memo(({ place }) => (
  <Link
    to={`/place/${place._id}`}
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
  >
    <div className="relative pb-[75%]">
      <img
        src={`http://localhost:5000${place.photos[0].url}`}
        alt={place.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2 truncate">{place.title}</h2>
      <p className="text-gray-600 text-sm mb-2 truncate">{place.address}</p>
      <div className="flex items-center mb-2">
        <span className="text-yellow-500 mr-1">★</span>
        <span className="text-gray-700">{place.rating || '4.5'}</span>
        <span className="text-gray-500 text-sm ml-1">({place.reviews || '100'} reviews)</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {place.features?.map((feature, index) => (
          <span 
            key={index}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {feature}
          </span>
        ))}
      </div>
      <div className="text-lg font-bold">
        ${place.price}
        <span className="text-gray-500 text-sm font-normal"> /night</span>
      </div>
    </div>
  </Link>
));

export default PlaceCard;