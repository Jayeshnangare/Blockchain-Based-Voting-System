import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";

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

const ViewCandidate = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCandidates = async () => {
    if (!selectedState || !selectedDistrict || !selectedCity) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://192.168.0.104:5000/api/candidates/filter?state=${selectedState}&district=${selectedDistrict}&city=${selectedCity}`
      );
      const data = await response.json();

      if (response.ok) {
        setCandidates(data);
      } else {
        setCandidates([]);
        setError(data.message || "No candidates found");
      }
    } catch (err) {
      setError("Failed to fetch candidates. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [selectedCity]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>View Candidates</Text>

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
          {Object.keys(statesWithDistricts).map((state) => (
            <Picker.Item key={state} label={state} value={state} />
          ))}
        </Picker>
      </View>

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
            {statesWithDistricts[selectedState].map((district) => (
              <Picker.Item key={district} label={district} value={district} />
            ))}
          </Picker>
        </View>
      )}

      {selectedDistrict !== "" && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select City:</Text>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(value) => setSelectedCity(value)}
            style={styles.picker}
          >
            <Picker.Item label="--Select City--" value="" />
            {cityList[selectedDistrict].map((city) => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        </View>
      )}

      {selectedCity !== "" && (
        <View style={styles.candidateList}>
          <Text style={styles.subHeading}>Candidates in {selectedCity}</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Name</Text>
                <Text style={styles.tableHeaderCell}>Party</Text>
              </View>
              <FlatList
                data={candidates}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                    <Text style={styles.tableCell}>{item.party}</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
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
  },
  picker: {
    backgroundColor: "#EAECEE",
    borderRadius: 8,
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0056B3",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  candidateList: {
    marginTop: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333",
  },
});

export default ViewCandidate;
