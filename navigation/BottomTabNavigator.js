import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Logout from '../hooks/Logout';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/colors';

const Tab = createBottomTabNavigator();
export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: COLORS.grey,
            elevation: 0,
          },
          headerRight: () => (
            <View style={styles.log}>
              <MaterialIcons
                name="logout"
                size={25}
                color="#4a4848"
                style={{marginRight: 5}}
              />
              <TouchableOpacity onPress={Logout}>
                <Text style={{fontSize: 16}}>Logout</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: COLORS.secondary,
            elevation: 0,
          },
          tabBarIcon: ({color, size}) => (
            <View style={{alignItems: 'center'}}>
              <Ionicons name="people-outline" color={color} size={30} />
            </View>
          ),
          headerRight: () => (
            <View style={styles.log}>
              <MaterialIcons
                name="logout"
                size={25}
                color="white"
                style={{marginRight: 5}}
              />
              <TouchableOpacity onPress={Logout}>
                <Text
                  style={{fontSize: 16, color: COLORS.white, fontWeight: 800}}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: COLORS.grey,
    opacity: 0.8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    marginRight: 12,
  },
});
