import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const statesWithDistricts = {
  Maharashtra: ["Pune", "Mumbai", "Nagpur"],
  Karnataka: ["Bangalore", "Mysore", "Hubli"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
};

const cityList = {
  Pune: ["Hinjewadi", "Shivaji Nagar", "Kothrud"],
  Mumbai: ["Andheri", "Dadar", "Borivali"],
  Nagpur: ["Dharampeth", "Sitabuldi", "Manewada"],
  Bangalore: ["Electronic City", "Whitefield", "Malleshwaram"],
  Mysore: ["Hebbal", "Vijayanagar", "Kuvempunagar"],
  Hubli: ["Gokul Road", "Vidyanagar", "Old Hubli"],
  Ahmedabad: ["Navrangpura", "Maninagar", "Bopal"],
  Surat: ["Adajan", "Vesu", "Varachha"],
  Vadodara: ["Alkapuri", "Gotri", "Manjalpur"],
  Chennai: ["Adyar", "T. Nagar", "Velachery"],
  Coimbatore: ["RS Puram", "Gandhipuram", "Peelamedu"],
  Madurai: ["Anna Nagar", "KK Nagar", "Alagappan Nagar"],
};

const CandidateRegistrationScreen = () => {
  const [candidate, setCandidate] = useState({
    name: "",
    party: "",
    state: "",
    district: "",
    city: "",
    phone: "",
    aadhar: "",
  });

  const handleRegister = async () => {
    if (!candidate.name || !candidate.party || !candidate.state || !candidate.district || !candidate.city || !candidate.phone || !candidate.aadhar) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    if (!/^\d{10}$/.test(candidate.phone)) {
      Alert.alert("Error", "Phone number must be 10 digits!");
      return;
    }

    if (!/^\d{12}$/.test(candidate.aadhar)) {
      Alert.alert("Error", "Aadhar number must be 12 digits!");
      return;
    }

    try {
      const response = await axios.post("http://192.168.0.103:5000/api/candidates/add", candidate);
      Alert.alert("Success", response.data.message);
      setCandidate({ name: "", party: "", state: "", district: "", city: "", phone: "", aadhar: "" });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F8F9FA" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#0056B3", marginBottom: 15 }}>
        Candidate Registration
      </Text>

      {["name", "party", "phone", "aadhar"].map((field, index) => (
        <TextInput
          key={index}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          placeholderTextColor="#2D2D44"
          style={{ backgroundColor: "#EAECF0", padding: 12, borderRadius: 8, marginBottom: 10, color: "#2D2D44" }}
          value={candidate[field]}
          onChangeText={(text) => setCandidate({ ...candidate, [field]: text })}
          keyboardType={field === "phone" || field === "aadhar" ? "numeric" : "default"}
        />
      ))}

      {/* State Dropdown */}
      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#2D2D44", marginBottom: 5 }}>Select State</Text>
      <Picker
        selectedValue={candidate.state}
        onValueChange={(itemValue) => setCandidate({ ...candidate, state: itemValue, district: "", city: "" })}
        style={{ backgroundColor: "#EAECF0", marginBottom: 10 }}
      >
        <Picker.Item label="Select State" value="" />
        {Object.keys(statesWithDistricts).map((state, index) => (
          <Picker.Item key={index} label={state} value={state} />
        ))}
      </Picker>

      {/* District Dropdown */}
      {candidate.state && (
        <>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#2D2D44", marginBottom: 5 }}>Select District</Text>
          <Picker
            selectedValue={candidate.district}
            onValueChange={(itemValue) => setCandidate({ ...candidate, district: itemValue, city: "" })}
            style={{ backgroundColor: "#EAECF0", marginBottom: 10 }}
          >
            <Picker.Item label="Select District" value="" />
            {statesWithDistricts[candidate.state]?.map((district, index) => (
              <Picker.Item key={index} label={district} value={district} />
            ))}
          </Picker>
        </>
      )}

      {/* City Dropdown */}
      {candidate.district && (
        <>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#2D2D44", marginBottom: 5 }}>Select City</Text>
          <Picker
            selectedValue={candidate.city}
            onValueChange={(itemValue) => setCandidate({ ...candidate, city: itemValue })}
            style={{ backgroundColor: "#EAECF0", marginBottom: 10 }}
          >
            <Picker.Item label="Select City" value="" />
            {cityList[candidate.district]?.map((city, index) => (
              <Picker.Item key={index} label={city} value={city} />
            ))}
          </Picker>
        </>
      )}

      <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: "#0056B3", padding: 12, borderRadius: 8, alignItems: "center" }}>
        <Text style={{ color: "#F8F9FA", fontSize: 16, fontWeight: "bold" }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CandidateRegistrationScreen;
