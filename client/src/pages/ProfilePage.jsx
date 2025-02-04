import {useContext, useEffect, useState} from "react";
import {UserContext} from "../components/UserContext.jsx";
import {Link, Navigate, useParams} from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav.jsx";

export default function ProfilePage() {
  const [redirect,setRedirect] = useState(null);
  const {ready,user,setUser} = useContext(UserContext);
  const [userName, setUserName] = useState('');
  const [userPlaces, setUserPlaces] = useState([]);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    if (user && user.name) {
      localStorage.setItem('userName', user.name);
      setUserName(user.name);
    }
  }, [user]);

  // Fetch user's places with booking information
  useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/api/user-places-bookings')
        .then(response => {
          setUserPlaces(response.data);
        })
        .catch(error => {
          console.error('Error fetching user places:', error);
        });
    }
  }, [user]);

  let {subpage} = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('http://localhost:5000/api/logout');
    setRedirect('/');
    setUser(null);
  }

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {userName} ({user.email})<br />
          {userPlaces.length > 0 && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Your Accommodations</h2>
              {userPlaces.map((place) => (
                <div key={place._id} className="mb-2 p-2 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{place.title}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {place.bookingCount} Booking{place.bookingCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
    </div>
  );
}