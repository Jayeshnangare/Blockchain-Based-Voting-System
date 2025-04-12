import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

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

const VotingEvent = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) setStartTime(selectedTime);
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) setEndTime(selectedTime);
  };

  const handleSubmit = async () => {
    const eventDetails = {
      state,
      district,
      city,
      date: date.toDateString(),
      startTime: startTime ? startTime.toLocaleTimeString() : "00:00",
      endTime: endTime ? endTime.toLocaleTimeString() : "00:00",
    };
  
    console.log("📤 Sending event details:", eventDetails);
  
    try {
      const response = await fetch("http://192.168.0.104:5000/api/voting-events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventDetails),
      });
  
      const data = await response.json();
      console.log("📥 Response:", data);
  
      if (response.ok) {
        alert("✅ Voting event created successfully!");
      } else {
        alert(data.error || "❌ Failed to create event");
      }
    } catch (error) {
      console.error("❌ Error in API call:", error);
      alert("Something went wrong");
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Voting Event</Text>

      {/* State Picker */}
      <Text style={styles.label}>Select State:</Text>
      <Picker selectedValue={state} onValueChange={(value) => setState(value)} style={styles.picker}>
        <Picker.Item label="Select State" value="" />
        {Object.keys(statesWithDistricts).map((state, index) => (
          <Picker.Item key={index} label={state} value={state} />
        ))}
      </Picker>

      {/* District Picker */}
      <Text style={styles.label}>Select District:</Text>
      <Picker selectedValue={district} onValueChange={(value) => setDistrict(value)} style={styles.picker}>
        <Picker.Item label="Select District" value="" />
        {statesWithDistricts[state]?.map((district, index) => (
          <Picker.Item key={index} label={district} value={district} />
        ))}
      </Picker>

      {/* City Picker */}
      <Text style={styles.label}>Select City:</Text>
      <Picker selectedValue={city} onValueChange={(value) => setCity(value)} style={styles.picker}>
        <Picker.Item label="Select City" value="" />
        {cityList[district]?.map((city, index) => (
          <Picker.Item key={index} label={city} value={city} />
        ))}
      </Picker>

      {/* Date Picker */}
      <Text style={styles.label}>Select Date:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
      )}

      {/* Start Time Picker */}
      <Text style={styles.label}>Start Time:</Text>
      <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.input}>
        <Text>{startTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker value={startTime} mode="time" display="default" onChange={onStartTimeChange} />
      )}

      {/* End Time Picker */}
      <Text style={styles.label}>End Time:</Text>
      <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.input}>
        <Text>{endTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker value={endTime} mode="time" display="default" onChange={onEndTimeChange} />
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
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
    maxWidth: 800, // ✅ FIXED ERROR
    width: "90%", // ✅ Increased container width
    margin: "auto",
  },
  header: {
    color: "#0056B3",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#2D2D44",
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#EAECEE",
    color: "#2D2D44",
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#EAECEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0056B3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#F8F9FA",
    fontWeight: "bold",
  },
});

export default VotingEvent;
