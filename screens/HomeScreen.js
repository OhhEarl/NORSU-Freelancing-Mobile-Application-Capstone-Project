import { View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function HomeScreen() {
    const [initializing, setInitializing] = useState(true);
    
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
        <TouchableOpacity onPress={handleLogout} className="p-1 bg-red-400 rounded-lg">
          <Text className="text-white text-lg font-bold">Logout</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}