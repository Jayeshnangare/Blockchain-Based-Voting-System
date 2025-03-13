import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, Alert } from "react-native";
import { RadioButton } from "react-native-paper";
import axios from "axios";

const VotingScreen = ({ navigation }) => {
  const [voterId, setVoterId] = useState("");
  const [otp, setOtp] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    axios.get("https://your-backend-api.com/candidates?city=user_city")
      .then(response => setCandidates(response.data))
      .catch(error => console.error("Error fetching candidates:", error));
  }, []);

  const handleSendOtp = () => {
    if (!voterId) {
      Alert.alert("Error", "Please enter your Voting ID.");
      return;
    }
    axios.post("https://your-backend-api.com/send-otp", { voterId })
      .then(response => {
        if (response.data.success) {
          setOtpSent(true);
          Alert.alert("OTP Sent", "Enter the OTP received on your phone.");
        } else {
          Alert.alert("Error", response.data.message);
        }
      })
      .catch(error => console.error("Error sending OTP:", error));
  };

  const handleVote = () => {
    if (!selectedCandidate) {
      Alert.alert("Error", "Please select a candidate.");
      return;
    }
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    axios.post("https://your-backend-api.com/verify-vote", { voterId, otp, candidateId: selectedCandidate })
      .then(response => {
        if (response.data.success) {
          Alert.alert("Vote Recorded", "Your vote has been successfully cast!");
          navigation.navigate("HomeScreen");
        } else {
          Alert.alert("Error", response.data.message);
        }
      })
      .catch(error => console.error("Error verifying vote:", error));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6", padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Voting Page</Text>

      <TextInput
        placeholder="Enter Your Voting ID"
        value={voterId}
        onChangeText={setVoterId}
        style={{ width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 }}
      />

      <TouchableOpacity onPress={handleSendOtp} style={{ backgroundColor: "#3b82f6", padding: 12, borderRadius: 8, marginBottom: 10 }}>
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>Send OTP</Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: "#fff", padding: 16, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Select Candidate</Text>
        {candidates.map(candidate => (
          <TouchableOpacity key={candidate.id} onPress={() => setSelectedCandidate(candidate.id)}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <RadioButton
                value={candidate.id}
                status={selectedCandidate === candidate.id ? "checked" : "unchecked"}
                onPress={() => setSelectedCandidate(candidate.id)}
              />
              <Text style={{ fontSize: 16 }}>{candidate.name} ({candidate.party})</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {otpSent && (
        <TextInput
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          style={{ width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 }}
          keyboardType="numeric"
        />
      )}

      <TouchableOpacity onPress={handleVote} style={{ backgroundColor: "#10b981", padding: 12, borderRadius: 8 }}>
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>Submit Vote</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VotingScreen;
