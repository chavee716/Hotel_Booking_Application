import axios from 'axios';

export const searchPlaces = async (searchParams) => {
  try {
    const response = await axios.get('/api/places/search', { 
      params: searchParams 
    });

    // Log the entire response
    console.log('Full API Response:', response.data);

    // Return the places array or an empty array
    return response.data.places || [];
  } catch (error) {
    console.error('Search places error:', error);
    throw error;
  }
};