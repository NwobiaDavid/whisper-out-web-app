/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { checkAuthStatus } from './firebase';
import { Spinner } from '@nextui-org/react';
import { User } from 'firebase/auth'; // Import User type from Firebase

// Define a type for the user object and the context
interface UserType {
  uid: string;
  email: string | null; // Allow email to be null
}

interface AuthContextType {
  user: UserType | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Update the checkAuthStatus function signature to accept Firebase User type
  const handleSetUser = (firebaseUser: User | null) => {
    if (firebaseUser) {
      const userData: UserType = {
        uid: firebaseUser.uid,
        email: firebaseUser.email, // This can be null
      };
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus(handleSetUser, setLoading); // Pass handleSetUser instead of setUser
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
