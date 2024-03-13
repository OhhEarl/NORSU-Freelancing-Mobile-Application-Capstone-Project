import React, { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '../hooks/AuthContext';
const Logout = () => {
  const {setUserData} = useAuthContext();
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          await setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error loading user data from AsyncStorage:', error);
      }
    };
    loadUserData();
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      let url = 'http://10.0.2.2:8000/api/google-callback/auth/google-signout';
      let response = await axios.post(url, token, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if ((response.status = 200)) {
        await AsyncStorage.clear();
        await setUserData(null);
      }
    } catch (error) {
      console.error('Error revoking token:', error);
    }
  };
};

export default Logout;
