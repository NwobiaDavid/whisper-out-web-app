/* eslint-disable react/prop-types */

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './config/AuthContext.jsx'; // Import AuthContext

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext); // Get user from AuthContext

  if (!user) {
    // If user is not authenticated, redirect to sign-in page
    return <Navigate to="/" replace={true} />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;
