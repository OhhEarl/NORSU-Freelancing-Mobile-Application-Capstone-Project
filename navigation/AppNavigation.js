import React, { useState, useEffect } from 'react';
import { Alert, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuthContext } from '../hooks/AuthContext';
import { BottomTabNavigator } from './BottomTabNavigator';
import NoConnection from '../components/NoConnection';
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
import ProjectsCompleted from '../screens/ProjectsCompleted';
import ProposalListScreen from '../screens/ProposalListScreen';
import FreelancerProfileScreen from '../screens/FreelancerProfileScreen';
const Stack = createNativeStackNavigator();
import NetInfo from "@react-native-community/netinfo";
import OpeningScreen from '../components/OpeningScreen';


const AuthenticatedApp = () => {
  const { user, error, isLoading, isEmailVerified, isStudent } = useAuthContext();
  const [isConnected, setIsConnected] = useState(true);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);


  useEffect(() => {
    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      setIsCheckingConnection(false); // Set to false once checked
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    checkConnection(); // Call the function to check connection


    return () => {
      unsubscribe();
    };
  }, []);




  if (isCheckingConnection) {
    return <OpeningScreen />; // Return a loading component while checking connection
  }

  if (!isConnected) {
    return (
      <NoConnection />
    );
  }

  return (
    <NavigationContainer>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <Stack.Navigator>
          {user && isEmailVerified ? (
            <>
              {isStudent !== null ? (
                isStudent.studentInfo?.is_student === 0 ? (
                  <Stack.Screen
                    name="VerificationConfirmation"
                    component={VerificationConfirmation}
                    options={{ headerShown: false }}
                  />
                ) : isStudent.studentInfo?.is_student === 1 ? (
                  <Stack.Screen
                    name="BottomTabNavigator"
                    component={BottomTabNavigator} // Render BottomTabNavigator within a Screen component
                    options={{ headerShown: false }}
                    initialParams={{ isStudent }}
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
          <></>
          <Stack.Screen
            name="ProjectDetailsScreen"
            component={ProjectDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfileScreen"
            initialParams={{ isStudent }}
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
          <Stack.Screen
            name="ProjectsCompleted"
            component={ProjectsCompleted}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProposalListScreen"
            component={ProposalListScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="FreelancerProfileScreen"
            component={FreelancerProfileScreen}
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


