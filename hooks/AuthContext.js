import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AxiosError } from 'axios';
GoogleSignin.configure({
  webClientId:
    '1070570385371-6p351s3v9d1tr5mvrqfqhbe4vnn59mhb.apps.googleusercontent.com',
});
import DeviceInfo from 'react-native-device-info';

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children, navigation }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const uniqueId = DeviceInfo.getUniqueId();
  const [email, setEmailLogin] = useState('');
  const [password, setPasswordLogin] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [token, setToken] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(false);

  const onGoogleButtonPress = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      let url = 'http://10.0.2.2:8000/api/google-callback/auth/google-login';
      let payload = { idToken: idToken };
      let response = await axios.post(url, payload, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;

      if (data) {
        await AsyncStorage.setItem('userInformation', JSON.stringify(data));
        await setUserData(data);
        await auth().signInWithCredential(googleCredential);
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        await GoogleSignin.revokeAccess().then(() =>
          navigation.navigate('Login'),
        );
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Sign-in process is in progress.');
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('Signin Required');
      } else {
        setError('Something Went Wrong! Please Try Again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const userAuth = userCredential.user;
      if (userAuth.emailVerified === false) {
        setError(
          'Email is not verified. Please verify your email before logging in.',
        );

      } else {
        setIsLoading(true);
        const response = await axios.post(
          'http://10.0.2.2:8000/api/email-password/auth/register',
          {
            email: userAuth.email,
            password: password,
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        const data = response.data;
        if (data) {
          await AsyncStorage.setItem(
            'userInformation',
            JSON.stringify(data),
          );

          await setUserData(data);
          setIsLoading(false);
        }
        setUser(userAuth);


      }
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (error.code === 'auth/user-disabled') {
        setError('The user account has been disabled.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid email address or password.');
      } else {
        alert(error);
      }


    }
  };



  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setIsLoading(true);
      if (user) {
        setUser(user);
        setIsEmailVerified(user.emailVerified);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        error,
        onGoogleButtonPress,
        userData,
        handleSignIn,
        setEmailLogin,
        setPasswordLogin,
        isEmailVerified,
        setUserData,
        setIsLoading
      }}>
      {children}
    </AuthContext.Provider>
  );
};
