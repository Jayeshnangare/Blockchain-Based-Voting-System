import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const AdminLoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      navigation.navigate("AdminMain");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F9FA" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#0056B3", marginBottom: 20 }}>Admin Login</Text>

      <TextInput
        style={{ width: "80%", padding: 12, backgroundColor: "#EAECF0", borderRadius: 8, marginBottom: 15, color: "#2D2D44" }}
        placeholder="Username"
        placeholderTextColor="#2D2D44"
        onChangeText={setUsername}
      />

      <TextInput
        style={{ width: "80%", padding: 12, backgroundColor: "#EAECF0", borderRadius: 8, marginBottom: 20, color: "#2D2D44" }}
        placeholder="Password"
        placeholderTextColor="#2D2D44"
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "#0056B3", padding: 12, borderRadius: 8, width: "80%", alignItems: "center" }}>
        <Text style={{ color: "#F8F9FA", fontSize: 16, fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminLoginScreen;
