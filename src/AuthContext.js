// AuthContext.js
import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const isAuthenticated = () => {
    // Add your authentication logic here
    // Return true if the user is authenticated, otherwise return false
    return true; // Placeholder value, replace it with your actual authentication check
  };

  return <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
