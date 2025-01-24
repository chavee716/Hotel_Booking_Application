import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    if (!user) {
      setRedirect('/login');
      return;
    }

    if (numberOfNights <= 0) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }

    const response = await axios.post('http://localhost:5000/api/bookings', {
      checkIn, checkOut, numberOfGuests, name, phone,
      place: place._id,
      price: numberOfNights * place.price,
    });

    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={ev => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={ev => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-7 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            min="1"
            value={numberOfGuests}
            onChange={ev => setNumberOfGuests(Math.max(1, ev.target.value))}
          />
        </div>
        {numberOfNights > 0 && (
        <div className="py-3 px-4 border-t">
        <label>Your full name:</label>
        <input
          type="text"
          value={name}
          onChange={ev => setName(ev.target.value)}
          placeholder="Enter your full name"
          className="border p-2 rounded-md w-full"
        />
        <label>Phone number:</label>
        <input
          type="tel"
          value={phone}
          onChange={ev => {
            // Allow only numbers and limit to 10 digits
            const value = ev.target.value.replace(/\D/g, '').slice(0, 10);
            setPhone(value);
          }}
          placeholder="Enter your phone number"
          className="border p-2 rounded-md w-full"
          maxLength="10" // Limit the input to 10 digits
        />
      </div>
      
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfNights > 0 && (
          <span> ${numberOfNights * place.price}</span>
        )}
      </button>
    </div>
  );
}
