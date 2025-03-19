import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const locationData = {
  Maharashtra: {
    Pune: ["Hinjewadi", "Shivaji Nagar", "Kothrud"],
    Mumbai: ["Andheri", "Dadar", "Borivali"],
    Nagpur: ["Dharampeth", "Sitabuldi", "Manewada"],
  },
  Karnataka: {
    Bangalore: ["Electronic City", "Whitefield", "Malleshwaram"],
    Mysore: ["Hebbal", "Vijayanagar", "Kuvempunagar"],
    Hubli: ["Gokul Road", "Vidyanagar", "Old Hubli"],
  },
  Gujarat: {
    Ahmedabad: ["Navrangpura", "Maninagar", "Bopal"],
    Surat: ["Adajan", "Vesu", "Varachha"],
    Vadodara: ["Alkapuri", "Gotri", "Manjalpur"],
  },
  TamilNadu: {
    Chennai: ["Adyar", "T. Nagar", "Velachery"],
    Coimbatore: ["RS Puram", "Gandhipuram", "Peelamedu"],
    Madurai: ["Anna Nagar", "KK Nagar", "Alagappan Nagar"],
  },
};

const ViewCandidate = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>View Candidates</Text>

      {/* State Picker */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Select State:</Text>
        <Picker
          selectedValue={selectedState}
          onValueChange={(value) => {
            setSelectedState(value);
            setSelectedDistrict("");
            setSelectedCity("");
          }}
          style={styles.picker}
        >
          <Picker.Item label="--Select State--" value="" />
          {Object.keys(locationData).map((state) => (
            <Picker.Item key={state} label={state} value={state} />
          ))}
        </Picker>
      </View>

      {/* District Picker */}
      {selectedState !== "" && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select District:</Text>
          <Picker
            selectedValue={selectedDistrict}
            onValueChange={(value) => {
              setSelectedDistrict(value);
              setSelectedCity("");
            }}
            style={styles.picker}
          >
            <Picker.Item label="--Select District--" value="" />
            {Object.keys(locationData[selectedState]).map((district) => (
              <Picker.Item key={district} label={district} value={district} />
            ))}
          </Picker>
        </View>
      )}

      {/* City Picker */}
      {selectedDistrict !== "" && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select City:</Text>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(value) => setSelectedCity(value)}
            style={styles.picker}
          >
            <Picker.Item label="--Select City--" value="" />
            {locationData[selectedState][selectedDistrict].map((city) => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        </View>
      )}

      {/* Candidate List */}
      {selectedCity !== "" && (
        <View style={styles.candidateList}>
          <Text style={styles.subHeading}>Candidates in {selectedCity}</Text>
          {/* Add logic here to fetch and display candidates based on selected city */}
          <Text style={styles.candidate}>Candidate 1 - Party 1</Text>
          <Text style={styles.candidate}>Candidate 2 - Party 2</Text>
          <Text style={styles.candidate}>Candidate 3 - Party 3</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    maxWidth: 600,
    margin: "auto",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0056B3",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2D2D44",
  },
  picker: {
    backgroundColor: "#EAECEE",
    borderRadius: 8,
    padding: 10,
  },
  candidateList: {
    marginTop: 20,
    backgroundColor: "#EAECEE",
    padding: 15,
    borderRadius: 8,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2D2D44",
  },
  candidate: {
    fontSize: 16,
    paddingVertical: 5,
    color: "#333",
  },
});

export default ViewCandidate;
