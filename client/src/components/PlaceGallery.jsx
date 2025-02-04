import { useState } from "react";
import Image from "./Image.jsx";

export default function PlaceGallery({ place }) {
  const [showFullScreenPhotos, setShowFullScreenPhotos] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Function to handle opening the full-screen photo view
  const openFullScreenPhotos = (index) => {
    setCurrentPhotoIndex(index);
    setShowFullScreenPhotos(true);
  };

  // Function to handle closing the full-screen photo view
  const closeFullScreenPhotos = () => {
    setShowFullScreenPhotos(false);
  };

  // Function to handle navigating to the next photo
  const navigateToNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % place.photos.length);
  };

  // Function to handle navigating to the previous photo
  const navigateToPreviousPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + place.photos.length) % place.photos.length);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-2 rounded-3xl overflow-hidden h-[400px]">
        {place.photos?.[0] && (
          <Image
            onClick={() => openFullScreenPhotos(0)}
            className="w-full h-full object-cover cursor-pointer"
            src={place.photos[0].url}
            alt=""
          />
        )}
        {place.photos?.[1] && (
          <Image
            onClick={() => openFullScreenPhotos(1)}
            className="w-full h-1/2 object-cover cursor-pointer"
            src={place.photos[1].url}
            alt=""
          />
        )}
        {place.photos?.[2] && (
          <Image
            onClick={() => openFullScreenPhotos(2)}
            className="w-full h-1/2 object-cover cursor-pointer"
            src={place.photos[2].url}
            alt=""
          />
        )}
      </div>
      <button
        onClick={() => openFullScreenPhotos(0)}
        className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
            clipRule="evenodd"
          />
        </svg>
        Show more photos
      </button>

      {showFullScreenPhotos && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div className="max-h-[90vh] overflow-auto">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={navigateToPreviousPhoto}
                  className="bg-white text-black rounded-full p-2 shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <Image
                  src={place.photos[currentPhotoIndex]}
                  alt={`Photo ${currentPhotoIndex + 1}`}
                  className="max-w-3xl w-full object-contain"
                />
                <button
                  onClick={navigateToNextPhoto}
                  className="bg-white text-black rounded-full p-2 shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 8.72 6.03a.75.75 0 011.06-1.06l7.5 7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={closeFullScreenPhotos}
                className="fixed top-4 right-4 bg-white text-black rounded-full p-2 shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}