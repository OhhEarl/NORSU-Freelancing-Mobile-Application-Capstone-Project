import React from 'react';
import {ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';
import EmailVerification from '../screens/EmailVerification';
import VerificationScreen from '../screens/VerificationScreen';
import useAuth from '../hooks/useAuth';
import HomeScreen from '../screens/HomeScreen';
import { AuthProvider } from '../hooks/AuthContext';
const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const {user, isLoading, error} = useAuth();
  // Handle loading state while user data is being fetched
  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <AuthProvider>
      <NavigationContainer>
      {user ? (
          <Stack.Navigator initialRouteName="VerificationScreen">
            <Stack.Screen
              name="VerificationScreen"
              component={VerificationScreen}
              options={{
                headerShown: false,
            }}
            />
          </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
</AuthProvider>
  );
};

export default AppNavigation;
