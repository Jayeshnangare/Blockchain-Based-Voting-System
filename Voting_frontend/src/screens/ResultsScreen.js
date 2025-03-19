import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';  // Updated import

const statesWithDistricts = { 
  Maharashtra: ['Pune', 'Mumbai', 'Nagpur'],
  Karnataka: ['Bangalore', 'Mysore', 'Hubli'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
  TamilNadu: ['Chennai', 'Coimbatore', 'Madurai'],
};

const cityList = {
  Pune: ['Hinjewadi', 'Shivaji Nagar', 'Kothrud'],
  Mumbai: ['Andheri', 'Dadar', 'Borivali'],
  Nagpur: ['Dharampeth', 'Sitabuldi', 'Manewada'],
  Bangalore: ['Electronic City', 'Whitefield', 'Malleshwaram'],
  Mysore: ['Hebbal', 'Vijayanagar', 'Kuvempunagar'],
  Hubli: ['Gokul Road', 'Vidyanagar', 'Old Hubli'],
  Ahmedabad: ['Navrangpura', 'Maninagar', 'Bopal'],
  Surat: ['Adajan', 'Vesu', 'Varachha'],
  Vadodara: ['Alkapuri', 'Gotri', 'Manjalpur'],
  Chennai: ['Adyar', 'T. Nagar', 'Velachery'],
  Coimbatore: ['RS Puram', 'Gandhipuram', 'Peelamedu'],
  Madurai: ['Anna Nagar', 'KK Nagar', 'Alagappan Nagar'],
};

const allResults = [
  { name: "Candidate 1", city: "Hinjewadi", votes: 100 },
  { name: "Candidate 2", city: "Dadar", votes: 150 },
  { name: "Candidate 3", city: "Kothrud", votes: 200 },
  { name: "Candidate 4", city: "Adyar", votes: 250 },
  { name: "Candidate 5", city: "T. Nagar", votes: 300 }
];

const ResultsScreen = ({ navigation }) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [results, setResults] = useState([]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setDistricts(statesWithDistricts[state] || []);
    setSelectedDistrict("");
    setCities([]);
    setSelectedCity("");
    setResults([]);
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setCities(cityList[district] || []);
    setSelectedCity("");
    setResults([]);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    const filteredResults = allResults.filter((result) => result.city === city);
    setResults(filteredResults);
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Result Page</Text>
      </View>
      
      {/* State Filter */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedState}
          onValueChange={(itemValue) => handleStateChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select State" value="" />
          {Object.keys(statesWithDistricts).map((state, index) => (
            <Picker.Item key={index} label={state} value={state} />
          ))}
        </Picker>
      </View>

      {/* District Filter */}
      {selectedState && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDistrict}
            onValueChange={(itemValue) => handleDistrictChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select District" value="" />
            {districts.map((district, index) => (
              <Picker.Item key={index} label={district} value={district} />
            ))}
          </Picker>
        </View>
      )}

      {/* City Filter */}
      {selectedDistrict && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue) => handleCityChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select City" value="" />
            {cities.map((city, index) => (
              <Picker.Item key={index} label={city} value={city} />
            ))}
          </Picker>
        </View>
      )}

      {/* Display Results in Table */}
      {selectedCity && results.length > 0 && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Candidate Name</Text>
            <Text style={styles.tableHeaderText}>Votes</Text>
          </View>
          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.votes}</Text>
              </View>
            )}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.voteButton}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={styles.voteButtonText}>Go to HOME PAGE</Text>
      </TouchableOpacity>      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Soft White
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  header: {
    backgroundColor: '#0056B3',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 20,  // Add this line for space after the header
  },
  headerText:{
    color: '#F8F9FA',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Open Sans',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  pickerContainer: {
    backgroundColor: '#EAECEE',
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20, // Adding margin to separate pickers
    borderWidth: 1,
    borderColor: '#0056B3',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  tableContainer: {
    width: '90%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#EAECEE', // Cool Gray
    borderRadius: 5
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#005683', // Royal Blue for header
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#EAECEE'
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#F8F9FA', // Soft White text in header
    fontFamily: 'Open Sans',
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#EAECEE'
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#2D2D44', // Deep Gray text
    fontFamily: 'Open Sans',
    textAlign: 'center'
  },
  voteButton: {
    backgroundColor: '#EAECEE',
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#0056B3',
  },
  voteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0056B3',
    textAlign: 'center',
    letterSpacing: 1.1
  }
});

export default ResultsScreen;
