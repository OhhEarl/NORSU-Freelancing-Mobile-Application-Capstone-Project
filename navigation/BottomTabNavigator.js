import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useGetIsStudent } from '../hooks/dataHooks/useGetIsStudent';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateProjectScreen from '../screens/CreateProjectScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as theme from "../assets/constants/theme";


const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {

  const [error, loading, isStudent] = useGetIsStudent();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name={'HomeScreen'}
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={25}
              color={focused ? theme.colors.primary : theme.colors.BLACKS}
            />
          ),

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
              color={focused ? theme.colors.primary : theme.colors.BLACKS}
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
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user"
              size={25}
              color={focused ? theme.colors.primary : theme.colors.BLACKS}
            />
          ),

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
    backgroundColor: theme.colors.grey,
    opacity: 0.8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    marginRight: 12,
  },
});
