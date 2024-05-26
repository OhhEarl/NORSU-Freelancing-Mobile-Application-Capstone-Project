import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import HomeScreen from '../screens/HomeScreen';
import FreelancerListScreen from '../screens/FreelancerListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateProjectScreen from '../screens/CreateProjectScreen';
import MessagesScreen from '../screens/MessagesScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as theme from "../assets/constants/theme";


const Tab = createBottomTabNavigator();

export const BottomTabNavigator = ({ route }) => {

  const { isStudent } = route.params

  return (
    <Tab.Navigator>
      <Tab.Screen
        name={'HomeScreen'}
        component={HomeScreen}
        initialParams={{ isStudent }}
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
        name={'FreelancerListScreen'}
        component={FreelancerListScreen}
        initialParams={{ isStudent }}
        options={{
          title: 'Find Freelancer',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account-search"
              size={25}
              color={focused ? theme.colors.primary : theme.colors.BLACKS}
            />
          ),

        }}
      />

      <Tab.Screen
        name={'CreateProjectScreen'}
        component={CreateProjectScreen}
        initialParams={{ isStudent }}
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
        name={'MessagesScreen'}
        component={MessagesScreen}
        initialParams={{ isStudent }}
        options={{
          title: 'Messages',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="message"
              size={25}
              color={focused ? theme.colors.primary : theme.colors.BLACKS}
            />
          ),

        }}
      />

      <Tab.Screen
        name={'ProfileScreen'}
        component={ProfileScreen}
        initialParams={{ isStudent }}
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
