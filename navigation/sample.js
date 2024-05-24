import { createNativeStackNavigator } from "@react-navigation/native-stack"

const UserStack = createNativeStackNavigator()

const User = () => {
    return (
        <UserStack.Navigator>
            <UserStack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: false }}
            />
            <UserStack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <UserStack.Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
            />
        </UserStack.Navigator>
    )
}

const StudentStack = createNativeStackNavigator()
const Student = () => {
    return (
        <StudentStack.Navigator>
            <StudentStack.Screen
                name="VerificationNotification"
                component={VerificationNotification}
                options={{ headerShown: false }}
            />

            <StudentStack.Screen
                name="MultiStepForm"
                component={MultiStepForm}
                options={{ headerShown: false }}
            />

            <StudentStack.Screen
                name="VerificationConfirmation"
                component={VerificationConfirmation}
                options={{ headerShown: false }}
            />
        </StudentStack.Navigator>
    )
}


const StudentVerificationStack = createNativeStackNavigator()

const StudentVerification = () => {
    return (
        <StudentVerificationStack.Navigator>
            <StudentVerificationStack.Screen
                name="VerificationConfirmation"
                component={VerificationConfirmation}
                options={{ headerShown: false }}
            />
        </StudentVerificationStack.Navigator>
    )
}



const MainTabStack = createNativeStackNavigator()

const Main = () => {
    return (
        <MainTabStack.Navigator>
            <MainTabStack.Screen
                name="BottomTabNavigator"
                component={BottomTabNavigator} // Render BottomTabNavigator within a Screen component
                options={{ headerShown: false }}
                initialParams={{ isStudent }}
            />
            <MainTabStack.Screen
                name="ProjectDetailsScreen"
                component={ProjectDetailsScreen}
                options={{ headerShown: false }}

            />
            <MainTabStack.Screen
                name="EditProfileScreen"
                initialParams={{ isStudent }}
                component={EditProfileScreen}
                options={{ headerShown: false }}
            />
            <MainTabStack.Screen
                initialParams={{ isStudent }}
                name="ProposalScreen"
                component={ProposalScreen}
                options={{ headerShown: false }}
            />
            <MainTabStack.Screen
                name="ProposalSubmitted"
                component={ProposalSubmitted}
                options={{ headerShown: false }}
            />
            <MainTabStack.Screen
                name="ProjectCreated"
                component={ProjectCreated}
                options={{ headerShown: false }}
                initialParams={{ isStudent }}
            />
            <MainTabStack.Screen
                name="ProjectsCompleted"
                component={ProjectsCompleted}
                options={{ headerShown: false }}
            />
            <MainTabStack.Screen
                name="ProposalListScreen"
                initialParams={{ isStudent }}
                component={ProposalListScreen}
                options={{ headerShown: false }}
            />

            <MainTabStack.Screen
                name="FreelancerProfileScreen"
                component={FreelancerProfileScreen}
                options={{ headerShown: false }}
            />

            <MainTabStack.Screen
                name="SubmitOutputScreen"
                component={SubmitOutputScreen}
                options={{ headerShown: false }}
                initialParams={{ isStudent }}
            />
            <MainTabStack.Screen
                name="GcashPaymentScreen"
                component={GcashPaymentScreen}
                options={{ headerShown: false }}
                initialParams={{ isStudent }}
            />
            <MainTabStack.Screen
                name="TermsAndConditions"
                component={TermsAndConditions}
                options={{ headerShown: false }}

            />
        </MainTabStack.Navigator>
    )
}



