import React, { createContext, useContext , useEffect} from 'react';
import useAuth from './useAuth';
import {ActivityIndicator} from 'react-native';
const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { user, isLoading, error, onGoogleButtonPress, userData , userInformation} = useAuth();


  if (userData) {
    console.log('the user data isss:', userData);
    // Use userData here
  } else {
    return <ActivityIndicator size="large"  />;
  }

      console.log('the user data isss:', userInformation);
  

  return (
    <AuthContext.Provider value={{ user, isLoading, error, onGoogleButtonPress, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
