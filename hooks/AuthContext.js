import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL } from '@env'


GoogleSignin.configure({
  webClientId:
    '1070570385371-6p351s3v9d1tr5mvrqfqhbe4vnn59mhb.apps.googleusercontent.com',
});


const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children, navigation }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [email, setEmailLogin] = useState('');
  const [password, setPasswordLogin] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [token, setToken] = useState(null);
  const [isStudent, setIsStudent] = useState(null);

  const updateIsStudent = async (updatedStudentData) => {
    setIsStudent(updatedStudentData);
    fetchIsStudent();
  };

  const getToken = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInformation');
      const parsedUserInfo = JSON.parse(userInfo);
      const token = parsedUserInfo?.token;
      if (token) {
        await setToken(token);
      }
    } catch (error) {
      setError(error.message)
    }
  };
  useEffect(() => {
    getToken();
  }, [])



  const fetchIsStudent = async () => {
    if (token) {
      try {
        setIsLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${URL}/api/fetch-user-data`, config);
        const data = response.data;
        await setIsStudent(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false)

      }
    }
  };

  useEffect(() => {
    fetchIsStudent();
  }, [token]); // Added token as a dependency




  const onGoogleButtonPress = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      let url = `${URL}/api/google-callback/auth/google-login`
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
      setIsLoading(false);
    } catch (error) {

      if (error.code === 12501) {
        await GoogleSignin.revokeAccess()
        navigation.navigate('Login')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Sign-in process is in progress.');
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('Signin Required');
      } else {
        alert('Something Went Wrong! Please Try Again.');
      }
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

        let url = `${URL}/api/email-password/auth/register`
        const response = await axios.post(
          url,
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
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      setIsLoading(true);
      if (user) {
        await setUser(user);
        await setIsEmailVerified(user.emailVerified);
      } else {
        await setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
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
        setIsLoading,
        isStudent,
        updateIsStudent
      }}>
      {children}
    </AuthContext.Provider>
  );
};
