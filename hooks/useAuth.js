import React, {useState, useEffect} from 'react';
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

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null); // from Firebase login
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoSet, setUserInfoSet] = useState(false);

  const onGoogleButtonPress = async navigation => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      let url = 'http://10.0.2.2:8000/api/google-callback/auth/google-login';
      let payload = {idToken: idToken};
      let response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      if (data) {
        try {
          await AsyncStorage.setItem('token', data.token);
          setIsLoading(true)
          setUserInfo(data.user.id);
          setUserInfoSet(true); // Set the flag to indicate userInfo is set
          auth().signInWithCredential(googleCredential); // Sign in after setting userInfo
        } catch (error) {
          console.error('Error storing token or setting user info:', error);
        }
      } else {
        console.error('Error: No data received from backend');
      }
      setIsLoading(false)
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
    }
  };

  useEffect(() => {
    if (userInfoSet) {
 console.log('the user is this',userInfo)
    }
  }, [userInfo, userInfoSet]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setIsLoading(false);
      if (user) {
        user
          .getIdToken()
          .then(token => {
            setUserToken(token);
          })
          .catch(error => {
            console.error('Error fetching token:', error);
          });
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return {user, isLoading, error, onGoogleButtonPress, userInfo};
};

export default useAuth;
