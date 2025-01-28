import PhotosUploader from "../components/PhotosUploader.jsx";
import Perks from "../components/Perks.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import AccountNav from "../components/AccountNav.jsx";
import {Navigate, useParams} from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

export default function PlacesFormPage() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [address,setAddress] = useState('');
  const [addedPhotos,setAddedPhotos] = useState([]);
  const [description,setDescription] = useState('');
  const [perks,setPerks] = useState([]);
  const [extraInfo,setExtraInfo] = useState('');
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [maxGuests,setMaxGuests] = useState(1);
  const [price,setPrice] = useState(100);
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axiosInstance.get(`/api/places/${id}`).then(response => {
       const {data} = response;
       setTitle(data.title);
       setAddress(data.address);
       setAddedPhotos(data.photos?.map(photo => photo.url || photo) || []);
       setDescription(data.description);
       setPerks(data.perks);
       setExtraInfo(data.extraInfo);
       setCheckIn(data.checkIn);
       setCheckOut(data.checkOut);
       setMaxGuests(data.maxGuests);
       setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  }

  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }

  function preInput(header,description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    try {
      const placeData = {
        title, 
        address,
        photos: addedPhotos.map(photo => ({
          url: typeof photo === 'string' ? photo : photo.url
        })),
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests: parseInt(maxGuests),
        price: parseInt(price),
      };
      
      if (id) {
        await axiosInstance.put('/api/places', {
          id, ...placeData
        });
      } else {
        await axiosInstance.post('/api/places', placeData);
      }
      setRedirect(true);
    } catch (error) {
      console.error('Error saving place:', error);
      if (error.response?.data) {
        console.error('Server response:', error.response.data);
        alert(error.response.data.error || 'Failed to save place');
      } else {
        alert('Failed to save place. Please check your connection and try again.');
      }
    }
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
        <input type="text" 
               value={title} 
               onChange={ev => setTitle(ev.target.value)} 
               placeholder="title, for example: My lovely apt"
               className="w-full border my-1 py-2 px-3 rounded-2xl"/>

        {preInput('Address', 'Address to this place')}
        <input type="text" 
               value={address} 
               onChange={ev => setAddress(ev.target.value)}
               placeholder="address"
               className="w-full border my-1 py-2 px-3 rounded-2xl"/>

        {preInput('Photos','more = better')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput('Description','description of the place')}
        <textarea value={description} 
                  onChange={ev => setDescription(ev.target.value)}
                  className="w-full border my-1 py-2 px-3 rounded-2xl" />

        {preInput('Perks','select all the perks of your place')}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput('Extra info','house rules, etc')}
        <textarea value={extraInfo} 
                  onChange={ev => setExtraInfo(ev.target.value)}
                  className="w-full border my-1 py-2 px-3 rounded-2xl" />

        {preInput('Check in&out times','add check in and out times, remember to have some time window for cleaning the room between guests')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input type="text"
                   value={checkIn}
                   onChange={ev => setCheckIn(ev.target.value)}
                   placeholder="14"
                   className="w-full border my-1 py-2 px-3 rounded-2xl"/>
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input type="text"
                   value={checkOut}
                   onChange={ev => setCheckOut(ev.target.value)}
                   placeholder="11"
                   className="w-full border my-1 py-2 px-3 rounded-2xl" />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input type="number" 
                   value={maxGuests}
                   onChange={ev => setMaxGuests(ev.target.value)}
                   className="w-full border my-1 py-2 px-3 rounded-2xl"/>
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input type="number" 
                   value={price}
                   onChange={ev => setPrice(ev.target.value)}
                   className="w-full border my-1 py-2 px-3 rounded-2xl"/>
          </div>
        </div>
        <div>
          <button className="primary my-4">Save</button>
        </div>
      </form>
    </div>
  );
}