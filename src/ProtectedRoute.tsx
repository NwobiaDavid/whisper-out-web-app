/* eslint-disable react/prop-types */

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './config/AuthContext.tsx'; // Import AuthContext
import { ReactNode } from 'react';  // Import ReactNode for typing children

interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}

interface ProtectedRouteProps {
  children: ReactNode;  // Define children type as ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;
  
  if (!user) {
    // If user is not authenticated, redirect to sign-in page
    return <Navigate to="/" replace={true} />;
  }

  // Otherwise, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
