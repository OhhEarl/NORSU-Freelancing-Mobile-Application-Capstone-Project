import {View, Text, TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Button from '../components/Button';
import { useAuthContext } from '../hooks/AuthContext';
export default function HomeScreen({navigation}) {
  

  return (
    <SafeAreaView className="flex-1 flex-row justify-center items-center">
      <Text className="text-lg">Home Page - </Text>

    
    </SafeAreaView>
  );
}
