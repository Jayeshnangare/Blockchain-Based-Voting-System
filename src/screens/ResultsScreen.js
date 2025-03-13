import React from "react";
import { View, Text, Button } from "react-native";

const ResultsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Results Page</Text>
      <Button title="Go to Registration" onPress={() => navigation.navigate("Registration")} />
    </View>
  );
};

export default ResultsScreen;
