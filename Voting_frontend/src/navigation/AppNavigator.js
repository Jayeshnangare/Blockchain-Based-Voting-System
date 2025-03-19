import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";


// Import your screens
import RegistrationScreen from "../screens/RegistrationScreen";
import VotingScreen from "../screens/VotingScreen";
import ResultsScreen from "../screens/ResultsScreen";
import MainScreen from "../screens/MainScreen";
import ViewCandidate from "../screens/ViewCandidate";
import VotingEvent from "../screens/VotingEvent";
import AdminLoginScreen from "../screens/AdminLoginScreen"; 
import AdminMainScreen from "../screens/AdminMainScreen"; // Added Admin Dashboard
import CandidateRegistrationScreen from "../screens/CandidateRegistrationScreen";
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Voting" component={VotingScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Main" component={MainScreen}  options={{ headerShown: false }}  />
        <Stack.Screen name="Voting_Event" component={VotingEvent}  />
        <Stack.Screen name="ViewCandidate" component={ViewCandidate}  />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminMain" component={AdminMainScreen} options={{ title: "Admin Dashboard" }} />
        <Stack.Screen name="CandidateRegistration" component={CandidateRegistrationScreen} options={{ title: "Candidate Registration" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
