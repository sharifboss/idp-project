import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase';  // Import Firebase auth

const ProtectedAdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);  // For loading state

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);  // Stop loading once the auth check is complete
        return;
      }

      const idTokenResult = await user.getIdTokenResult();
      setIsAdmin(idTokenResult.claims.admin === true);
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  // Show loading state if the check is ongoing
  if (loading) return <div>Loading...</div>;

  // If the user is not admin or not logged in, redirect to login
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;  // Allow access to protected route if admin
};

export default ProtectedAdminRoute;
