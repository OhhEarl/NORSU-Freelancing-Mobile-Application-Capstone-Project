// authContext.js
import React, { createContext, useState, useEffect } from 'react';
import useAuth from './useAuth';
const AuthContext = createContext();


const AuthProvider = ({ children }) => {
 
  const { user, isLoading, error } = useAuth(); // Access data from your useAuth hook


  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
