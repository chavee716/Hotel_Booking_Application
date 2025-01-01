import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchPlaces } from '../searchService';

export default function SearchResultsPage() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = location.state?.searchParams || {};
    
    const fetchResults = async () => {
      try {
        // Log the search parameters to debug
        console.log('Search Params:', searchParams);

        const searchResults = await searchPlaces(searchParams);
        
        // Log the raw search results
        console.log('Search Results:', searchResults);

        // Ensure results is always an array
        setResults(Array.isArray(searchResults) ? searchResults : []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchResults();
  }, [location.state]);

  if (loading) return <div>Loading...</div>;
  
  if (error) return <div>Error loading results: {error.message}</div>;

  if (results.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <div>
      <h1>Search Results</h1>
      {results.map(place => (
        <div key={place.id || place._id}>
          <h2>{place.title || 'Untitled Place'}</h2>
          <p>{place.description || 'No description available'}</p>
        </div>
      ))}
    </div>
  );
}