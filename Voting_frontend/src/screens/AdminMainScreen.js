import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const AdminMainScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F9FA" }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", color: "#0056B3", marginBottom: 30 }}>Admin Dashboard</Text>

      <TouchableOpacity onPress={() => navigation.navigate("CandidateRegistration")} style={{ backgroundColor: "#EAECF0", padding: 20, borderRadius: 12, width: "80%", marginBottom: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2D2D44", textAlign: "center" }}>Candidate Registration</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Voting_Event")} style={{ backgroundColor: "#EAECF0", padding: 20, borderRadius: 12, width: "80%", marginBottom: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2D2D44", textAlign: "center" }}>Voting Event</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ViewCandidate")} style={{ backgroundColor: "#EAECF0", padding: 20, borderRadius: 12, width: "80%" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2D2D44", textAlign: "center" }}>View Candidate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminMainScreen;
