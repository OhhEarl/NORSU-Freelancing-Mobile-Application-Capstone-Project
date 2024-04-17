import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuthContext } from '../hooks/AuthContext';
import { useGetIsStudent } from '../hooks/dataHooks/useGetIsStudent';
import { BottomTabNavigator } from './BottomTabNavigator';

// Screens
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';
import VerificationNotification from '../screens/VerificationNotification';
import VerificationConfirmation from '../screens/VerificationConfirmation';
import EditProfileScreen from '../screens/EditProfileScreen';
import MultiStepForm from '../screens/MultiStepForm';
import LoadingComponent from '../components/LoadingComponent';
import ProjectDetailsScreen from '../screens/ProjectDetailsScreen';
import ProposalScreen from '../screens/ProposalScreen';
import ProposalSubmitted from '../screens/ProposalSubmitted';
import ProjectCreated from '../screens/ProjectCreated';
const Stack = createNativeStackNavigator();

const AuthenticatedApp = () => {
  const { user, isLoading, isEmailVerified } = useAuthContext();
  const [error, loading, isStudent, fetchIsStudent] = useGetIsStudent();

  return (
    <NavigationContainer>
      {loading || isLoading ? (
        <LoadingComponent />
      ) : (
        <Stack.Navigator>
          {user && isEmailVerified && !isLoading ? (
            <>
              {isStudent !== null && !loading ? (
                isStudent.studentInfo?.is_student === 0 ? (
                  <Stack.Screen
                    name="VerificationConfirmation"
                    component={VerificationConfirmation}
                    options={{ headerShown: false }}
                  />
                ) : isStudent.studentInfo?.is_student === 1 && !loading ? (
                  <Stack.Screen
                    name="BottomTabNavigator"
                    component={BottomTabNavigator} // Render BottomTabNavigator within a Screen component
                    options={{ headerShown: false }}
                  />
                ) : (
                  <>
                    <Stack.Screen
                      name="VerificationNotification"
                      component={VerificationNotification}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="MultiStepForm"
                      component={MultiStepForm}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="VerificationConfirmation"
                      component={VerificationConfirmation}
                      options={{ headerShown: false }}
                    />
                  </>
                )
              ) : (
                <>
                  {/* <Stack.Screen
                  name="VerificationScreen"
                  component={VerificationScreen}
                  options={{ headerShown: false }}
                /> */}
                  <Stack.Screen
                    name="VerificationNotification"
                    component={VerificationNotification}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="MultiStepForm"
                    component={MultiStepForm}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="VerificationConfirmation"
                    component={VerificationConfirmation}
                    options={{ headerShown: false }}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
              />
            </>
          )}

          <Stack.Screen
            name="ProjectDetailsScreen"
            component={ProjectDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProposalScreen"
            component={ProposalScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProposalSubmitted"
            component={ProposalSubmitted}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProjectCreated"
            component={ProjectCreated}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
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
