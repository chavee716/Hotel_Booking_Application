import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for user on component mount
    axios.get('/api/profile', {
      withCredentials: true  // Important for cookies
    })
      .then(({data}) => {
        if (data) {
          setUser(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      })
      .finally(() => {
        setReady(true);  // Set ready regardless of success/failure
      });
  }, []); // Empty dependency array means this runs once on mount

  return (
    <UserContext.Provider value={{user, setUser, ready}}>
      {children}
    </UserContext.Provider>
  );
}