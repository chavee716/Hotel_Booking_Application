import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../components/BookingWidget";
import PlaceGallery from "../components/PlaceGallery";
import AddressLink from "../components/AddressLink";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`http://localhost:5000/api/places/${id}`).then(response => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return '';

  return (
    <div className="mt-9 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl transition duration-300 hover:text-blue-600">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} className="transition duration-300 hover:opacity-90" />
      <div className="mt-8 mb-8 mx-4 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr] animate-fadeIn">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            <p className="leading-6 text-gray-700">{place.description}</p>
          </div>
          Check-in: {place.checkIn}<br />
          Check-out: {place.checkOut}<br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5 animate-slideInUp">{place.extraInfo}</div>
      </div>
    </div>
  );
}
