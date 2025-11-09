import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase.config';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)',
        color: 'white',
        fontFamily: 'Lexend, sans-serif'
      }}>
        <div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(79, 124, 255, 0.2)',
            borderRadius: '50%',
            borderTopColor: '#4f7cff',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;