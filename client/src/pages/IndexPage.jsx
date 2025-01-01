import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Image from "../Image.jsx";


export default function IndexPage() {
  const [places,setPlaces] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/places').then(({ data }) => {
      console.log('Fetched places:', data); // Add this line
      if (Array.isArray(data)) {
        setPlaces(data);
      } else {
        console.error('Expected an array but received:', data);
        setPlaces([]); // Fallback to an empty array
      }
    });
  }, []);
  return (
    <div className="mt-8  grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {places.length > 0 && places.map(place => (
        <Link to={'/place/'+place._id}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
          {console.log('Photos for place:', place.photos)} {/* Add this line for debugging */}
            {place.photos?.[0] && (
               
               <Image className="rounded-2xl object-cover aspect-square" src={place.photos[0].url}/*src={`http://localhost:5000${place.photos[0]}`}*/ alt="" />
               //{place.photos[0].url}
            )}
          </div>
          <h2 className="font-bold">{place.title}</h2>
          <h3 className="text-sm text-gray-500">{place.address}</h3>
          <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
          </div>
        </Link>
      ))}
    </div>
  );
}