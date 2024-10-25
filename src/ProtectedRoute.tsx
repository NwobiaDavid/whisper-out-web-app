/* eslint-disable react/prop-types */

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './config/AuthContext.tsx'; 
import { ReactNode } from 'react'; 

interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}

interface ProtectedRouteProps {
  children: ReactNode; 
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;
  
  if (!user) {
    return <Navigate to="/" replace={true} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
