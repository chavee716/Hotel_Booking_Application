import axios from 'axios';

export const searchPlaces = async (searchParams) => {
  try {
    const response = await axios.get('http://localhost:5000/api/places/search', { 
      params: {
        query: searchParams.destination,
        guests: searchParams.guests
      }
    });
    return response.data.places || [];
  } catch (error) {
    console.error('Search places error:', error);
    throw error;
  }
};