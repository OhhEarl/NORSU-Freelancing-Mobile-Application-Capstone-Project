import React, { createContext, useContext, useEffect, useState, Alert } from 'react';
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


const AuthContext = createContext({
  token: null
});

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
  const [student, setStudent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
  }, [user])


  const fetchIsStudent = async () => {
    if (token) {
      try {
        setIsLoading(true);
        const config = {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${URL}/fetch-user-data`, config);
        const data = response.data;
        if (data) {
          await setIsStudent(data)
          if (data.studentInfo.is_student === 1) {
            setStudent(true)
          } else {
            setStudent(false)
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false)
      }
    }
  };

  useEffect(() => {
    fetchIsStudent();

  }, [token]);


  const onGoogleButtonPress = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      let url = `${URL}/google-callback/auth/google-login`
      let payload = { idToken: googleCredential.token };


      let response = await axios.post(url, payload, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;

      if (response.status === 200) {
        await AsyncStorage.setItem('userInformation', JSON.stringify(data));
        await setUserData(data);
        await setToken(data.token)
        await auth().signInWithCredential(googleCredential);
      }

    } catch (error) {

      setError('Error during Google Sign-in:', error); // Log the entire error for debugging
      switch (error.code) {
        case 12501:
          await GoogleSignin.revokeAccess();
          setError('Revoking access due to error 12501'); // Warn about access revocation
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          setError('Google Play Services Unavailable', statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
          break;
        case statusCodes.IN_PROGRESS:
          setError('Sign-in Process In Progress');
          break;
        case statusCodes.SIGN_IN_REQUIRED:
          setError('Sign In Required');
          break;
        default:
          setError('Something Went Wrong. Please Try Again. ' + error.message + '.');
          break;
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (email && password) {
      try {
        setIsLoading(true);
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

          let url = `${URL}/email-password/auth/register`
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
            await AsyncStorage.setItem('userInformation', JSON.stringify(data));
            await setUserData(data);
            await setToken(data.token)
            setUser(userAuth);
          }

        }
      } catch (error) {
        if (error.code === 'auth/invalid-email') {
          setError('Invalid email address.');
        } else if (error.code === 'auth/user-disabled') {
          setError('The user account has been disabled.');
        } else if (error.code === 'auth/invalid-credential') {
          setError('Invalid email address or password.');
        } else {
          setError('Invalid email address or password.');
        }
      } finally {
        setIsLoading(false);
      }



    }
  };


  useEffect(() => {
    let timeoutId;

    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      setIsLoading(true);
      clearTimeout(timeoutId); // Clear previous timeout

      if (user && token) {
        setUser(user);
        setIsEmailVerified(user.emailVerified);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsStudent(null);
        setIsLoggedIn(false);
      }

      // Set timeout to recheck user after 5 seconds (adjust as needed)
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 15000);
    });

    return () => {
      clearTimeout(timeoutId); // Clear timeout on component unmount
      unsubscribe();
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        isLoading,
        error,
        setError,
        onGoogleButtonPress,
        userData,
        handleSignIn,
        setEmailLogin,
        setPasswordLogin,
        isEmailVerified,
        setUserData,
        setIsLoading,
        isStudent,
        updateIsStudent,
        setIsEmailVerified,
        setIsStudent,
        student,
        isLoggedIn
      }}>
      {children}
    </AuthContext.Provider>
  );
};
