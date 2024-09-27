/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from 'react';
import { checkAuthStatus } from './firebase.js';
import { Spinner } from '@nextui-org/spinner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus(setUser, setLoading);
  }, []);

  if (loading) {
    return <div className="w-screen h-screen flex justify-center items-center" > 
      <Spinner />
    </div>; 
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};