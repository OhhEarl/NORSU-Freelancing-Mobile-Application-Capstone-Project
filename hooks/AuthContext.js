import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

GoogleSignin.configure({
  webClientId:
    '1070570385371-6p351s3v9d1tr5mvrqfqhbe4vnn59mhb.apps.googleusercontent.com',
});

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const onGoogleButtonPress = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      let url = 'http://10.0.2.2:8000/api/google-callback/auth/google-login';
      let payload = {idToken: idToken};
      let response = await axios.post(url, payload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      console.log(JSON.stringify(data, null, 2));
      if (data && data.user) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user)); // Save user data to AsyncStorage
        await auth().signInWithCredential(googleCredential);
      } else {
        console.error('Error: No data or token received from backend');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        await GoogleSignin.revokeAccess().then(() =>
          navigation.navigate('Login'),
        );
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        showMessage('Sign-in process is in progress.');
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        showMessage('Sign-in is required.');
      } else {
        console.error('Error during Google sign-in:', error);
        navigation.navigate('Login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error loading user data from AsyncStorage:', error);
      }
    };
  
    loadUserData();
  }, []);
  
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, onGoogleButtonPress, userData , setUserData}}>
      {children}
    </AuthContext.Provider>
  );
};

// Your screen component remains unchanged
