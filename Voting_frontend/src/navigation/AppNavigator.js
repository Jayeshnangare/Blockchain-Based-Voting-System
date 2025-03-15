import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import your screens
import RegistrationScreen from "../screens/RegistrationScreen";
import AdminScreen from "../screens/AdminScreen";
import VotingScreen from "../screens/VotingScreen";
import ResultsScreen from "../screens/ResultsScreen";
import MainScreen from "../screens/MainScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Voting" component={VotingScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Main" component={MainScreen}  options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
