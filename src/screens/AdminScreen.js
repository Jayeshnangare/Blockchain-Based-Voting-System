import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from "react-native";

const AdminScreen = ({ navigation }) => {
  const [candidate, setCandidate] = useState({ name: "", party: "", state: "", district: "", city: "" });
  const [event, setEvent] = useState({ date: "", time: "", location: "" });

  const handleCandidateChange = (name, value) => {
    setCandidate({ ...candidate, [name]: value });
  };

  const handleEventChange = (name, value) => {
    setEvent({ ...event, [name]: value });
  };

  const handleCandidateSubmit = () => {
    console.log("Candidate Registered:", candidate);
    Alert.alert("Success", "Candidate registered successfully!");
    setCandidate({ name: "", party: "", state: "", district: "", city: "" });
  };

  const handleEventSubmit = () => {
    console.log("Voting Event Created:", event);
    Alert.alert("Success", "Voting event created successfully!");
    setEvent({ date: "", time: "", location: "" });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Admin Panel</Text>

      {/* Candidate Registration */}
      <View style={styles.card}>
        <Text style={styles.title}>Register Candidate</Text>
        {["name", "party", "state", "district", "city"].map((field) => (
          <TextInput
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={candidate[field]}
            onChangeText={(text) => handleCandidateChange(field, text)}
            style={styles.input}
          />
        ))}
        <TouchableOpacity onPress={handleCandidateSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

        {/* Voting Event Creation (Same Card Structure) */}
        <View style={styles.card}>
        <Text style={styles.title}>Create Voting Event</Text>
        {["date", "time", "location"].map((field) => (
          <TextInput
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={event[field]}
            onChangeText={(text) => handleEventChange(field, text)}
            style={styles.input}
          />
        ))}
        <TouchableOpacity onPress={handleEventSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#FFF",
    width: "100%",
    maxWidth: 400,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#1F2937",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AdminScreen;
