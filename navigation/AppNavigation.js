import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';
import useAuth from '../hooks/useAuth';
import {AuthProvider} from '../hooks/AuthContext';
import VerificationScreen from '../screens/VerificationScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = ({navigation}) => {
  const {user, isLoading, userInfo} = useAuth();

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.indicator} />;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {user && !isLoading ?  (
            <Stack.Screen
              name="VerificationScreen"
              component={VerificationScreen}
              options={{headerShown: false}}
            />
          ) : (
            <>
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{headerShown: false}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
