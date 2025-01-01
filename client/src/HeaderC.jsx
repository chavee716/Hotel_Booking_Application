import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [searchMode, setSearchMode] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const searchBarRef = useRef(null);
  const userDropdownRef = useRef(null);

  const SearchModes = {
    STAY: 'stay',
    EXPERIENCE: 'experience',
    ONLINE_EXPERIENCE: 'online_experience'
  };

  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Handle search bar clicks
      if (
        searchBarRef.current && 
        !searchBarRef.current.contains(event.target) &&
        !event.target.closest('.search-trigger')
      ) {
        setSearchMode(null);
      }

      // Handle user dropdown clicks
      if (
        userDropdownRef.current && 
        !userDropdownRef.current.contains(event.target) &&
        !event.target.closest('.user-menu-trigger')
      ) {
        setIsUserDropdownOpen(false);
      }
    }

    if (searchMode || isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [searchMode, isUserDropdownOpen]);

  // Don't show header on auth pages
  const shouldHideHeader = 
    location.pathname === '/login' || 
    location.pathname === '/register';

  const handleSearchParamChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    try {
      navigate('/search', { state: { searchParams } });
      setSearchMode(null);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSearchIconClick = (e) => {
    e.stopPropagation();
    setSearchMode(SearchModes.STAY);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
      setIsUserDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      window.location.reload();
    }
  };
  

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
      setIsUserDropdownOpen(false);
    } else {
      navigate('/login');
      setIsUserDropdownOpen(false);
    }
  };
  const handleLoginClick = () => {
    navigate('/login');
  };

  const SearchBar = () => {
    const renderSearchContent = () => {
      switch(searchMode) {
        case SearchModes.STAY:
          return (
            <div className="grid grid-cols-4 gap-4 p-6 bg-white shadow-2xl rounded-2xl">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-2">Where</label>
                <input 
                  type="text" 
                  placeholder="Search destinations" 
                  value={searchParams.destination}
                  onChange={(e) => handleSearchParamChange('destination', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Check in</label>
                <input 
                  type="date" 
                  value={searchParams.checkIn}
                  onChange={(e) => handleSearchParamChange('checkIn', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Check out</label>
                <input 
                  type="date" 
                  value={searchParams.checkOut}
                  onChange={(e) => handleSearchParamChange('checkOut', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-bold text-gray-600 mb-2">Who</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleSearchParamChange('guests', Math.max(1, searchParams.guests - 1))}
                    className="p-2 border rounded-l-lg hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={searchParams.guests}
                    onChange={(e) => handleSearchParamChange('guests', parseInt(e.target.value) || 1)}
                    className="w-full p-3 text-center border-t border-b focus:outline-none"
                    min="1"
                  />
                  <button 
                    onClick={() => handleSearchParamChange('guests', searchParams.guests + 1)}
                    className="p-2 border rounded-r-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-span-1 flex items-end">
                <button 
                  onClick={handleSearch}
                  className="w-full bg-primary text-white p-3 rounded-lg hover:bg-red-600 transition"
                >
                  Search
                </button>
              </div>
            </div>
          );
        case SearchModes.EXPERIENCE:
          return (
            <div className="grid grid-cols-3 gap-4 p-6 bg-white shadow-2xl rounded-2xl">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-2">Where</label>
                <input 
                  type="text" 
                  placeholder="Search experiences" 
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          );
        case SearchModes.ONLINE_EXPERIENCE:
          return (
            <div className="grid grid-cols-2 gap-4 p-6 bg-white shadow-2xl rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">What experience?</label>
                <input 
                  type="text" 
                  placeholder="Search online experiences" 
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div 
        ref={searchBarRef}
        className={`fixed left-0 right-0 top-20 z-50 ${searchMode ? 'block' : 'hidden'}`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-white rounded-full shadow-lg">
              {Object.values(SearchModes).map(mode => (
                <button
                  key={mode}
                  onClick={() => setSearchMode(mode)}
                  className={`
                    px-4 py-2 rounded-full transition
                    ${searchMode === mode 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  {mode === SearchModes.STAY && 'Stays'}
                  {mode === SearchModes.EXPERIENCE && 'Experiences'}
                  {mode === SearchModes.ONLINE_EXPERIENCE && 'Online Experiences'}
                </button>
              ))}
            </div>
          </div>
          {renderSearchContent()}
        </div>
      </div>
    );
  };

  if (shouldHideHeader) {
    return null;
  }

  return (
    <div className="relative">
      <header className="fixed w-full top-0 bg-white shadow-sm z-50">
        <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
          {/* Logo */}
          <div 
            className="flex items-center gap-1 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 -rotate-90">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            <span className="font-bold text-lg">airbnb</span>
          </div>

          {/* Search Trigger - Only show when user is logged in */}
          {user && (
            <div 
              className="search-trigger flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => setSearchMode(SearchModes.STAY)}
            >
              <span className="text-sm font-medium mr-4">Where to?</span>
              <button 
                onClick={handleSearchIconClick}
                className="bg-primary text-white rounded-full p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
          )}

          {/* User Menu */}
          <div className="relative" ref={userDropdownRef}>
            {user ? (
              <>
                <button
                  className="user-menu-trigger flex items-center gap-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  <div className="bg-gray-500 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition"
                    >
                      Profile
                    </button>
                    <hr />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-primary text-white rounded-full px-6 py-2 hover:bg-red-600 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar - Only show when user is logged in */}
      {user && <SearchBar />}
      
      {/* Overlay */}
      {user && searchMode && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setSearchMode(null)}
        />
      )}
    </div>
  );
}