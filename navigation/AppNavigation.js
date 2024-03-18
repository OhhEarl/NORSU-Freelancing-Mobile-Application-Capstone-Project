import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';
import VerificationScreen from '../screens/VerificationScreen';
import VerificationNotification from '../screens/VerificationNotification';
import VerificationConfirmation from '../screens/VerificationConfirmation';
import HomeScreen from '../screens/HomeScreen';
import {AuthProvider, useAuthContext} from '../hooks/AuthContext';
import {useGetIsStudent} from '../hooks/dataHooks/useGetIsStudent';
import {BottomTabNavigator} from './BottomTabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
const Stack = createNativeStackNavigator();

const AuthenticatedApp = () => {
  const {user, isLoading, isEmailVerified} = useAuthContext();
  const [error, loading, isStudent] = useGetIsStudent();

  if (isLoading || loading) {
    return <ActivityIndicator size="large" style={styles.indicator} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user && isEmailVerified && !isLoading ? (
          <>
            {isStudent !== null && !loading ? (
              isStudent.is_student === 0 ? (
                <Stack.Screen
                  name="VerificationConfirmation"
                  component={VerificationConfirmation}
                  options={{headerShown: false}}
                />
              ) : isStudent.is_student === 1 && !loading ? (
                <Stack.Screen
                  name="BottomTabNavigator"
                  component={BottomTabNavigator} // Render BottomTabNavigator within a Screen component
                  options={{headerShown: false}}
                />
              ) : (
                <>
                  <Stack.Screen
                    name="VerificationNotification"
                    component={VerificationNotification}
                    options={{
                      title: 'Verify ID',
                      headerStyle: {
                        backgroundColor: '#41b5bd',
                      },
                      headerTintColor: '#fff',
                      headerTitleStyle: {
                        fontWeight: '400',
                      },
                      headerTitleAlign: 'center',
                    }}
                  />
                  <Stack.Screen
                    name="VerificationScreen"
                    component={VerificationScreen}
                    options={{headerShown: false}}
                  />
                </>
              )
            ) : (
              <>
                <Stack.Screen
                  name="VerificationNotification"
                  component={VerificationNotification}
                  options={{
                    title: 'Verify ID',
                    headerStyle: {
                      backgroundColor: '#41b5bd',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: '400',
                    },
                    headerTitleAlign: 'center',
                  }}
                />
                <Stack.Screen
                  name="VerificationScreen"
                  component={VerificationScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="VerificationConfirmation"
                  component={VerificationConfirmation}
                  options={{headerShown: false}}
                />
              </>
            )}
          </>
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
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppNavigation = () => {
  return (
    <AuthProvider>
      <AuthenticatedApp />
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
