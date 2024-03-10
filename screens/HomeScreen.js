import { View, Text, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';

export default function HomeScreen({navigation }) {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken();
  }, []);

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
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userData');
        await setToken(null);
        await setUserData(null);
      }
    } catch (error) {
      console.error('Error revoking token:', error);
    }
  };



    const handleLogout = async () => {
        try {
          await GoogleSignin.signOut();
          await auth().signOut();
          setUser(null);
          navigation.navigate('Login');
        } catch (error) {}
      };

    
  return (
    <SafeAreaView className="flex-1 flex-row justify-center items-center">
        <Text className="text-lg">Home Page - </Text>
        
      
        <View style={{marginBottom: 12}}>
          <Button
            onPress={handleLogout}
            title="Sign Up"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
          />
        </View>
    </SafeAreaView>
  )
}