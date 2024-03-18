import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Logout from '../hooks/Logout';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import  CreateProjectScreen  from '../screens/CreateProjectScreen';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';

import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS } from '../assets/constants';
import IMAGES from '../assets/images';
import {Image} from 'react-native';
import COLOR from '../constants/colors';

const Tab = createBottomTabNavigator();
export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName={HomeScreen}>
    <Tab.Screen
      name={"Home Screen"}
      component={HomeScreen}
      options={{
        title: 'Home',
        tabBarIcon: ({focused}) => (
          <Image
            source={IMAGES.HOME}
            style={{
              height: 25,
              width: 25,
              tintColor: focused ? COLOR.primary : COLOR.BLACK,
            }}
          />
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.BLACK,
      }}
    />
 
 <Tab.Screen
  name={'CreateProjectScreen'}
  component={CreateProjectScreen}
  options={{
    title: 'Create Project',
    headerShown: false, 
    tabBarIcon: ({ focused }) => (
      <Entypo
        name="suitcase" 
        size={25}
        color={focused ? COLOR.primary : COLOR.black}
      />
    ),
  }}
/>
  
    <Tab.Screen
      name={'ProfileScreen'}
      component={ProfileScreen}
      options={{
        title: 'Profile',
         headerShown: false, 
        tabBarIcon: ({focused}) => (
          <Image
            source={IMAGES.PROFILE}
            style={{
              height: 25,
              width: 25,
              tintColor: focused ? COLOR.primary : COLORS.BLACK,
            }}
          />
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.BLACK,
      }}
    />
  </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  log: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: COLORS.grey,
    opacity: 0.8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    marginRight: 12,
  },
});
