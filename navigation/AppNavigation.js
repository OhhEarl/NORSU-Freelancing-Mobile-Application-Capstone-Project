import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuthContext } from '../hooks/AuthContext';
import { PeopleProvider, usePeopleContext } from '../hooks/PeopleContext';
// import { ProposalProvider, useProposalContext } from '../hooks/ProposalContext';
import { MessageProvider, useMessageContext } from '../hooks/MessageContext';
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

import ProposalListScreen from '../screens/ProposalListScreen';
import FreelancerProfileScreen from '../screens/FreelancerProfileScreen';
import NetInfo from "@react-native-community/netinfo";
import OpeningScreen from '../components/OpeningScreen';
import { ProjectProvider } from '../hooks/ProjectContext';
import SubmitOutputScreen from '../screens/SubmitOutputScreen';
import GcashPaymentScreen from '../screens/GcashPaymentScreen';
import GcashPaymentRequest from '../screens/GcashPaymentRequest';
import TermsAndConditions from '../screens/TermsAndConditions';
import FeedBackRatingScreen from '../screens/FeedBackRatingScreen';
import ProjectDetailsHireScreen from '../screens/ProjectDetailsHireScreen';
import OutputScreen from '../screens/OutputScreen';
import CreateProjectScreenHire from '../screens/CreateProjectScreenHire';
import ProposalSubmittedScreen from '../screens/ProposalSubmittedScreen';
import ProposalRequestedScreen from '../screens/ProposalRequestedScreen';


const AuthenticatedApp = () => {
  const { token, user, isLoading, isStudent, student, isLoggedIn } = useAuthContext();
  const { peopleLoading } = usePeopleContext();
  const [isConnected, setIsConnected] = useState(true);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [showOpeningScreen, setShowOpeningScreen] = useState(true);
  const [loading, setLoading] = useState(false);




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

  useEffect(() => {
    let timer;

    if (isLoading) {
      setLoading(true);
    } else {
      timer = setTimeout(() => {
        setLoading(false);
      }, 5000);
    }

    return () => {
      if (student) {
        clearTimeout(timer);
        setLoading(false); // Ensure loading state is false immediately
      }
    };
  }, [isLoading, student]);


  useEffect(() => {

    const timer = setTimeout(() => {
      setShowOpeningScreen(false);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);


  if (showOpeningScreen && isCheckingConnection) {
    return <OpeningScreen />;
  }

  if (!isConnected) {
    return <NoConnection />;
  }


  if (peopleLoading || loading) {
    return <LoadingComponent />;
  }




  const UserStack = createNativeStackNavigator();
  const User = () => (
    <UserStack.Navigator initialRouteName={Welcome}>

      <UserStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <UserStack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <UserStack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
    </UserStack.Navigator>
  );

  const StudentStack = createNativeStackNavigator();
  const Student = () => (
    <StudentStack.Navigator>

      <StudentStack.Screen name="VerificationNotification" component={VerificationNotification} options={{ headerShown: false }} />
      <StudentStack.Screen name="MultiStepForm" component={MultiStepForm} options={{ headerShown: false }} />
      <StudentStack.Screen name="VerificationConfirmation" component={VerificationConfirmation} options={{ headerShown: false }} />
    </StudentStack.Navigator>
  );

  const StudentVerificationStack = createNativeStackNavigator();
  const StudentVerification = () => (
    <StudentVerificationStack.Navigator>
      <StudentVerificationStack.Screen name="VerificationConfirmation" component={VerificationConfirmation} options={{ headerShown: false }} />
    </StudentVerificationStack.Navigator>
  );

  const MainTabStack = createNativeStackNavigator();
  const Main = () => (
    <MainTabStack.Navigator>
      <MainTabStack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false }} initialParams={{ isStudent }} />
      <MainTabStack.Screen name="ProjectDetailsScreen" component={ProjectDetailsScreen} options={{ headerShown: false }} />
      <MainTabStack.Screen name="EditProfileScreen" initialParams={{ isStudent }} component={EditProfileScreen} options={{ headerShown: false }} />
      <MainTabStack.Screen initialParams={{ isStudent }} name="ProposalScreen" component={ProposalScreen} options={{ headerShown: false }} />
      <MainTabStack.Screen name="ProposalSubmitted" component={ProposalSubmitted} options={{ headerShown: false }} />
      <MainTabStack.Screen name="ProjectCreated" component={ProjectCreated} options={{ headerShown: false }} initialParams={{ isStudent }} />
      <MainTabStack.Screen name="OutputScreen" component={OutputScreen} initialParams={{ isStudent }} options={{ headerShown: false }} />
      <MainTabStack.Screen name="ProposalListScreen" initialParams={{ isStudent }} component={ProposalListScreen} options={{ headerShown: false }} />
      <MainTabStack.Screen name="FreelancerProfileScreen" component={FreelancerProfileScreen} initialParams={{ isStudent }} options={{ headerShown: false }} />
      <MainTabStack.Screen name="SubmitOutputScreen" component={SubmitOutputScreen} options={{ headerShown: false }} initialParams={{ isStudent }} />
      <MainTabStack.Screen name="GcashPaymentScreen" component={GcashPaymentScreen} options={{ headerShown: false }} initialParams={{ isStudent }} />
      <MainTabStack.Screen name="GcashPaymentRequest" component={GcashPaymentRequest} options={{ headerShown: false }} initialParams={{ isStudent }} />
      <MainTabStack.Screen name="TermsAndConditions" component={TermsAndConditions} options={{ headerShown: false }} />
      <MainTabStack.Screen name="FeedBackRatingScreen" component={FeedBackRatingScreen} initialParams={{ isStudent }} options={{ headerShown: false }} />
      <MainTabStack.Screen name="ProjectDetailsHireScreen" component={ProjectDetailsHireScreen} initialParams={{ isStudent }} options={{ headerShown: false }} />
      <MainTabStack.Screen name="CreateProjectScreenHire" component={CreateProjectScreenHire} initialParams={{ isStudent }} options={{ headerShown: false }} />
      <MainTabStack.Screen name="ProposalSubmittedScreen" component={ProposalSubmittedScreen} initialParams={{ isStudent }} options={{ headerShown: false }} />
      <MainTabStack.Screen name="ProposalRequestedScreen" component={ProposalRequestedScreen} initialParams={{ isStudent }} options={{ headerShown: false }} />

    </MainTabStack.Navigator>
  );


  const renderNavigator = () => {
    if (loading && isLoading) {
      <LoadingComponent />
    } else {
      if (user && token && isLoggedIn) {
        if (isStudent !== null && isStudent !== undefined && student) {
          return <Main />;
        } else if (isStudent !== null && isStudent !== undefined && !student)
          return <StudentVerification />;
        else {
          return <Student />;
        }
      } else {
        return <User />
      }
    }


  };

  return (
    <NavigationContainer>
      {renderNavigator()}
    </NavigationContainer>
  );
};

const AppNavigation = () => {
  return (
    <AuthProvider>

      <ProjectProvider>
        <PeopleProvider>

          <MessageProvider>
            <AuthenticatedApp />
          </MessageProvider>

        </PeopleProvider>
      </ProjectProvider>

    </AuthProvider>
  );
};

export default AppNavigation;
