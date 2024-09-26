/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from 'react';
import { checkAuthStatus } from './firebase.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus(setUser, setLoading);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while checking auth status
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};